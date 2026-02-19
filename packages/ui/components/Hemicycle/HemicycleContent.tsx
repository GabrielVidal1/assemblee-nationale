import { useMemo } from "react";
import { generateSeats } from "./generateSeats";
import {
  HemicycleProps,
  ManualSeatProps,
  TotalSeatsProps,
} from "./HemicycleProps";
import { Seat, SeatRenderer } from "./Seat";
import { distributeSeats, distributeSeatsFromTotal } from "./seatDistribution";

type HemicycleContentProps = HemicycleProps;

export const HemicycleContent: React.FC<HemicycleContentProps> = ({
  rows,
  innerRadius = 40,
  outerRadius = 95,
  totalAngle = 180,
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

  const data: Seat[] = useMemo(
    () =>
      generateSeats({
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
        <SeatRenderer key={seat.idx} seat={seat} />
      ))}
    </>
  );
};
