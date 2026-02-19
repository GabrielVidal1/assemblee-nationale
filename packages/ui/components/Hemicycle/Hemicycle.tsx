import { useMemo } from "react";
import { DEFAULT_HEMICYCLE_BASE_PROPS } from "./constant";
import { HemicycleContent } from "./HemicycleContent";
import { HemicycleProps } from "./HemicycleProps";
import { HemicycleWithAisles } from "./HemicycleWithAisles";
import { computeViewBox } from "./services/viewbox";

type HemicycleType = React.FC<HemicycleProps> & {
  WithAisles: typeof HemicycleWithAisles;
};

const Hemicycle: HemicycleType = (props) => {
  const { outerRadius, totalAngle, width, height, ...contentProps } = {
    ...DEFAULT_HEMICYCLE_BASE_PROPS,
    ...props,
  };

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

Hemicycle.WithAisles = HemicycleWithAisles;

export { Hemicycle };
