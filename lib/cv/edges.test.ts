import { describe, expect, it } from 'vitest';

import { boxBlur, computeGradientField, sobel, toLuminance } from '@/lib/cv/edges';
import type { PixelSource } from '@/lib/cv/edges';

function grayscaleSource(values: number[][], width: number, height: number): PixelSource {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const value = values[y]?.[x] ?? 0;
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }
  return { data, width, height };
}

function verticalStepSource(width: number, height: number): PixelSource {
  const values = Array.from({ length: height }, () =>
    Array.from({ length: width }, (_, x) => (x < width / 2 ? 0 : 255)),
  );
  return grayscaleSource(values, width, height);
}

describe('toLuminance', () => {
  it('maps black and white to 0 and 1', () => {
    const source = verticalStepSource(4, 2);
    const luminance = toLuminance(source);
    expect(luminance[0]).toBe(0);
    expect(luminance[3]).toBeCloseTo(1, 5);
  });
});

describe('boxBlur', () => {
  it('preserves a constant field', () => {
    const constant = new Float32Array(16).fill(0.5);
    const blurred = boxBlur(constant, 4, 4, 1, 3);
    for (const value of blurred) {
      expect(value).toBeCloseTo(0.5, 5);
    }
  });

  it('does not mutate its input', () => {
    const source = Float32Array.from([0, 1, 0, 1, 0, 1, 0, 1, 0]);
    const copy = Float32Array.from(source);
    boxBlur(source, 3, 3, 1);
    expect(source).toEqual(copy);
  });
});

describe('sobel', () => {
  it('finds a vertical step edge pointing in +x', () => {
    const width = 8;
    const height = 8;
    const luminance = toLuminance(verticalStepSource(width, height));
    const { gx, gy, magnitude } = sobel(luminance, width, height);

    const y = 4;
    const edgeIndex = y * width + width / 2;
    const flatIndex = y * width + 1;
    expect(magnitude[edgeIndex] ?? 0).toBeGreaterThan(0);
    expect(magnitude[flatIndex]).toBe(0);
    expect(gx[edgeIndex] ?? 0).toBeGreaterThan(0);
    expect(Math.abs(gy[edgeIndex] ?? 1)).toBeLessThan(1e-6);
  });
});

describe('computeGradientField', () => {
  it('packs an RGBA texture with the expected shape and ranges', () => {
    const width = 64;
    const height = 48;
    const field = computeGradientField(verticalStepSource(width, height));

    expect(field.width).toBe(width);
    expect(field.height).toBe(height);
    expect(field.texture.length).toBe(width * height * 4);
    expect(field.fineMagnitude.length).toBe(width * height);

    // Near the step the coarse flow should point along +x: R well above the
    // 128 midpoint, G close to it.
    const probe = (24 * width + width / 2) * 4;
    expect(field.texture[probe] ?? 0).toBeGreaterThan(200);
    expect(Math.abs((field.texture[probe + 1] ?? 0) - 128)).toBeLessThanOrEqual(2);

    // Fine magnitude is normalized, so the strongest edge hits 1.
    const maxFine = Math.max(...field.fineMagnitude);
    expect(maxFine).toBeCloseTo(1, 5);
  });
});
