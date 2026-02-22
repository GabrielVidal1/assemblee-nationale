import { getParamValidator } from "@hemicycle/helpers";
import { validateSeatConfig } from "Hemicycle/config/validateSeatConfig";
import { WithSeatConfig } from "../types";

export function validateData<T extends object>(
  data: WithSeatConfig<T>[],
): void {
  // Basic validation to check if each data item has either coordinates or idx
  data.forEach((item, index) => {
    const validator = getParamValidator("warn", `data[${index}].`);
    validateSeatConfig(item.seatConfig, validator);
  });
}
