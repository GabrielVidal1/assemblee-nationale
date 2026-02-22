import * as Core from "@hemicycle/core";
import { SeatConfig } from "./seatConfig";

export type HemicycleConfig<SCT extends SeatConfig = SeatConfig> =
  Core.HemicycleConfig & {
    width: number | string;
    height: number | string;

    seatConfig: SCT;

    hideEmptySeats?: boolean;
  };
