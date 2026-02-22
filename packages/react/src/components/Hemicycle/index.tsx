import * as Vanilla from "@hemicycle/vanilla";
import { memo } from "react";
import { HemicycleProps, SeatConfig } from "./types";
export type { HemicycleData, HemicycleProps } from "./types";

const HemicycleComponent = <T extends object = object>({
  data = [],
  svgProps,
  ...props
}: HemicycleProps<T>) => {
  const hemicycle = new Vanilla.Hemicycle<T, SeatConfig>(props);
  hemicycle.updateData(data);
  const seatData = hemicycle.getSeatData();

  const { width, height } = hemicycle.getConfig() ?? {};
  const viewBox = hemicycle.getViewBox();

  return (
    <svg
      style={{ display: "block" }}
      width={width}
      height={height}
      viewBox={viewBox}
      {...svgProps}
    >
      {seatData.map((data, idx) => {
        const { seatConfig } = data;
        const wrapper =
          seatConfig.wrapper ?? ((content: React.ReactNode) => content);
        return wrapper(
          <path
            key={idx}
            d={seatConfig.path}
            fill={seatConfig.color ?? "lightgray"}
            {...seatConfig.props}
          />,
          data,
        );
      })}
    </svg>
  );
};

export const Hemicycle = memo(HemicycleComponent);
