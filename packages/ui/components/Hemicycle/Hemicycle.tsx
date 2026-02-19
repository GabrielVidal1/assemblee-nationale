import { useMemo } from "react";
import { HemicycleContent } from "./HemicycleContent";
import { HemicycleProps } from "./HemicycleProps";
import { computeViewBox } from "./viewbox";

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
