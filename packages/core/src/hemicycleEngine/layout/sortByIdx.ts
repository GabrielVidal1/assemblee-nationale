import { sum, times } from "@hemicycle/helpers";
import { HemicycleData, HemicyclePosition } from "../data";
import { isHemicycleDataWithCoordinates } from "../data/helpers";

const getIdx = (e: HemicyclePosition, seatsPerRow: number[]): number => {
  if (isHemicycleDataWithCoordinates(e)) {
    const { rowIndex, seatIndex } = e;
    const seatsBefore = sum(seatsPerRow.slice(0, rowIndex));
    return seatsBefore + seatIndex;
  }
  return e.idx;
};

export const sortByIdx = <T extends object>(
  rawData: HemicycleData<T>[],
  sectionsSeatsPerRow: number[][],
): HemicycleData<T>[] => {
  const globalSeatsPerRow = times(sectionsSeatsPerRow[0].length, (rowIndex) =>
    sum(sectionsSeatsPerRow.map((section) => section[rowIndex] || 0)),
  );

  return rawData.sort((a, b) => {
    const idxA = getIdx(a, globalSeatsPerRow);
    const idxB = getIdx(b, globalSeatsPerRow);
    return idxA - idxB;
  });
};
