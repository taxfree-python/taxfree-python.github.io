/**
 * WebGL2 simulation for the "Memory of Today" work.
 *
 * The state texture starts as the source photograph. Each step advects color
 * along the precomputed gradient field: edge colors invade the image
 * perpendicular to the contours, alternating sides each step. There is no
 * randomness and no grading — the erosion is a pure, monotonic function of
 * the step count, so playback is perfectly smooth and every visit replays the
 * same decay.
 */

const VERTEX_SHADER = `#version 300 es
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

const STEP_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform sampler2D uField;
uniform vec2 uTexel;
uniform float uDirSign;
uniform float uStrength;
uniform float uDistance;
uniform float uScaleMix;
in vec2 vUv;
out vec4 outColor;

void main() {
  vec4 field = texture(uField, vUv);
  vec2 dir = field.rg * 2.0 - 1.0;
  float len = length(dir);
  dir = len > 1e-4 ? dir / len : vec2(0.0);

  float magnitude = mix(field.b, field.a, uScaleMix);
  float pull = clamp(uStrength * magnitude, 0.0, 0.92);

  vec3 current = texture(uState, vUv).rgb;
  vec3 upstream = texture(uState, vUv - uDirSign * dir * uTexel * uDistance).rgb;
  outColor = vec4(mix(current, upstream, pull), 1.0);
}
`;

const SHADE_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform float uFlipY;
in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 uv = vec2(vUv.x, mix(vUv.y, 1.0 - vUv.y, uFlipY));
  outColor = vec4(texture(uTex, uv).rgb, 1.0);
}
`;

export type MemoryEngineInit = {
  canvas: HTMLCanvasElement;
  source: TexImageSource;
  fieldTexture: Uint8Array;
  width: number;
  height: number;
  totalSteps: number;
};

type StepParams = {
  strength: number;
  distance: number;
  scaleMix: number;
};

export class MemoryEngine {
  private gl: WebGL2RenderingContext;
  private stepProgram: WebGLProgram;
  private shadeProgram: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private sourceTexture: WebGLTexture;
  private fieldTexture: WebGLTexture;
  private stateTextures: [WebGLTexture, WebGLTexture];
  private framebuffers: [WebGLFramebuffer, WebGLFramebuffer];
  private current = 0;
  private width: number;
  private height: number;
  private totalSteps: number;
  private stepCount = 0;
  private disposed = false;

  static create(init: MemoryEngineInit): MemoryEngine | null {
    const gl = init.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      return null;
    }
    try {
      return new MemoryEngine(gl, init);
    } catch {
      return null;
    }
  }

  private constructor(gl: WebGL2RenderingContext, init: MemoryEngineInit) {
    this.gl = gl;
    this.width = init.width;
    this.height = init.height;
    this.totalSteps = init.totalSteps;

    init.canvas.width = init.width;
    init.canvas.height = init.height;

    this.stepProgram = this.createProgram(VERTEX_SHADER, STEP_SHADER);
    this.shadeProgram = this.createProgram(VERTEX_SHADER, SHADE_SHADER);
    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error('failed to create VAO');
    }
    this.vao = vao;

    this.sourceTexture = this.createTexture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, init.source);

    this.fieldTexture = this.createTexture();
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      init.width,
      init.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      init.fieldTexture,
    );

    // Half-float state avoids banding accumulating over ~2000 blend steps.
    const floatRenderable = gl.getExtension('EXT_color_buffer_float') !== null;
    const internalFormat = floatRenderable ? gl.RGBA16F : gl.RGBA8;
    const type = floatRenderable ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    const makeTarget = (): [WebGLTexture, WebGLFramebuffer] => {
      const texture = this.createTexture();
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        init.width,
        init.height,
        0,
        gl.RGBA,
        type,
        null,
      );
      const framebuffer = gl.createFramebuffer();
      if (!framebuffer) {
        throw new Error('failed to create framebuffer');
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('framebuffer incomplete');
      }
      return [texture, framebuffer];
    };

    const [textureA, framebufferA] = makeTarget();
    const [textureB, framebufferB] = makeTarget();
    this.stateTextures = [textureA, textureB];
    this.framebuffers = [framebufferA, framebufferB];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.reset();
  }

  get stepIndex(): number {
    return this.stepCount;
  }

  // Tuple access via a 0/1 literal keeps noUncheckedIndexedAccess happy.
  private stateFramebuffer(index: number): WebGLFramebuffer {
    return index === 0 ? this.framebuffers[0] : this.framebuffers[1];
  }

  private stateTexture(index: number): WebGLTexture {
    return index === 0 ? this.stateTextures[0] : this.stateTextures[1];
  }

  /** Restore the state to the untouched source image (step 0). */
  reset(): void {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.stateFramebuffer(this.current));
    gl.viewport(0, 0, this.width, this.height);
    this.shade(this.sourceTexture, 0);
    this.stepCount = 0;
  }

  /** Run `count` simulation steps (ping-pong between the two state targets). */
  advance(count: number): void {
    const { gl } = this;
    gl.useProgram(this.stepProgram);
    gl.bindVertexArray(this.vao);
    gl.viewport(0, 0, this.width, this.height);

    const uniform = (name: string): WebGLUniformLocation | null =>
      gl.getUniformLocation(this.stepProgram, name);
    gl.uniform1i(uniform('uState'), 0);
    gl.uniform1i(uniform('uField'), 1);
    gl.uniform2f(uniform('uTexel'), 1 / this.width, 1 / this.height);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fieldTexture);

    for (let i = 0; i < count; i += 1) {
      const params = this.paramsAt(this.stepCount / this.totalSteps);
      const next = 1 - this.current;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.stateFramebuffer(next));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.stateTexture(this.current));
      gl.uniform1f(uniform('uDirSign'), this.stepCount % 2 === 0 ? 1 : -1);
      gl.uniform1f(uniform('uStrength'), params.strength);
      gl.uniform1f(uniform('uDistance'), params.distance);
      gl.uniform1f(uniform('uScaleMix'), params.scaleMix);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.current = next;
      this.stepCount += 1;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** Draw the current state to the canvas. */
  render(): void {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);
    this.shade(this.stateTexture(this.current), 1);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    const { gl } = this;
    gl.deleteProgram(this.stepProgram);
    gl.deleteProgram(this.shadeProgram);
    gl.deleteVertexArray(this.vao);
    gl.deleteTexture(this.sourceTexture);
    gl.deleteTexture(this.fieldTexture);
    for (const texture of this.stateTextures) {
      gl.deleteTexture(texture);
    }
    for (const framebuffer of this.framebuffers) {
      gl.deleteFramebuffer(framebuffer);
    }
  }

  /**
   * Erosion schedule: the invasion hugs the fine edges gently in the morning,
   * then follows the coarse flow further and harder as the day passes.
   */
  private paramsAt(s: number): StepParams {
    return {
      strength: 0.6 * Math.min(1, 0.3 + 1.6 * s),
      distance: 1 + 2.2 * s,
      scaleMix: Math.min(1, 1.2 * s),
    };
  }

  private shade(texture: WebGLTexture, flipY: number): void {
    const { gl } = this;
    gl.useProgram(this.shadeProgram);
    gl.bindVertexArray(this.vao);
    gl.uniform1i(gl.getUniformLocation(this.shadeProgram, 'uTex'), 0);
    gl.uniform1f(gl.getUniformLocation(this.shadeProgram, 'uFlipY'), flipY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private createTexture(): WebGLTexture {
    const { gl } = this;
    const texture = gl.createTexture();
    if (!texture) {
      throw new Error('failed to create texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const { gl } = this;
    const compile = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type);
      if (!shader) {
        throw new Error('failed to create shader');
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`shader compile failed: ${log ?? 'unknown'}`);
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) {
      throw new Error('failed to create program');
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`program link failed: ${log ?? 'unknown'}`);
    }
    return program;
  }
}
