import { SeatData, SeatLayout } from "../../Seat/types";
import { HemicycleData, isHemicycleDataWithCoordinates } from "../types";

interface MapSeatDataParams<T extends object> {
  layout: SeatLayout[];
  rawData: HemicycleData<T>[];
}

export function mapSeatData<T extends object>({
  layout,
  rawData,
}: MapSeatDataParams<T>): SeatData<T>[] {
  const dataMap = new Map(
    rawData.map((d) => [
      isHemicycleDataWithCoordinates(d) ? `${d.x}-${d.y}` : `${d.idx}`,
      d,
    ]),
  );

  return layout.map((seat) => {
    const seatData =
      dataMap.get(`${seat.seatIndex}-${seat.rowIndex}`) ??
      dataMap.get(`${seat.idx}`) ??
      null;

    return {
      ...seat,
      data: seatData,
    };
  });
}
