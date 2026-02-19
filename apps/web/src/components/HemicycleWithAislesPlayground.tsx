import { Hemicycle, HemicycleData, mulberry32 } from "@repo/ui";
import {
  Col,
  Divider,
  InputNumber,
  Row,
  Slider,
  Tooltip,
  Typography,
} from "antd";
import React, { useMemo, useState } from "react";

const { Title, Text } = Typography;

export const HemicycleWithAislesPlayground: React.FC = () => {
  // Layout
  const [rows, setRows] = useState(6);
  const [innerRadius, setInnerRadius] = useState(40);
  const [outerRadius, setOuterRadius] = useState(95);
  const [totalAngle, setTotalAngle] = useState(180);
  const [rowMargin, setRowMargin] = useState(1);

  // Aisles
  const [aisleNumber, setAisleNumber] = useState(4);
  const [aisleWidth, setAisleWidth] = useState(4);

  // Mode
  const [totalSeats, setTotalSeats] = useState(120);

  // Manual sizing
  const [seatMargin, setSeatMargin] = useState(1);

  // Demo controls
  const [fillPercent, setFillPercent] = useState(70);
  const [seed, setSeed] = useState(1);

  const data: HemicycleData[] = useMemo(() => {
    const rng = mulberry32(seed);
    const enabledP = fillPercent / 100;

    return new Array(totalSeats).fill(0).map((_, idx) => {
      const enabled = rng() < enabledP;
      return { id: `id-${idx}`, idx: idx, enabled };
    });
  }, [fillPercent, seed, totalSeats]);

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (v: number) => void,
  ) => (
    <div style={{ marginBottom: 16 }}>
      <Text>{label}</Text>
      <Row gutter={8} align="middle">
        <Col flex="auto">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(v) => onChange(v as number)}
          />
        </Col>
        <Col>
          <InputNumber
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(v) => onChange(v as number)}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <Row gutter={32}>
      {/* Controls */}
      <Col span={8}>
        <Title level={4}>Layout</Title>
        {renderSlider("Rows", rows, 1, 15, 1, setRows)}
        {renderSlider("Inner Radius", innerRadius, 0, 200, 1, setInnerRadius)}
        {renderSlider("Outer Radius", outerRadius, 10, 300, 1, setOuterRadius)}
        {renderSlider("Total Angle", totalAngle, 60, 360, 1, setTotalAngle)}
        {renderSlider("Row Margin", rowMargin, 0, 10, 0.5, setRowMargin)}

        <Divider />

        <Title level={4}>Aisles</Title>
        {renderSlider("Aisle Number", aisleNumber, 0, 10, 1, setAisleNumber)}
        {aisleNumber > 0 &&
          renderSlider(
            "Aisle Width (°)",
            aisleWidth,
            1,
            20,
            0.5,
            setAisleWidth,
          )}

        <Divider />

        {renderSlider("Total Seats", totalSeats, 1, 800, 1, setTotalSeats)}
        {renderSlider("Seat Margin", seatMargin, 0, 10, 0.5, setSeatMargin)}

        <Divider />

        <Title level={4}>Demo</Title>
        {renderSlider("Fill %", fillPercent, 0, 100, 1, setFillPercent)}
        {renderSlider("Seed", seed, 0, 9999, 1, setSeed)}
      </Col>

      {/* Preview */}
      <Col span={16}>
        <Hemicycle.WithAisles
          rows={rows}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          totalAngle={totalAngle}
          rowMargin={rowMargin}
          totalSeats={totalSeats}
          aisleNumber={aisleNumber}
          aisleWidth={aisleWidth}
          data={data}
          seatConfig={{
            wrapper: (content, seatData) => (
              <Tooltip title={`Seat ${seatData?.id}`}>
                <g style={{ cursor: "pointer", pointerEvents: "all" }}>
                  {content}
                </g>
              </Tooltip>
            ),
          }}
        />
      </Col>
    </Row>
  );
};
