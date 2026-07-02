/**
 * Contour extraction and simplification for the "Memory of Today" renderer.
 *
 * Strong edges are binarized and traced into polylines (Moore-neighbor
 * tracing), then progressively simplified with Douglas-Peucker. The renderer
 * crossfades between simplification levels as the memory turns into symbols.
 */

export type Point = { x: number; y: number };

const MOORE_OFFSETS: readonly Point[] = [
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
];

function traceBoundary(
  mask: Uint8Array,
  traced: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
): Point[] {
  const contour: Point[] = [{ x: startX, y: startY }];
  traced[startY * width + startX] = 1;

  let cx = startX;
  let cy = startY;
  // The scan reaches the start pixel from the left, so begin the clockwise
  // sweep just after the west neighbor.
  let backtrackIndex = 0;
  const maxSteps = width * height * 4;

  for (let step = 0; step < maxSteps; step += 1) {
    let found = false;
    for (let probe = 1; probe <= 8; probe += 1) {
      const direction = (backtrackIndex + probe) % 8;
      const offset = MOORE_OFFSETS[direction];
      if (!offset) {
        continue;
      }
      const nx = cx + offset.x;
      const ny = cy + offset.y;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height || !mask[ny * width + nx]) {
        continue;
      }
      // Restart the next sweep from the background pixel just before this hit.
      backtrackIndex = (direction + 4) % 8;
      cx = nx;
      cy = ny;
      found = true;
      break;
    }
    if (!found) {
      break; // isolated pixel
    }
    if (cx === startX && cy === startY) {
      break;
    }
    contour.push({ x: cx, y: cy });
    traced[cy * width + cx] = 1;
  }

  return contour;
}

export function extractContours(
  magnitude: Float32Array,
  width: number,
  height: number,
  threshold: number,
  minPoints = 12,
): Point[][] {
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < mask.length; i += 1) {
    mask[i] = (magnitude[i] ?? 0) >= threshold ? 1 : 0;
  }

  const traced = new Uint8Array(width * height);
  const contours: Point[][] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!mask[index] || traced[index] || (x > 0 && mask[index - 1])) {
        continue;
      }
      const contour = traceBoundary(mask, traced, width, height, x, y);
      if (contour.length >= minPoints) {
        contours.push(contour);
      }
    }
  }
  return contours;
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }
  return (
    Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) /
    Math.sqrt(lengthSquared)
  );
}

export function simplifyContour(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) {
    return points.slice();
  }

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const ranges: Array<[number, number]> = [[0, points.length - 1]];
  while (ranges.length > 0) {
    const range = ranges.pop();
    if (!range) {
      break;
    }
    const [start, end] = range;
    const lineStart = points[start];
    const lineEnd = points[end];
    if (!lineStart || !lineEnd) {
      continue;
    }
    let maxDistance = 0;
    let maxIndex = -1;
    for (let i = start + 1; i < end; i += 1) {
      const point = points[i];
      if (!point) {
        continue;
      }
      const distance = perpendicularDistance(point, lineStart, lineEnd);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    if (maxIndex !== -1 && maxDistance > epsilon) {
      keep[maxIndex] = 1;
      ranges.push([start, maxIndex], [maxIndex, end]);
    }
  }

  return points.filter((_, index) => keep[index] === 1);
}
