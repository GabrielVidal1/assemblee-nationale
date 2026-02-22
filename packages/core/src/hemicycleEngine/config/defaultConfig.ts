import { HemicycleConfig } from "hemicycleEngine/config";

/**
 * Default values shared across all hemicycle modes.
 */
export const DEFAULT_HEMICYCLE_CONFIG: HemicycleConfig = {
  rows: 5,
  innerRadius: 40,
  outerRadius: 95,
  totalAngle: 180,
  angleOffset: 0,
  rowMargin: 1,
  totalSeats: 100,
  mirror: false,
  seatMargin: 1,
  orderBy: "row",

  // aisles
  arcAislesCount: 0,
  arcAislesWidth: 2,
  aislesCount: 0,
  aislesWidth: 2,
};
