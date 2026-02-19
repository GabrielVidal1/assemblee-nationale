import { SeatLayout } from "../../Seat/types";
import { ManualSeatProps, TotalSeatsProps } from "../HemicycleProps";
import { HemicycleData, isHemicycleDataWithCoordinates } from "../types";

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
  angleOffset: number;
}

export function generateSeatLayout({
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
  angleOffset,
}: GenerateSeatsParams): SeatLayout[] {
  const layout: SeatLayout[] = [];
  let globalIdx = 0;
  const arcStart =
    Math.PI + (Math.PI - totalAngleRad) / 2 + (angleOffset * Math.PI) / 180;

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

      layout.push({
        idx: globalIdx++,
        rowIndex,
        seatIndex,
        innerR: bandInnerR,
        outerR: effectiveOuterR,
        angle1Rad: a1,
        angle2Rad: a2,
        data: seatData,
      });
    }
  }

  return layout;
}
