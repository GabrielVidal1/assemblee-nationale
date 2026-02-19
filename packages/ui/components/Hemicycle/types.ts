import { SeatShape } from "../Seat/types";

export type HemicycleDataBase = {
  id: number;

  /** Whether the seat is enabled (default: true). */
  enabled: boolean;

  /** Optional shape override for this seat. */
  shape?: SeatShape;
}; //& ({ x: number; y: number } | { idx: number });

type HemicycleDataWithCoordinates = HemicycleDataBase & {
  x: number;
  y: number;
  idx?: never;
};
type HemicycleDataWithIndex = HemicycleDataBase & {
  /** Index of the seat in the layout (required if no coordinates). */
  idx: number;
};

export type HemicycleData =
  | HemicycleDataWithCoordinates
  | HemicycleDataWithIndex;

export const isHemicycleDataWithCoordinates = (
  data: HemicycleData,
): data is HemicycleData & { x: number; y: number } => {
  return "x" in data && "y" in data;
};
