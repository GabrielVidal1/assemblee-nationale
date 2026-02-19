import { HemicycleData } from "../Hemicycle/types";
import { SeatPathParams } from "./shapes/type";

export type SeatShape = "arc" | "rect" | "circle";

export type SeatLayout = SeatPathParams & {
  shape?: SeatShape;
  idx: number;
  rowIndex: number;
  seatIndex: number;
  data: Partial<HemicycleData>;
};
