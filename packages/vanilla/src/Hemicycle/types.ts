import * as Core from "@hemicycle/core";
import { ComputedSeatConfig, SeatConfig } from "Hemicycle/config/seatConfig";

export type WithSeatConfig<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = T & {
  seatConfig?: SCT;
};

export type WithRequiredSeatConfig<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = T & {
  seatConfig: SCT;
};

export type ComputedSeatData<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = WithRequiredSeatConfig<Core.SeatData<T>, ComputedSeatConfig<SCT>>;

export type HemicycleData<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = Core.HemicycleData<WithSeatConfig<T, SCT>>;

export type HemicycleGroup<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = Core.HemicycleGroup<T> & WithSeatConfig<T, SCT>;

export type HemicycleEngine<
  T extends object = object,
  SCT extends SeatConfig = SeatConfig,
> = Core.Hemicycle<WithSeatConfig<T, SCT>>;
