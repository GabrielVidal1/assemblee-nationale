export interface SeatPathParams {
  innerR: number;
  outerR: number;
  angle1Rad: number;
  angle2Rad: number;
}

export type SeatPathGenerator = (params: SeatPathParams) => string;
