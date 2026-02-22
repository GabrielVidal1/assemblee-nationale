import { merge } from "@hemicycle/helpers";
import {
  DEFAULT_HEMICYCLE_CONFIG,
  HemicycleConfig,
  validateConfig,
} from "./config";
import { mapDataToSeats } from "./data/mapDataToSeats";
import { HemicycleData, SeatData } from "./data/types";
import { validateData } from "./data/validateData";
import { computeSeatLayout, SeatLayout } from "./layout";
import { computeSeatLayoutWithRadialAisles } from "./layout/computeSeatLayoutWithRadialAisles";
import { computeRowBands, distributeSeatsFromTotal } from "./seatDistribution";

export class Hemicycle<T extends object = object> {
  private config: HemicycleConfig = DEFAULT_HEMICYCLE_CONFIG;

  private computedSeatsPerRow: number[] = [];
  protected seatsLayout: SeatLayout[] = [];
  private seatData: SeatData<T>[] = [];

  constructor(config: Partial<HemicycleConfig>) {
    this.updateConfig(config);
  }

  private computeSeatsLayout() {
    const rowBands = computeRowBands(this.config);
    this.computedSeatsPerRow =
      this.config.seatsPerRow ??
      distributeSeatsFromTotal(rowBands, this.config);

    const conf = {
      ...this.config,
      seatsPerRow: this.computedSeatsPerRow,
    };

    const func = conf.aislesCount
      ? computeSeatLayoutWithRadialAisles
      : computeSeatLayout;

    this.seatsLayout = func(rowBands, {
      ...this.config,
      seatsPerRow: this.computedSeatsPerRow,
    });
    return this.seatsLayout;
  }

  updateConfig(config: Partial<HemicycleConfig>) {
    this.config = merge({}, this.config, config);
    validateConfig(this.config);
    return this.computeSeatsLayout();
  }

  updateData(data: HemicycleData<T>[]) {
    validateData(data, this.config, this.computedSeatsPerRow);
    this.seatData = mapDataToSeats({
      orderBy: this.config.orderBy,
      layout: this.seatsLayout,
      data,
    });
    return this.seatData;
  }

  getSeatsLayout(): SeatLayout[] {
    return this.seatsLayout;
  }

  getSeatsPerRow(): number[] {
    return this.computedSeatsPerRow;
  }

  getSeatData(): SeatData<T>[] {
    return this.seatData;
  }

  getConfig(): HemicycleConfig {
    return this.config;
  }
}
