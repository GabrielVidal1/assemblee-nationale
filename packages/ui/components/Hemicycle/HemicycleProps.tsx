import { HemicycleData } from "./types";

/**
 * Core configuration shared by all hemicycle modes.
 */
export type HemicycleBaseProps = {
  /** Number of concentric seating rows (required). */
  rows: number;

  /** Array of seat data objects used to populate and style individual seats (required). */
  data: HemicycleData[];

  /** Inner radius of the hemicycle in SVG units (default: 40). */
  innerRadius?: number;

  /** Outer radius of the hemicycle in SVG units (default: 95). */
  outerRadius?: number;

  /** SVG height; accepts number or CSS string (default: "100%"). */
  height?: number;

  /** SVG width; accepts number or CSS string (default: "100%"). */
  width?: number;

  /** Total angular span in degrees (default: 180). */
  totalAngle?: number;

  /** Radial spacing between rows in linear units; falls back to seatMargin or 1. */
  rowMargin?: number;
};

/**
 * Manual seat sizing and spacing mode.
 */
export type ManualSeatProps = {
  /** Width of each seat in SVG units (no default; layout-derived if omitted). */
  seatWidth?: number;

  /** Height of each seat in SVG units (no default; layout-derived if omitted). */
  seatHeight?: number;

  /** Linear spacing between seats along the arc (default: 1). */
  seatMargin?: number;

  /** Disallowed in manual mode. */
  totalSeats?: never;
};

/**
 * Automatic seat distribution mode based on a total seat count.
 */
export type TotalSeatsProps = {
  /** Total number of seats to distribute across rows (default: 100). */
  totalSeats?: number;

  /** Disallowed in totalSeats mode. */
  seatWidth?: never;

  /** Disallowed in totalSeats mode. */
  seatHeight?: never;

  /** Disallowed in totalSeats mode. */
  seatMargin?: never;
};

/**
 * Complete hemicycle props: base configuration plus exactly one sizing mode.
 */
export type HemicycleProps = HemicycleBaseProps &
  (ManualSeatProps | TotalSeatsProps);
