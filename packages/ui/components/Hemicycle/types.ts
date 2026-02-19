export type HemicycleData = {
  id: number;
  enabled: boolean;
} & ({ x: number; y: number } | { idx: number });

export const isHemicycleDataWithCoordinates = (
  data: HemicycleData,
): data is HemicycleData & { x: number; y: number } => {
  return "x" in data && "y" in data;
};
