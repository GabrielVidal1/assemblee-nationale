import { Hemicycle, HemicycleData } from "@hemicycle/react";

const RainBowHemicycle = () => {
  const data: HemicycleData[] = Array.from({ length: 100 }, (_, i) => ({
    idx: i,
    label: `Seat ${i + 1}`,
    seatConfig: {
      color: `hsl(${(i * 360) / 100}, 70%, 50%)`,
    },
  }));

  return (
    <div className="bg-red-50">
      <Hemicycle
        data={data}
        seatConfig={{
          borderRadius: 20,
          shape: "arc",
        }}
        orderBy="radial"
      />
    </div>
  );
};

export default RainBowHemicycle;
