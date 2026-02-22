import * as Core from "@hemicycle/core";
import { SeatConfig } from "./seatConfig";

export type HemicycleConfig<SCT extends SeatConfig = SeatConfig> =
  Core.HemicycleConfig & {
    width: number;
    height: number;

    seatConfig: SCT;

    hideEmptySeats?: boolean;
  };
