import { DEFAULT_SEAT_CONFIG } from "../Seat/constant";
import { HemicycleBaseProps, TotalSeatsProps } from "./HemicycleProps";
import { HemicycleWithAislesProps } from "./HemicycleWithAisles";

/**
 * Default values shared across all hemicycle modes.
 */
export const DEFAULT_HEMICYCLE_BASE_PROPS: Required<
  Pick<
    HemicycleBaseProps,
    | "data"
    | "rows"
    | "innerRadius"
    | "outerRadius"
    | "height"
    | "width"
    | "totalAngle"
    | "angleOffset"
    | "rowMargin"
  >
> = {
  data: [],
  rows: 5,
  innerRadius: 40,
  outerRadius: 95,
  height: 400,
  width: 800,
  totalAngle: 180,
  angleOffset: 0,
  rowMargin: 1,
};

/**
 * Default values for totalSeats distribution mode.
 */
export const DEFAULT_TOTAL_SEATS_PROPS: Required<
  Pick<TotalSeatsProps, "totalSeats">
> = {
  totalSeats: 100,
};

export const DEFAULT_HEMICYCLE_WITH_AISLES_PROPS: Required<
  Pick<HemicycleWithAislesProps, "aisleNumber" | "aisleWidth">
> = {
  aisleNumber: 4,
  aisleWidth: 4,
};

export const DEFAULT_HEMICYCLE_PROPS = {
  ...DEFAULT_HEMICYCLE_BASE_PROPS,
  ...DEFAULT_TOTAL_SEATS_PROPS,
  ...DEFAULT_HEMICYCLE_WITH_AISLES_PROPS,
  seatConfig: DEFAULT_SEAT_CONFIG,
};
