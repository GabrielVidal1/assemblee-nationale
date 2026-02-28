import {
  HemicycleData,
  HemicycleDataWithCoordinates,
  HemicycleDataWithIdx,
  HemicycleGroup,
} from "hemicycleEngine/data/types";

export const isHemicycleDataWithCoordinates = <T extends object>(
  data: HemicycleData<T>,
): data is HemicycleDataWithCoordinates => {
  return "seatIndex" in data && "rowIndex" in data;
};

export const isHemicycleDataWithIdx = <T extends object>(
  data: HemicycleData<T>,
): data is HemicycleDataWithIdx => {
  return "idx" in data;
};

/**
 * Helper function to convert groups to data format
 * Flattens the groups into an array of seat data, assigning an index to each seat
 * @param groups - Array of HemicycleGroup objects, each containing a number of seats and group properties
 */
export const groupsToData = <T extends object>(groups: HemicycleGroup<T>[]) => {
  let idx = 0;
  return groups.flatMap(({ numberOfSeats, ...rest }) => {
    const seats = new Array(numberOfSeats).fill(null).map(() => ({
      ...rest,
      idx: idx++,
    }));
    return seats;
  });
};
