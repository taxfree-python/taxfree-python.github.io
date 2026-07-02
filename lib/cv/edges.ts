/**
 * Gradient-field extraction for the "Memory of Today" renderer.
 *
 * The simulation needs a flow direction for every pixel, not just the thin
 * Sobel edge band, so two scales are combined: a fine field (where the edges
 * are) and a coarse field from a heavily blurred copy (which way the nearest
 * structure lies, defined everywhere). Both are packed into one RGBA texture.
 */

// Works on plain buffers instead of DOM ImageData so it can run under vitest.
export type PixelSource = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export type GradientField = {
  width: number;
  height: number;
  /** RGBA8: RG = coarse flow direction (unit vector, 0.5-centered), B = fine magnitude, A = coarse magnitude. */
  texture: Uint8Array;
  /** Fine Sobel magnitude normalized to 0..1, for contour extraction. */
  fineMagnitude: Float32Array;
};

export function toLuminance(source: PixelSource): Float32Array {
  const { data, width, height } = source;
  const luminance = new Float32Array(width * height);
  for (let i = 0; i < luminance.length; i += 1) {
    const offset = i * 4;
    const r = data[offset] ?? 0;
    const g = data[offset + 1] ?? 0;
    const b = data[offset + 2] ?? 0;
    luminance[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  return luminance;
}

function blurAxis(
  src: Float32Array,
  dst: Float32Array,
  lineCount: number,
  lineLength: number,
  stride: number,
  lineStride: number,
  radius: number,
): void {
  const window = radius * 2 + 1;
  for (let line = 0; line < lineCount; line += 1) {
    const base = line * lineStride;
    let sum = 0;
    for (let i = -radius; i <= radius; i += 1) {
      const clamped = Math.min(lineLength - 1, Math.max(0, i));
      sum += src[base + clamped * stride] ?? 0;
    }
    for (let i = 0; i < lineLength; i += 1) {
      dst[base + i * stride] = sum / window;
      const outgoing = Math.max(0, i - radius);
      const incoming = Math.min(lineLength - 1, i + radius + 1);
      sum += (src[base + incoming * stride] ?? 0) - (src[base + outgoing * stride] ?? 0);
    }
  }
}

export function boxBlur(
  source: Float32Array,
  width: number,
  height: number,
  radius: number,
  passes = 1,
): Float32Array {
  if (radius <= 0) {
    return Float32Array.from(source);
  }
  const current = Float32Array.from(source);
  const scratch = new Float32Array(source.length);
  for (let pass = 0; pass < passes; pass += 1) {
    blurAxis(current, scratch, height, width, 1, width, radius);
    blurAxis(scratch, current, width, height, width, 1, radius);
  }
  return current;
}

export type SobelResult = {
  gx: Float32Array;
  gy: Float32Array;
  magnitude: Float32Array;
};

export function sobel(luminance: Float32Array, width: number, height: number): SobelResult {
  const gx = new Float32Array(width * height);
  const gy = new Float32Array(width * height);
  const magnitude = new Float32Array(width * height);
  const at = (x: number, y: number): number => {
    const cx = Math.min(width - 1, Math.max(0, x));
    const cy = Math.min(height - 1, Math.max(0, y));
    return luminance[cy * width + cx] ?? 0;
  };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const sx =
        at(x + 1, y - 1) +
        2 * at(x + 1, y) +
        at(x + 1, y + 1) -
        at(x - 1, y - 1) -
        2 * at(x - 1, y) -
        at(x - 1, y + 1);
      const sy =
        at(x - 1, y + 1) +
        2 * at(x, y + 1) +
        at(x + 1, y + 1) -
        at(x - 1, y - 1) -
        2 * at(x, y - 1) -
        at(x + 1, y - 1);
      gx[index] = sx;
      gy[index] = sy;
      magnitude[index] = Math.hypot(sx, sy);
    }
  }
  return { gx, gy, magnitude };
}

function normalizeInPlace(values: Float32Array): void {
  let max = 0;
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i] ?? 0;
    if (value > max) {
      max = value;
    }
  }
  if (max <= 0) {
    return;
  }
  for (let i = 0; i < values.length; i += 1) {
    values[i] = (values[i] ?? 0) / max;
  }
}

export function computeGradientField(source: PixelSource): GradientField {
  const { width, height } = source;
  const luminance = toLuminance(source);

  const fine = sobel(boxBlur(luminance, width, height, 1), width, height);
  normalizeInPlace(fine.magnitude);

  const coarseRadius = Math.max(4, Math.round(Math.min(width, height) / 40));
  const coarse = sobel(boxBlur(luminance, width, height, coarseRadius, 3), width, height);
  normalizeInPlace(coarse.magnitude);

  const texture = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const gx = coarse.gx[i] ?? 0;
    const gy = coarse.gy[i] ?? 0;
    const length = Math.hypot(gx, gy);
    const dx = length > 1e-6 ? gx / length : 0;
    const dy = length > 1e-6 ? gy / length : 0;
    const offset = i * 4;
    texture[offset] = Math.round((dx * 0.5 + 0.5) * 255);
    texture[offset + 1] = Math.round((dy * 0.5 + 0.5) * 255);
    texture[offset + 2] = Math.round((fine.magnitude[i] ?? 0) * 255);
    texture[offset + 3] = Math.round((coarse.magnitude[i] ?? 0) * 255);
  }

  return { width, height, texture, fineMagnitude: fine.magnitude };
}
