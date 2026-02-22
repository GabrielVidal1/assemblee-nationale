import { describe, expect, it } from "vitest";
import { setRadialIdx } from "./setRadialIdx";
import type { SeatLayout } from "./types";

function seat(
  angle1Rad: number,
  angle2Rad: number,
  extra?: Partial<SeatLayout>,
): SeatLayout {
  return {
    // Geometry
    innerR: 0,
    outerR: 1,
    angle1Rad,
    angle2Rad,

    // SeatPosition
    idx: 0,
    radialIdx: -1,
    rowIndex: 0,
    seatIndex: 0,

    // Layout coords
    x: 0,
    y: 0,

    innerArcLength: 0,
    outerArcLength: 0,

    ...extra,
  };
}

describe("setRadialIdx", () => {
  it("assigns radialIdx in ascending mid-angle order when mirror=false", () => {
    const a = seat(0.0, 0.2, { idx: 1 });
    const b = seat(1.0, 1.2, { idx: 2 });
    const c = seat(0.5, 0.7, { idx: 3 });

    const layouts = [b, c, a]; // intentionally shuffled
    setRadialIdx(layouts, { mirror: false });

    // mid-angles: a=0.1, c=0.6, b=1.1
    expect(a.radialIdx).toBe(0);
    expect(c.radialIdx).toBe(1);
    expect(b.radialIdx).toBe(2);
  });

  it("assigns radialIdx in descending mid-angle order when mirror=true", () => {
    const a = seat(0.0, 0.2, { idx: 1 });
    const b = seat(1.0, 1.2, { idx: 2 });
    const c = seat(0.5, 0.7, { idx: 3 });

    const layouts = [b, c, a]; // intentionally shuffled
    setRadialIdx(layouts, { mirror: true });

    // descending mid-angles: b=1.1, c=0.6, a=0.1
    expect(b.radialIdx).toBe(0);
    expect(c.radialIdx).toBe(1);
    expect(a.radialIdx).toBe(2);
  });

  it("does not change array length or require pre-sorting (mutates objects)", () => {
    const s1 = seat(0.0, 0.1);
    const s2 = seat(0.2, 0.3);

    const layouts = [s2, s1];
    setRadialIdx(layouts, { mirror: false });

    expect(layouts).toHaveLength(2);
    // ensures it mutates the existing objects, not returning new ones
    expect(s1.radialIdx).toBeTypeOf("number");
    expect(s2.radialIdx).toBeTypeOf("number");
  });
});
