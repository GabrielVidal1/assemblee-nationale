import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Hemicycle, HemicycleData, SeatShape } from "@hemicycle/react";
import {
  Code,
  CopyIcon,
  DownloadIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center gap-3 mb-2 mt-6 first:mt-0">
    <span className="font-mono text-[10px] tracking-widest uppercase text-white/30 select-none whitespace-nowrap">
      {children}
    </span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

// ─── Control Row ──────────────────────────────────────────────────────────────
interface ControlRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

const ControlRow: React.FC<ControlRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => (
  <div className="flex items-center gap-3 py-1 group">
    <span className="w-24 sm:w-28 shrink-0 font-mono text-[10px] text-white/30 group-hover:text-white/60 transition-colors text-right leading-tight uppercase tracking-wide">
      {label}
    </span>

    <div className="flex-1 min-w-0 [&_.ant-slider-track]:bg-white [&_.ant-slider-rail]:bg-white/10 [&_.ant-slider-handle]:border-white [&_.ant-slider-handle]:bg-black [&_.ant-slider-handle:hover]:border-white [&_.ant-slider-handle::after]:bg-white [&_.ant-slider-handle::after]:shadow-none">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>

    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(v) => onChange(v.target.valueAsNumber)}
      className="w-12 sm:w-14 shrink-0"
      style={{
        fontSize: 11,
        fontFamily: "monospace",
        background: "transparent",
        borderColor: "rgba(255,255,255,0.15)",
        borderRadius: 0,
        color: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "2px 4px",
      }}
    />
  </div>
);

// ─── Pill Toggle ──────────────────────────────────────────────────────────────
interface PillToggleProps {
  title?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}

const PillToggle: React.FC<PillToggleProps> = ({
  title,
  options,
  value,
  onChange,
}) => (
  <div className="flex items-center gap-3 py-1.5">
    <span className="w-24 sm:w-28 shrink-0 font-mono text-[10px] text-white/30 text-right uppercase tracking-wide">
      {title}
    </span>
    <div className="flex gap-px bg-white/5 border border-white/10 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            "px-3 py-1 font-mono text-[10px] tracking-wide uppercase transition-all duration-150 cursor-pointer border-none",
            value === opt.value
              ? "bg-white text-black"
              : "text-white/40 hover:text-white/70 bg-transparent",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── SVG Export Helpers ───────────────────────────────────────────────────────
function getSvgString(container: HTMLElement): string | null {
  const svg = container.querySelector("svg");
  if (!svg) return null;
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

// ─── Export Button ────────────────────────────────────────────────────────────
interface ExportButtonProps {
  icon: React.ReactNode;
  label: string;
  status: "idle" | "success" | "error";
  onClick: () => void;
  hideLabel?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  icon,
  label,
  status,
  onClick,
  hideLabel = false,
}) => {
  const statusColor =
    status === "success"
      ? "text-emerald-400 border-emerald-400/40"
      : status === "error"
        ? "text-red-400 border-red-400/40"
        : "text-white/40 border-white/15 hover:text-white/80 hover:border-white/40";

  const displayLabel =
    status === "success" ? "Done" : status === "error" ? "Err" : label;

  return (
    <button
      onClick={onClick}
      title={label}
      className={[
        "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase",
        "border bg-black/60 backdrop-blur-sm transition-all duration-150 cursor-pointer",
        statusColor,
      ].join(" ")}
    >
      {icon}
      {!hideLabel && <span className="hidden sm:inline">{displayLabel}</span>}
      {!hideLabel && (
        <span className="sm:hidden">
          {status !== "idle" ? (status === "success" ? "✓" : "✗") : ""}
        </span>
      )}
    </button>
  );
};

// ─── Controls Content ─────────────────────────────────────────────────────────
interface ControlsContentProps {
  rows: number;
  setRows: (v: number) => void;
  innerRadius: number;
  setInnerRadius: (v: number) => void;
  outerRadius: number;
  setOuterRadius: (v: number) => void;
  totalAngle: number;
  setTotalAngle: (v: number) => void;
  rowMargin: number;
  setRowMargin: (v: number) => void;
  totalSeats: number;
  setTotalSeats: (v: number) => void;
  seatMargin: number;
  setSeatMargin: (v: number) => void;
  shape: SeatShape;
  setShape: (v: SeatShape) => void;
  seatBorderRadius: number;
  setSeatBorderRadius: (v: number) => void;
  radius: number;
  setRadius: (v: number) => void;
  ordering: "row" | "radial";
  setOrdering: (v: "row" | "radial") => void;
  aisleNumber: number;
  setAisleNumber: (v: number) => void;
  aisleWidth: number;
  setAisleWidth: (v: number) => void;
  arcAisleNumber: number;
  setArcAisleNumber: (v: number) => void;
  arcAisleWidth: number;
  setArcAisleWidth: (v: number) => void;
}

const ControlsContent: React.FC<ControlsContentProps> = (p) => (
  <>
    <SectionLabel>Layout</SectionLabel>
    <ControlRow
      label="Rows"
      value={p.rows}
      min={1}
      max={15}
      step={1}
      onChange={p.setRows}
    />
    <ControlRow
      label="Inner R"
      value={p.innerRadius}
      min={0}
      max={p.outerRadius - 10}
      step={1}
      onChange={p.setInnerRadius}
    />
    <ControlRow
      label="Outer R"
      value={p.outerRadius}
      min={p.innerRadius + 10}
      max={300}
      step={1}
      onChange={p.setOuterRadius}
    />
    <ControlRow
      label="Angle"
      value={p.totalAngle}
      min={60}
      max={360}
      step={1}
      onChange={p.setTotalAngle}
    />
    <ControlRow
      label="Row Margin"
      value={p.rowMargin}
      min={0}
      max={10}
      step={0.5}
      onChange={p.setRowMargin}
    />

    <SectionLabel>Seats</SectionLabel>
    <PillToggle
      title="Shape"
      value={p.shape}
      onChange={(v) => p.setShape(v as SeatShape)}
      options={[
        { label: "Arc", value: "arc" },
        { label: "Rect", value: "rect" },
        { label: "Circle", value: "circle" },
      ]}
    />
    <ControlRow
      label="Count"
      value={p.totalSeats}
      min={1}
      max={800}
      step={1}
      onChange={p.setTotalSeats}
    />
    <ControlRow
      label="Seat Margin"
      value={p.seatMargin}
      min={0}
      max={10}
      step={0.5}
      onChange={p.setSeatMargin}
    />
    {p.shape !== "circle" ? (
      <ControlRow
        label="Brd. Radius"
        value={p.seatBorderRadius}
        min={0}
        max={4}
        step={0.1}
        onChange={p.setSeatBorderRadius}
      />
    ) : (
      <ControlRow
        label="Radius"
        value={p.radius}
        min={0.5}
        max={3}
        step={0.1}
        onChange={p.setRadius}
      />
    )}
    <PillToggle
      title="Order"
      value={p.ordering}
      onChange={(v) => p.setOrdering(v as "row" | "radial")}
      options={[
        { label: "Row", value: "row" },
        { label: "Radial", value: "radial" },
      ]}
    />

    <SectionLabel>Aisles</SectionLabel>
    <ControlRow
      label="Radial #"
      value={p.aisleNumber}
      min={0}
      max={5}
      step={1}
      onChange={p.setAisleNumber}
    />
    <ControlRow
      label="Radial W"
      value={p.aisleWidth}
      min={0}
      max={20}
      step={0.5}
      onChange={p.setAisleWidth}
    />
    <ControlRow
      label="Arc #"
      value={p.arcAisleNumber}
      min={0}
      max={5}
      step={1}
      onChange={p.setArcAisleNumber}
    />
    <ControlRow
      label="Arc W"
      value={p.arcAisleWidth}
      min={0}
      max={20}
      step={0.5}
      onChange={p.setArcAisleWidth}
    />
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const HemicyclePlayground: React.FC = () => {
  // Layout
  const [rows, setRows] = useState(15);
  const [innerRadius, setInnerRadius] = useState(40);
  const [outerRadius, setOuterRadius] = useState(95);
  const [totalAngle, setTotalAngle] = useState(200);
  const [rowMargin, setRowMargin] = useState(1);
  // Seat
  const [totalSeats, setTotalSeats] = useState(600);
  const [seatMargin, setSeatMargin] = useState(1);
  const [shape, setShape] = useState<SeatShape>("arc");
  const [seatBorderRadius, setSeatBorderRadius] = useState(0.5);
  const [radius, setRadius] = useState(1.5);
  const [ordering, setOrdering] = useState<"row" | "radial">("radial");
  // Aisles
  const [aisleNumber, setAisleNumber] = useState(5);
  const [aisleWidth, setAisleWidth] = useState(4);
  const [arcAisleNumber, setArcAisleNumber] = useState(0);
  const [arcAisleWidth, setArcAisleWidth] = useState(4);

  // Mobile panel state
  const [panelOpen, setPanelOpen] = useState(false);

  // Export state
  const previewRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [copyReactStatus, setCopyReactStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const data = useMemo<HemicycleData[]>(() => {
    return Array.from({ length: totalSeats }, (_, idx) => ({
      idx,
      seatConfig: {
        color: `hsl(${(idx * 360) / totalSeats}, 80%, 55%)`,
      },
    }));
  }, [totalSeats]);

  const controlsProps: ControlsContentProps = {
    rows,
    setRows,
    innerRadius,
    setInnerRadius,
    outerRadius,
    setOuterRadius,
    totalAngle,
    setTotalAngle,
    rowMargin,
    setRowMargin,
    totalSeats,
    setTotalSeats,
    seatMargin,
    setSeatMargin,
    shape,
    setShape,
    seatBorderRadius,
    setSeatBorderRadius,
    radius,
    setRadius,
    ordering,
    setOrdering,
    aisleNumber,
    setAisleNumber,
    aisleWidth,
    setAisleWidth,
    arcAisleNumber,
    setArcAisleNumber,
    arcAisleWidth,
    setArcAisleWidth,
  };

  const handleCopySvg = async () => {
    if (!previewRef.current) return;
    const svgString = getSvgString(previewRef.current);
    if (!svgString) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(svgString);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleDownloadSvg = () => {
    if (!previewRef.current) return;
    const svgString = getSvgString(previewRef.current);
    if (!svgString) {
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 2000);
      return;
    }
    try {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hemicycle.svg";
      a.click();
      URL.revokeObjectURL(url);
      setDownloadStatus("success");
    } catch {
      setDownloadStatus("error");
    }
    setTimeout(() => setDownloadStatus("idle"), 2000);
  };

  const handleCopyReact = async () => {
    const reactCode = `
<Hemicycle
  rows={${rows}}
  innerRadius={${innerRadius}}
  outerRadius={${outerRadius}}
  totalAngle={${totalAngle}}
  rowMargin={${rowMargin}}
  totalSeats={${totalSeats}}
  seatMargin={${seatMargin}}
  orderBy="${ordering}"
  aislesCount={${aisleNumber}}
  aislesWidth={${aisleWidth}}
  arcAislesCount={${arcAisleNumber}}
  arcAislesWidth={${arcAisleWidth}}
  seatConfig={{
    shape: "${shape}",
    ${shape === "circle" ? `radius: ${radius},` : `borderRadius: ${seatBorderRadius},`}
    props: {
      style: { cursor: "pointer", pointerEvents: "all" },
    },
  }}
/>`.trim();
    try {
      await navigator.clipboard.writeText(reactCode);
      setCopyReactStatus("success");
    } catch {
      setCopyReactStatus("error");
    }
    setTimeout(() => setCopyReactStatus("idle"), 2000);
  };

  return (
    <div className="h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      <Navbar />

      <div className="flex bg-black font-sans flex-1 min-h-0 relative">
        {/* ── Desktop Controls Panel ───────────────────────────────────── */}
        <aside className="hidden lg:flex w-96 xl:w-112 shrink-0 bg-black border-r border-white/10 flex-col">
          <div
            className="flex-1 overflow-y-auto px-5 py-6 overscroll-contain"
            style={{ scrollbarWidth: "none" }}
          >
            <ControlsContent {...controlsProps} />
          </div>
        </aside>

        {/* ── Preview Area ─────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col items-center justify-center bg-black relative overflow-hidden min-w-0">
          {/* Dot-grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Seat count badge */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 font-mono text-[10px] tracking-widest uppercase text-white/20 z-10">
            {totalSeats} seats · {rows} rows
          </div>

          {/* Mobile controls toggle */}
          <button
            onClick={() => setPanelOpen(true)}
            className="lg:hidden absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase border border-white/15 bg-black/60 backdrop-blur-sm text-white/40 hover:text-white/80 hover:border-white/40 transition-all cursor-pointer"
          >
            <SlidersHorizontal width={12} height={12} />
            <span>Controls</span>
          </button>

          {/* Hemicycle */}
          <div
            ref={previewRef}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <Hemicycle
              rows={rows}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              totalAngle={totalAngle}
              rowMargin={rowMargin}
              data={data}
              totalSeats={totalSeats}
              seatMargin={seatMargin}
              orderBy={ordering}
              aislesCount={aisleNumber}
              aislesWidth={aisleWidth}
              arcAislesCount={arcAisleNumber}
              arcAislesWidth={arcAisleWidth}
              seatConfig={{
                shape,
                radius: shape === "circle" ? radius : undefined,
                borderRadius: seatBorderRadius,
                wrapper: (content, data) => (
                  <Tooltip key={data?.idx}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent>
                      <span style={{ fontFamily: "monospace", fontSize: 11 }}>
                        seat {data?.idx}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ),
                props: {
                  style: { cursor: "pointer", pointerEvents: "all" },
                },
              }}
            />
          </div>

          {/* ── Export Buttons ──────────────────────────────────────────── */}
          <div className="absolute bottom-4 right-3 sm:bottom-5 sm:right-5 z-20 flex items-center gap-1.5 sm:gap-2">
            <ExportButton
              icon={<Code width={12} height={12} />}
              label="Copy React"
              status={copyReactStatus}
              onClick={handleCopyReact}
            />
            <ExportButton
              icon={<CopyIcon width={12} height={12} />}
              label="Copy SVG"
              status={copyStatus}
              onClick={handleCopySvg}
            />
            <ExportButton
              icon={<DownloadIcon width={12} height={12} />}
              label="Download"
              status={downloadStatus}
              onClick={handleDownloadSvg}
            />
          </div>
        </main>

        {/* ── Mobile Controls Drawer ───────────────────────────────────── */}
        {/* Backdrop */}
        {panelOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />
        )}

        {/* Drawer panel */}
        <div
          className={[
            "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10",
            "transition-transform duration-300 ease-in-out",
            panelOpen ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
          style={{ maxHeight: "75vh" }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
              Controls
            </span>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1 text-white/30 hover:text-white/70 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X width={14} height={14} />
            </button>
          </div>

          {/* Scrollable controls */}
          <div
            className="overflow-y-auto px-5 py-4 overscroll-contain"
            style={{ maxHeight: "calc(75vh - 44px)", scrollbarWidth: "none" }}
          >
            <ControlsContent {...controlsProps} />
            {/* Bottom padding for safe area */}
            <div className="h-6" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
