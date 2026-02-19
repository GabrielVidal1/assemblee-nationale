import { useMemo } from "react";
import { SeatRenderer } from "../Seat/Seat";
import { DEFAULT_HEMICYCLE_BASE_PROPS } from "./constant";
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

export const HemicycleContent: React.FC<HemicycleContentProps> = (props) => {
  const {
    rows,
    innerRadius,
    outerRadius,
    totalAngle,
    angleOffset,
    data: rawData,
    rowMargin,
    ...modeProps
  } = { ...DEFAULT_HEMICYCLE_BASE_PROPS, ...props };

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
