import * as Core from "@hemicycle/core";
import { HemicycleConfig } from ".";

export const DEFAULT_SEAT_CONFIG: Required<HemicycleConfig["seatConfig"]> = {
  shape: "arc",
  color: "#ccc",
  borderRadius: 1.5,
};

/**
 * Default values shared across all hemicycle modes.
 */
export const DEFAULT_HEMICYCLE_CONFIG: HemicycleConfig = {
  ...Core.DEFAULT_HEMICYCLE_CONFIG,
  width: 800,
  height: 400,

  hideEmptySeats: false,

  seatConfig: DEFAULT_SEAT_CONFIG,
};
