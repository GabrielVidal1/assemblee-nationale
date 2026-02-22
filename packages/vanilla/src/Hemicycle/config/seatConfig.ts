export const SEAT_SHAPES = ["arc", "rect", "circle"] as const;

export type SeatShape = (typeof SEAT_SHAPES)[number];

export type SeatConfig = {
  /** The shape of the seat (default: "arc"). */
  shape?: SeatShape;

  /** Optional roundedness for arc and rectangular seats (default: 0, ignored for circular seats). */
  borderRadius?: number;

  /** For circle shape, radius of the seat. For arc and rect, distance from inner to outer radius (default: 5) */
  radius?: number;

  /** Optional fill color for the seat (default: "lightgray"). */
  color?: string;
};

export type ComputedSeatConfig<SC extends SeatConfig = SeatConfig> =
  Required<SC> & {
    path: string;
  };
