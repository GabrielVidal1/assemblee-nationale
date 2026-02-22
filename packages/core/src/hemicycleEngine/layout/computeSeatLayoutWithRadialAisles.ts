import { toRadians } from "@hemicycle/helpers";
import { HemicycleConfig } from "hemicycleEngine/config";
import { RowBand } from "hemicycleEngine/seatDistribution/computeRowBands";
import { setRadialIdx } from "./setRadialIdx";
import { SeatLayout } from "./types";

type ComputeSeatLayoutWithAislesParams = Pick<
  HemicycleConfig,
  "totalAngle" | "seatMargin" | "angleOffset" | "mirror" | "rowMargin"
> & {
  seatsPerRow: number[];
  aislesCount?: number;
  aislesWidth?: number;
};

export function computeSeatLayoutWithRadialAisles(
  rowBands: RowBand[],
  { seatsPerRow, ...config }: ComputeSeatLayoutWithAislesParams,
): SeatLayout[] {
  const {
    seatMargin = 1,
    totalAngle,
    rowMargin,
    angleOffset,
    mirror,
    aislesCount = 0,
    aislesWidth = 2,
  } = config;

  const rows = rowBands.length;
  const totalAngleRad = toRadians(totalAngle);
  const effectiveRowMargin = rowMargin ?? seatMargin ?? 0;
  const arcStart =
    Math.PI + (Math.PI - totalAngleRad) / 2 + toRadians(angleOffset);

  const aisleWidthRad = toRadians(aislesWidth);
  const sectionAngleRad =
    aislesCount > 0
      ? (totalAngleRad - aislesCount * aisleWidthRad) / (aislesCount + 1)
      : totalAngleRad;

  // Start angle of each section (un-mirrored, relative to arcStart)
  // section k starts at: k * sectionAngleRad + k * aisleWidthRad
  const sectionStartOffsets: number[] = Array.from(
    { length: aislesCount + 1 },
    (_, k) => k * (sectionAngleRad + aisleWidthRad),
  );

  const layout: SeatLayout[] = [];
  let globalIdx = 0;
  const seatMatrix: SeatLayout[][] = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const { rowInnerRadius, rowOuterRadius } = rowBands[rowIndex];
    seatMatrix[rowIndex] = [];

    const bandInnerR = rowInnerRadius + effectiveRowMargin / 2;
    const bandOuterR = rowOuterRadius - effectiveRowMargin / 2;
    const midR = (bandInnerR + bandOuterR) / 2;
    const seatMarginRad = seatMargin / midR;

    const N = seatsPerRow[rowIndex];
    // Distribute seats as evenly as possible across sections
    const basePerSection = Math.floor(N / (aislesCount + 1));
    const remainder = N % (aislesCount + 1);
    // sections with index < remainder get one extra seat
    const seatsInSection: number[] = Array.from(
      { length: aislesCount + 1 },
      (_, k) => basePerSection + (k < remainder ? 1 : 0),
    );

    let seatIndex = 0; // continuous seat index within the row

    for (let section = 0; section <= aislesCount; section++) {
      const sectionStart = arcStart + sectionStartOffsets[section];
      const nSeats = seatsInSection[section];
      if (nSeats === 0) continue;

      const slotAngleActual = sectionAngleRad / nSeats;
      const seatAngle = slotAngleActual - seatMarginRad;

      for (let s = 0; s < nSeats; s++) {
        const slotStart = sectionStart + s * slotAngleActual;
        let a1 = slotStart + seatMarginRad / 2;
        let a2 = a1 + seatAngle;

        if (mirror) {
          const mirroredA1 = Math.PI - a2;
          const mirroredA2 = Math.PI - a1;
          a1 = mirroredA1;
          a2 = mirroredA2;
        }

        const midAngle = (a1 + a2) / 2;
        const x = midR * Math.cos(midAngle);
        const y = midR * Math.sin(midAngle);

        const seat: SeatLayout = {
          idx: globalIdx++,
          radialIdx: -1,
          rowIndex,
          seatIndex: seatIndex++,
          innerR: bandInnerR,
          outerR: bandOuterR,
          angle1Rad: a1,
          angle2Rad: a2,
          x,
          y,
        };

        layout.push(seat);
        seatMatrix[rowIndex][seat.seatIndex] = seat;
      }
    }
  }

  setRadialIdx(layout, config);
  return layout;
}
