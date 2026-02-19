import { polar } from "../../../technical/polar";
import { SeatPathGenerator } from "./type";

export const sectorPath: SeatPathGenerator = ({
  innerR,
  outerR,
  angle1Rad,
  angle2Rad,
}): string => {
  const i1 = polar(innerR, angle1Rad);
  const i2 = polar(innerR, angle2Rad);
  const o1 = polar(outerR, angle1Rad);
  const o2 = polar(outerR, angle2Rad);
  const largeArc = Math.abs(angle2Rad - angle1Rad) > Math.PI ? 1 : 0;
  const sweep = angle2Rad > angle1Rad ? 1 : 0;

  return [
    `M ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} ${sweep} ${i2.x} ${i2.y}`,
    `L ${o2.x} ${o2.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} ${1 - sweep} ${o1.x} ${o1.y}`,
    "Z",
  ].join(" ");
};
