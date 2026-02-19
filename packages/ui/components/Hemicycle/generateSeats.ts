import { sectorPath } from "./helpers";
import { ManualSeatProps, TotalSeatsProps } from "./HemicycleProps";
import { Seat } from "./Seat";
import { HemicycleData, isHemicycleDataWithCoordinates } from "./types";

interface GenerateSeatsParams {
  rawData: HemicycleData[];
  rows: number;
  innerRadius: number;
  radialStep: number;
  totalAngleRad: number;
  seatsPerRow: number[];
  seatMarginLinear: number;
  effectiveRowMargin: number;
  isTotalSeatsMode: boolean;
  modeProps: ManualSeatProps | TotalSeatsProps;
}

export function generateSeats({
  rawData,
  rows,
  innerRadius,
  radialStep,
  totalAngleRad,
  seatsPerRow,
  seatMarginLinear,
  effectiveRowMargin,
  isTotalSeatsMode,
  modeProps,
}: GenerateSeatsParams): Seat[] {
  const seats: Seat[] = [];
  let globalIdx = 0;
  const arcStart = Math.PI + (Math.PI - totalAngleRad) / 2;

  const dataMap = new Map(
    rawData.map((d) => [
      isHemicycleDataWithCoordinates(d) ? `${d.x}-${d.y}` : `${d.idx}`,
      d,
    ]),
  );

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const rowInnerR = innerRadius + rowIndex * radialStep;
    const rowOuterR = rowInnerR + radialStep;

    const bandInnerR = rowInnerR + effectiveRowMargin / 2;
    const bandOuterR = rowOuterR - effectiveRowMargin / 2;
    const midR = (bandInnerR + bandOuterR) / 2;

    const seatMarginRad = seatMarginLinear / midR;

    const effectiveOuterR =
      !isTotalSeatsMode && (modeProps as ManualSeatProps).seatHeight != null
        ? bandInnerR + (modeProps as ManualSeatProps).seatHeight!
        : bandOuterR;

    const N = seatsPerRow[rowIndex];
    const slotAngleActual = totalAngleRad / N;
    const seatAngle = slotAngleActual - seatMarginRad;

    for (let seatIndex = 0; seatIndex < N; seatIndex++) {
      const slotStart = arcStart + seatIndex * slotAngleActual;
      const a1 = slotStart + seatMarginRad / 2;
      const a2 = a1 + seatAngle;

      const seatData =
        dataMap.get(`${seatIndex}-${rowIndex}`) ??
        dataMap.get(`${globalIdx}`) ??
        {};

      seats.push({
        ...seatData,
        idx: globalIdx++,
        path: sectorPath({
          innerR: bandInnerR,
          outerR: effectiveOuterR,
          angle1Rad: a1,
          angle2Rad: a2,
        }),
      });
    }
  }

  return seats;
}
