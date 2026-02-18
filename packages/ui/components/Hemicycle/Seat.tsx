export type Seat = Partial<HemicycleData> & {
  idx: number;
  path: string;
};

export const SeatRenderer: React.FC<{ seat: Seat }> = ({ seat }) => (
  <path
    d={seat.path}
    fill={seat.enabled ? "#2563eb" : "#e2e8f0"}
    stroke="#fff"
    strokeWidth={0.8}
    strokeLinejoin="round"
    style={{ transition: "fill 0.2s" }}
  />
);
