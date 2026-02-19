import { useMemo } from "react";
import { merge } from "../../technical";
import { seatPathGenerators } from "./shapes";
import { SeatConfig, SeatData, SeatShape } from "./types";

type SeatRendererProp<T extends object> = SeatConfig<T> & SeatData<T>;

export const SeatRenderer = <T extends object>(props: SeatRendererProp<T>) => {
  const {
    idx,
    data,
    color,
    wrapper,
    shape,
    props: svgProps,
    ...seatLayout
  } = merge({}, props);

  const path = useMemo(() => {
    const finalShape: SeatShape = shape ?? shape ?? "arc";
    return seatPathGenerators[finalShape](seatLayout);
  }, [shape, seatLayout]);

  const seatWrapper = wrapper ?? ((a: React.ReactNode) => a);

  return seatWrapper(
    <path
      key={idx}
      d={path}
      fill={color}
      style={{
        pointerEvents: "auto",
      }}
      {...svgProps}
    />,
    data,
  );
};
