```tsx
// path: packages/ui/components/Hemicycle/Hemicycle.tsx
import { useMemo } from "react";
import { HemicycleContent } from "./HemicycleContent";
import { HemicycleProps } from "./HemicycleProps";
import { computeViewBox } from "./services/viewbox";

export const Hemicycle: React.FC<HemicycleProps> = ({
  outerRadius = 95,
  totalAngle = 180,
  width,
  height,
  ...contentProps
}) => {
  const totalAngleRad = (totalAngle * Math.PI) / 180;

  const viewBox = useMemo(
    () => computeViewBox({ outerRadius, totalAngleRad }),
    [outerRadius, totalAngleRad],
  );

  return (
    <svg
      width={width ?? "100%"}
      height={height ?? "100%"}
      viewBox={viewBox}
      style={{ display: "block" }}
    >
      <HemicycleContent
        outerRadius={outerRadius}
        totalAngle={totalAngle}
        {...contentProps}
      />
    </svg>
  );
};
```

```tsx
// path: packages/ui/components/Hemicycle/HemicycleContent.tsx
import { useMemo } from "react";
import { SeatRenderer } from "../Seat/Seat";
import {
  HemicycleProps,
  ManualSeatProps,
  TotalSeatsProps,
} from "./HemicycleProps";
import { generateSeatLayout } from "./services/generateSeatLayout";
import {
  distributeSeats,
  distributeSeatsFromTotal,
} from "./services/seatDistribution";

type HemicycleContentProps = HemicycleProps;

export const HemicycleContent: React.FC<HemicycleContentProps> = ({
  rows,
  innerRadius = 40,
  outerRadius = 95,
  totalAngle = 180,
  angleOffset = 0,
  data: rawData = [],
  rowMargin,
  ...modeProps
}) => {
  const totalAngleRad = (totalAngle * Math.PI) / 180;
  const radialStep = (outerRadius - innerRadius) / rows;

  const isTotalSeatsMode =
    "totalSeats" in modeProps && modeProps.totalSeats != null;

  const seatMarginLinear = isTotalSeatsMode
    ? 1
    : ((modeProps as ManualSeatProps).seatMargin ?? 1);

  const effectiveRowMargin = rowMargin ?? seatMarginLinear;

  const seatsPerRow = useMemo(() => {
    if (isTotalSeatsMode) {
      const { totalSeats = 100 } = modeProps as TotalSeatsProps;
      return distributeSeatsFromTotal({
        totalSeats,
        rows,
        innerRadius,
        radialStep,
        effectiveRowMargin,
      });
    }

    return distributeSeats({
      rows,
      innerRadius,
      radialStep,
      totalAngleRad,
      seatMarginLinear,
      effectiveRowMargin,
    });
  }, [
    isTotalSeatsMode,
    modeProps,
    rows,
    innerRadius,
    radialStep,
    totalAngleRad,
    seatMarginLinear,
    effectiveRowMargin,
  ]);

  const data = useMemo(
    () =>
      generateSeatLayout({
        rawData,
        rows,
        innerRadius,
        radialStep,
        totalAngleRad,
        seatsPerRow,
        seatMarginLinear,
        effectiveRowMargin,
        isTotalSeatsMode,
        modeProps,
        angleOffset,
      }),
    [
      rawData,
      rows,
      innerRadius,
      radialStep,
      totalAngleRad,
      seatsPerRow,
      seatMarginLinear,
      effectiveRowMargin,
      isTotalSeatsMode,
      modeProps,
    ],
  );

  return (
    <>
      {data.map((seat) => (
        <SeatRenderer
          key={seat.idx}
          seat={seat}
          {...(modeProps?.seatConfig ?? {})}
        />
      ))}
    </>
  );
};
```

```tsx
// path: packages/ui/components/Hemicycle/HemicycleProps.tsx
import { SeatShape } from "../Seat/types";
import { HemicycleData } from "./types";

export type SeatConfig = {
  /** The shape of the seat (default: "arc"). */
  shape?: SeatShape;
};

/**
 * Core configuration shared by all hemicycle modes.
 */
export type HemicycleBaseProps = {
  /** Number of concentric seating rows (required). */
  rows: number;

  /** Array of seat data objects used to populate and style individual seats (required). */
  data: HemicycleData[];

  /** Inner radius of the hemicycle in SVG units (default: 40). */
  innerRadius?: number;

  /** Outer radius of the hemicycle in SVG units (default: 95). */
  outerRadius?: number;

  /** SVG height; accepts number or CSS string (default: "100%"). */
  height?: number;

  /** SVG width; accepts number or CSS string (default: "100%"). */
  width?: number;

  /** Total angular span in degrees (default: 180). */
  totalAngle?: number;

  /** Optional global angle offset for the entire layout in degrees (default: 0). */
  angleOffset?: number;

  /** Radial spacing between rows in linear units; falls back to seatMargin or 1. */
  rowMargin?: number;

  /** Optional configuration for seat appearance and shape. */
  seatConfig?: SeatConfig;
};

/**
 * Manual seat sizing and spacing mode.
 */
export type ManualSeatProps = {
  /** Width of each seat in SVG units (no default; layout-derived if omitted). */
  seatWidth?: number;

  /** Height of each seat in SVG units (no default; layout-derived if omitted). */
  seatHeight?: number;

  /** Linear spacing between seats along the arc (default: 1). */
  seatMargin?: number;

  /** Disallowed in manual mode. */
  totalSeats?: never;
};

/**
 * Automatic seat distribution mode based on a total seat count.
 */
export type TotalSeatsProps = {
  /** Total number of seats to distribute across rows (default: 100). */
  totalSeats?: number;

  /** Disallowed in totalSeats mode. */
  seatWidth?: never;

  /** Disallowed in totalSeats mode. */
  seatHeight?: never;

  /** Disallowed in totalSeats mode. */
  seatMargin?: never;
};

/**
 * Complete hemicycle props: base configuration plus exactly one sizing mode.
 */
export type HemicycleProps = HemicycleBaseProps &
  (ManualSeatProps | TotalSeatsProps);
```

```typescript
// path: packages/ui/components/Hemicycle/types.ts
import { SeatShape } from "../Seat/types";

export type HemicycleDataBase = {
  id: number;

  /** Whether the seat is enabled (default: true). */
  enabled: boolean;

  /** Optional shape override for this seat. */
  shape?: SeatShape;
}; //& ({ x: number; y: number } | { idx: number });

type HemicycleDataWithCoordinates = HemicycleDataBase & {
  x: number;
  y: number;
  idx?: never;
};
type HemicycleDataWithIndex = HemicycleDataBase & {
  /** Index of the seat in the layout (required if no coordinates). */
  idx: number;
};

export type HemicycleData =
  | HemicycleDataWithCoordinates
  | HemicycleDataWithIndex;

export const isHemicycleDataWithCoordinates = (
  data: HemicycleData,
): data is HemicycleData & { x: number; y: number } => {
  return "x" in data && "y" in data;
};
```
