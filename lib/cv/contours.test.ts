import { describe, expect, it } from 'vitest';

import { extractContours, simplifyContour } from '@/lib/cv/contours';
import type { Point } from '@/lib/cv/contours';

function rectangleRing(
  width: number,
  height: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
): Float32Array {
  const magnitude = new Float32Array(width * height);
  for (let x = left; x <= right; x += 1) {
    magnitude[top * width + x] = 1;
    magnitude[bottom * width + x] = 1;
  }
  for (let y = top; y <= bottom; y += 1) {
    magnitude[y * width + left] = 1;
    magnitude[y * width + right] = 1;
  }
  return magnitude;
}

describe('extractContours', () => {
  it('traces a rectangle ring as a single closed contour', () => {
    const width = 20;
    const height = 16;
    const magnitude = rectangleRing(width, height, 4, 3, 14, 11);

    const contours = extractContours(magnitude, width, height, 0.5);

    expect(contours).toHaveLength(1);
    const contour = contours[0];
    if (!contour) {
      throw new Error('expected one contour');
    }
    // 1px-wide ring: the boundary visits every ring pixel exactly once.
    const perimeter = 2 * (14 - 4) + 2 * (11 - 3);
    expect(contour.length).toBe(perimeter);
    for (const point of contour) {
      expect(point.x).toBeGreaterThanOrEqual(4);
      expect(point.x).toBeLessThanOrEqual(14);
      expect(point.y).toBeGreaterThanOrEqual(3);
      expect(point.y).toBeLessThanOrEqual(11);
    }
  });

  it('drops specks below the minimum point count', () => {
    const width = 10;
    const height = 10;
    const magnitude = new Float32Array(width * height);
    magnitude[5 * width + 5] = 1;

    expect(extractContours(magnitude, width, height, 0.5)).toHaveLength(0);
  });
});

describe('simplifyContour', () => {
  it('collapses collinear points to the endpoints', () => {
    const line: Point[] = Array.from({ length: 10 }, (_, i) => ({ x: i, y: 0 }));
    expect(simplifyContour(line, 0.5)).toEqual([
      { x: 0, y: 0 },
      { x: 9, y: 0 },
    ]);
  });

  it('keeps a right-angle corner', () => {
    const corner: Point[] = [
      ...Array.from({ length: 10 }, (_, i) => ({ x: i, y: 0 })),
      ...Array.from({ length: 10 }, (_, i) => ({ x: 9, y: i + 1 })),
    ];
    const simplified = simplifyContour(corner, 0.5);
    expect(simplified).toContainEqual({ x: 9, y: 0 });
    expect(simplified.length).toBeLessThan(corner.length);
  });

  it('removes more points as epsilon grows', () => {
    const wavy: Point[] = Array.from({ length: 50 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 3) * 4,
    }));
    const fine = simplifyContour(wavy, 0.2);
    const rough = simplifyContour(wavy, 3);
    expect(rough.length).toBeLessThan(fine.length);
    expect(fine.length).toBeLessThan(wavy.length);
  });
});
