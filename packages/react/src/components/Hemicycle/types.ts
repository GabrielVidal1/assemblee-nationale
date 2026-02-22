import * as Core from "@hemicycle/core";
import * as Vanilla from "@hemicycle/vanilla";

export type SeatConfig<T extends object = object> =
  Vanilla.HemicycleConfig["seatConfig"] & {
    wrapper?: (
      content: React.ReactNode,
      data: ComputedSeatData<T> | null,
    ) => React.ReactNode;
    props?: React.SVGProps<SVGPathElement>;
  };

export type Hemicycle<T extends object = object> = Vanilla.Hemicycle<
  T,
  SeatConfig<T>
>;

export type HemicycleData<T extends object = object> = Core.HemicycleData<
  Vanilla.WithSeatConfig<T, SeatConfig<T>>
>;

export type HemicycleProps<T extends object = object> = Partial<
  Vanilla.HemicycleConfig<SeatConfig<T>>
> & {
  data?: HemicycleData<T>[];
  svgProps?: React.SVGProps<SVGSVGElement>;
};

export type ComputedSeatData<T extends object = object> =
  Vanilla.WithSeatConfig<
    Core.SeatData<T>,
    Vanilla.ComputedSeatConfig<SeatConfig<T>>
  >;
