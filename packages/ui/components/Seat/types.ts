import { SVGProps } from "react";
import { HemicycleData } from "../Hemicycle/types";
import { SeatPathParams } from "./shapes/type";

export type SeatShape = "arc" | "rect" | "circle";

export type SeatConfig<T extends object = object> = {
  /** The shape of the seat (default: "arc"). */
  shape?: SeatShape;

  /** Linear spacing between seats along the arc (default: 1). */
  seatMargin?: number;

  /** Optional wrapper function to customize seat rendering. */
  wrapper?: (
    content: React.ReactNode,
    seatData: HemicycleData<T> | null,
  ) => React.ReactNode;

  /** Optional fill color for the seat */
  color?: string;

  /** Additional SVG props to apply to the seat's <path> element. */
  props?: SVGProps<SVGPathElement>;
};

export type SeatLayout = SeatPathParams & {
  idx: number;
  rowIndex: number;
  seatIndex: number;
};

export type SeatData<T extends object> = SeatLayout & {
  data: HemicycleData<T> | null;
};
