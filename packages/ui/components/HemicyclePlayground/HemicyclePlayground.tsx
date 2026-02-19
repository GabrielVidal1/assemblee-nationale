import React, { useMemo, useState } from "react";
import { Hemicycle } from "../Hemicycle/Hemicycle";
import { HemicycleData } from "../Hemicycle/types";
import { mulberry32 } from "./mulberry32";

type Mode = "totalSeats" | "manual";

export const HemicyclePlayground: React.FC = () => {
  // Layout
  const [rows, setRows] = useState(6);
  const [innerRadius, setInnerRadius] = useState(40);
  const [outerRadius, setOuterRadius] = useState(95);
  const [totalAngle, setTotalAngle] = useState(180);
  const [rowMargin, setRowMargin] = useState(1);

  // Mode
  const [mode, setMode] = useState<Mode>("totalSeats");
  const [totalSeats, setTotalSeats] = useState(120);

  // Manual sizing
  const [seatMargin, setSeatMargin] = useState(1);
  const [seatHeight, setSeatHeight] = useState<number | undefined>(undefined);

  // Demo controls
  const [fillPercent, setFillPercent] = useState(70);
  const [seed, setSeed] = useState(1);

  const data: HemicycleData[] = useMemo(() => {
    const rng = mulberry32(seed);
    const enabledP = fillPercent / 100;

    return new Array(totalSeats).fill(0).map((_, idx) => {
      const enabled = rng() < enabledP;
      return { id: idx, idx: idx + 1, enabled };
    });
  }, [rows, fillPercent, seed, totalSeats]);

  return (
    <div style={{ display: "flex", gap: 32 }}>
      {/* Controls */}
      <div style={{ width: 300 }}>
        <h3>Layout</h3>
        <Slider
          label="Rows"
          value={rows}
          min={1}
          max={15}
          step={1}
          onChange={setRows}
        />
        <Slider
          label="Inner Radius"
          value={innerRadius}
          min={0}
          max={200}
          step={1}
          onChange={setInnerRadius}
        />
        <Slider
          label="Outer Radius"
          value={outerRadius}
          min={10}
          max={300}
          step={1}
          onChange={setOuterRadius}
        />
        <Slider
          label="Total Angle"
          value={totalAngle}
          min={60}
          max={360}
          step={1}
          onChange={setTotalAngle}
        />
        <Slider
          label="Row Margin"
          value={rowMargin}
          min={0}
          max={10}
          step={0.5}
          onChange={setRowMargin}
        />

        <h3>Mode</h3>
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setMode("totalSeats")}
            disabled={mode === "totalSeats"}
          >
            Total Seats
          </button>
          <button
            onClick={() => setMode("manual")}
            disabled={mode === "manual"}
            style={{ marginLeft: 8 }}
          >
            Manual
          </button>
        </div>

        {mode === "totalSeats" && (
          <Slider
            label="Total Seats"
            value={totalSeats}
            min={1}
            max={500}
            step={1}
            onChange={setTotalSeats}
          />
        )}

        {mode === "manual" && (
          <>
            <Slider
              label="Seat Margin"
              value={seatMargin}
              min={0}
              max={10}
              step={0.5}
              onChange={setSeatMargin}
            />
            <Slider
              label="Seat Height"
              value={seatHeight ?? 0}
              min={0}
              max={40}
              step={1}
              onChange={(v) => setSeatHeight(v === 0 ? undefined : v)}
            />
          </>
        )}

        <h3>Demo</h3>
        <Slider
          label="Fill %"
          value={fillPercent}
          min={0}
          max={100}
          step={1}
          onChange={setFillPercent}
        />
        <Slider
          label="Seed"
          value={seed}
          min={0}
          max={9999}
          step={1}
          onChange={setSeed}
        />
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        {mode === "totalSeats" ? (
          <Hemicycle
            rows={rows}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            totalAngle={totalAngle}
            rowMargin={rowMargin}
            totalSeats={totalSeats}
            data={data}
          />
        ) : (
          <Hemicycle
            rows={rows}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            totalAngle={totalAngle}
            rowMargin={rowMargin}
            seatMargin={seatMargin}
            seatHeight={seatHeight}
            data={data}
          />
        )}
      </div>
    </div>
  );
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>
        {label}: <strong>{value}</strong>
      </label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};
