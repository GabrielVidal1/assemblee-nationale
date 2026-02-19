import { SeatPathGenerator } from "./type";

export const rectangularSeatPath: SeatPathGenerator = ({
  innerR,
  outerR,
  angle1Rad,
  angle2Rad,
}) => {
  const midAngle = (angle1Rad + angle2Rad) / 2;
  const r = (innerR + outerR) / 2;

  const cx = r * Math.cos(midAngle);
  const cy = r * Math.sin(midAngle);

  // radial thickness
  const radialSize = outerR - innerR;

  // angular width available at radius r
  const delta = Math.abs(angle2Rad - angle1Rad);
  const angularSize = 2 * r * Math.sin(delta / 2);

  // final square size must fit both constraints
  const size = Math.min(radialSize, angularSize);

  const half = size / 2;

  // Precompute rotation basis vectors
  const cos = Math.cos(midAngle);
  const sin = Math.sin(midAngle);

  // Local square corners (axis aligned at origin)
  const points = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ].map(([lx, ly]) => {
    // Rotate
    const rx = lx * cos - ly * sin;
    const ry = lx * sin + ly * cos;

    // Translate
    return [rx + cx, ry + cy];
  });

  return `
    M ${points[0][0]} ${points[0][1]}
    L ${points[1][0]} ${points[1][1]}
    L ${points[2][0]} ${points[2][1]}
    L ${points[3][0]} ${points[3][1]}
    Z
  `;
};
