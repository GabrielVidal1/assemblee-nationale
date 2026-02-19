type BaseRadialSeatingParams = {
  rows: number;
  innerRadius: number;
  radialStep: number;
  effectiveRowMargin: number;
};

type DistributeSeatsFromTotalParams = BaseRadialSeatingParams & {
  totalSeats: number;
};

export function distributeSeatsFromTotal({
  totalSeats,
  rows,
  innerRadius,
  radialStep,
  effectiveRowMargin,
}: DistributeSeatsFromTotalParams): number[] {
  const midRadii = Array.from({ length: rows }, (_, i) => {
    const rowInnerR = innerRadius + i * radialStep;
    const rowOuterR = rowInnerR + radialStep;
    const bandInnerR = rowInnerR + effectiveRowMargin / 2;
    const bandOuterR = rowOuterR - effectiveRowMargin / 2;
    return (bandInnerR + bandOuterR) / 2;
  });

  const totalArc = midRadii.reduce((s, r) => s + r, 0);
  const real = midRadii.map((r) => (r / totalArc) * totalSeats);
  const floored = real.map(Math.floor);
  const remainder = real.map((v, i) => v - floored[i]);
  const leftover = totalSeats - floored.reduce((a, b) => a + b, 0);

  const indices = remainder.map((r, i) => ({ r, i })).sort((a, b) => b.r - a.r);

  for (let k = 0; k < leftover; k++) floored[indices[k].i]++;

  return floored.map((n) => Math.max(n, 1));
}

type DistributeSeatsParams = BaseRadialSeatingParams & {
  totalAngleRad: number;
  seatMarginLinear: number;
};

export function distributeSeats({
  rows,
  innerRadius,
  radialStep,
  totalAngleRad,
  seatMarginLinear,
  effectiveRowMargin,
}: DistributeSeatsParams): number[] {
  return Array.from({ length: rows }, (_, rowIndex) => {
    const rowInnerR = innerRadius + rowIndex * radialStep;
    const rowOuterR = rowInnerR + radialStep;

    const bandInnerR = rowInnerR + effectiveRowMargin / 2;
    const bandOuterR = rowOuterR - effectiveRowMargin / 2;
    const midR = (bandInnerR + bandOuterR) / 2;

    // Convert constant linear gap to angular gap at this radius
    const seatMarginRad = seatMarginLinear / midR;

    // Square-ish seat: angular size equals radial height at this radius
    const naturalSeatAngle = (radialStep - effectiveRowMargin) / midR;

    const slotAngle = naturalSeatAngle + seatMarginRad;

    return Math.max(1, Math.round(totalAngleRad / slotAngle));
  });
}
