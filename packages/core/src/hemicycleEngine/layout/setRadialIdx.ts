import { HemicycleConfig } from "../config";
import { SeatLayout } from "./types";

export const setRadialIdx = (
  seatLayouts: SeatLayout[],
  { mirror = false }: Pick<HemicycleConfig, "mirror">,
): void => {
  const sortedByMidAngle = [...seatLayouts].sort((a, b) => {
    const midA = (a.angle1Rad + a.angle2Rad) / 2;
    const midB = (b.angle1Rad + b.angle2Rad) / 2;

    if (!mirror) return midA - midB;
    else return midB - midA;
  });

  for (let i = 0; i < sortedByMidAngle.length; i++) {
    sortedByMidAngle[i].radialIdx = i;
  }
};
