import { useMemo } from "react";
import { HemicycleData } from "../Hemicycle/types";
import { seatPathGenerators } from "./shapes";
import { SeatLayout, SeatShape } from "./types";

interface SeatRendererProps {
  seat: Partial<HemicycleData> & SeatLayout;
  shape?: SeatShape;
}

export const SeatRenderer: React.FC<SeatRendererProps> = ({
  seat,
  shape: propShape,
}) => {
  const path = useMemo(() => {
    const { shape, innerR, outerR, angle1Rad, angle2Rad } = seat;
    const finalShape: SeatShape = shape ?? propShape ?? "arc";
    return seatPathGenerators[finalShape]({
      innerR,
      outerR,
      angle1Rad,
      angle2Rad,
    });
  }, [seat, propShape]);

  return (
    <path
      d={path}
      fill={seat.enabled ? "#2563eb" : "#e2e8f0"}
      stroke="#fff"
      strokeWidth={0.8}
      strokeLinejoin="round"
      style={{ transition: "fill 0.2s" }}
    />
  );
};
