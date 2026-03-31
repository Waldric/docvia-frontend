import { useState, useEffect, useRef, useCallback } from 'react';
import MilestoneNode from './MilestoneNode';
import MilestoneModal from './MilestoneModal';
import ConfettiOverlay from './ConfettiOverlay';
import ThreeCarCanvas from './ThreeCarCanvas';
import { useThreeCar } from '../hooks/useThreeCar';
import { useRoadmapAnimation } from '../hooks/useRoadmapAnimation';
import {
  calculateMilestonePositions,
  generatePathString,
} from '../utils/pathCalculations';
import type { Milestone, Position, CarScreenPosition } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────
const SVG_VIEWBOX_WIDTH  = 900;
const SVG_VIEWBOX_HEIGHT = 380;
const MIN_WIDTH          = 700;

// Docvia brand — Three.js uses numeric hex
const CAR_BODY_COLOR  = 0x3b82f6; // blue-500
const CAR_ROOF_COLOR  = 0x2563eb; // blue-600
const CAR_WHEEL_COLOR = 0x1e293b; // slate-900

// ─── Props ────────────────────────────────────────────────────────────────────
interface RoadmapCanvasProps {
  milestones: Milestone[];
  currentMilestoneIndex: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RoadmapCanvas({
  milestones,
  currentMilestoneIndex,
}: RoadmapCanvasProps) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef  = useRef<HTMLDivElement>(null);
  const pathRef       = useRef<SVGPathElement>(null);

  // ── Dimensions ────────────────────────────────────────────────────────────
  const [containerSize, setContainerSize] = useState({
    width: MIN_WIDTH,
    height: SVG_VIEWBOX_HEIGHT,
  });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width:  Math.max(width,  MIN_WIDTH),
        height: Math.max(height, SVG_VIEWBOX_HEIGHT),
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── SVG milestone positions ────────────────────────────────────────────────
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    setPositions(
      calculateMilestonePositions(
        milestones.length,
        SVG_VIEWBOX_WIDTH,
        SVG_VIEWBOX_HEIGHT
      )
    );
  }, [milestones.length]);

  // ── Three.js car ──────────────────────────────────────────────────────────
  const { canvasRef, moveCar } = useThreeCar({
    bodyColor:  CAR_BODY_COLOR,
    roofColor:  CAR_ROOF_COLOR,
    wheelColor: CAR_WHEEL_COLOR,
    width:  containerSize.width,
    height: containerSize.height,
  });

  const handleCarMove = useCallback(
    (pos: CarScreenPosition) => moveCar(pos),
    [moveCar]
  );

  // ── Roadmap animation (progress path + car driving) ───────────────────────
  const {
    animatedProgress,
    dashOffset,
    totalPathLength,
    newlyUnlocked,
    showConfetti,
    confettiOrigin,
  } = useRoadmapAnimation({
    milestones,
    positions,
    currentMilestoneIndex,
    pathEl:        pathRef.current,
    svgViewBox:    { width: SVG_VIEWBOX_WIDTH, height: SVG_VIEWBOX_HEIGHT },
    containerRect: containerSize,
    onCarMove:     handleCarMove,
  });

  // ── Modal ─────────────────────────────────────────────────────────────────
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const handleStartChapter = () => {
    // TODO: wire up to your router / reader page
    console.log('Starting chapter:', selectedMilestone?.chapter);
    setSelectedMilestone(null);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const pathString     = generatePathString(positions);
  const progressPct    = Math.round(animatedProgress * 100);

  return (
    <div className="w-full space-y-4">

      {/* ── Progress header ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
              Learning Progress
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentMilestoneIndex + 1} of {milestones.length} chapters completed
            </p>
          </div>
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
            {progressPct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500"
            style={{
              width: `${progressPct}%`,
              transition: 'width 1.1s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
        </div>
      </div>

      {/* ── Roadmap canvas ──────────────────────────────────────────────── */}
      {/*
          Layering (bottom → top):
          1. SVG road + milestone nodes      (z-index: 1, pointer-events: all)
          2. Three.js car canvas             (z-index: 2, pointer-events: none)
          3. Confetti canvas                 (z-index: 3, pointer-events: none)
      */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ height: SVG_VIEWBOX_HEIGHT }}
      >

        {/* ── Layer 3: Confetti ──────────────────────────────────────────── */}
        <ConfettiOverlay origin={confettiOrigin} active={showConfetti} />

        {/* ── Layer 2: Three.js car (transparent canvas) ─────────────────── */}
        <ThreeCarCanvas
          ref={canvasRef}
          width={containerSize.width}
          height={containerSize.height}
          zIndex={2}
        />

        {/* ── Layer 1: SVG road ──────────────────────────────────────────── */}
        <div className="overflow-x-auto w-full h-full" style={{ zIndex: 1, position: 'relative' }}>
          <svg
            width={SVG_VIEWBOX_WIDTH}
            height={SVG_VIEWBOX_HEIGHT}
            viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
            style={{ display: 'block', minWidth: MIN_WIDTH }}
            role="img"
            aria-label="Learning roadmap"
          >
            <defs>
              {/* Progress gradient */}
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#3B82F6" />
                <stop offset="50%"  stopColor="#6366F1" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Glow filter for active node */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Road shadow filter */}
              <filter id="roadShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000020" />
              </filter>
            </defs>

            {/* ── Subtle dot-grid background ──────────────────────────────── */}
            <defs>
              <pattern
                id="dotGrid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.06" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />

            {/* ── Road: background track ───────────────────────────────────── */}
            <path
              d={pathString}
              stroke="#E5E7EB"
              strokeWidth="52"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-gray-700"
              filter="url(#roadShadow)"
            />

            {/* Road asphalt texture (slightly darker) */}
            <path
              d={pathString}
              stroke="#D1D5DB"
              strokeWidth="52"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-gray-700"
            />

            {/* Road edge highlight (top rim) */}
            <path
              d={pathString}
              stroke="#F9FAFB"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="dark:stroke-gray-600"
              opacity="0.7"
            />

            {/* ── Hidden path for getPointAtLength ─────────────────────────── */}
            <path
              ref={pathRef}
              d={pathString}
              fill="none"
              stroke="none"
              strokeWidth="0"
            />

            {/* ── Progress path (colored overlay) ─────────────────────────── */}
            {totalPathLength > 0 && (
              <path
                d={pathString}
                stroke="url(#progressGrad)"
                strokeWidth="52"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={totalPathLength}
                strokeDashoffset={dashOffset}
                style={{
                  transition: 'stroke-dashoffset 1.1s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                opacity="0.55"
              />
            )}

            {/* ── Dashed center lane marker ────────────────────────────────── */}
            <path
              d={pathString}
              stroke="white"
              strokeWidth="2"
              strokeDasharray="12 10"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
              className="dark:opacity-30"
            />

            {/* ── Milestone nodes ───────────────────────────────────────────── */}
            {milestones.map((milestone, index) => (
              <MilestoneNode
                key={milestone.id}
                milestone={milestone}
                position={positions[index] ?? { x: 0, y: 0 }}
                isCurrent={index === currentMilestoneIndex}
                isNewlyUnlocked={newlyUnlocked.has(milestone.id)}
                onClick={() => setSelectedMilestone(milestone)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 px-1 text-xs text-gray-500 dark:text-gray-400">
        {[
          { color: 'bg-emerald-500', label: 'Completed' },
          { color: 'bg-indigo-500',  label: 'Current'   },
          { color: 'bg-blue-400',    label: 'Unlocked'  },
          { color: 'bg-gray-300 dark:bg-gray-600', label: 'Locked' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
            {label}
          </span>
        ))}
      </div>

      {/* ── Milestone modal ──────────────────────────────────────────────── */}
      {selectedMilestone && (
        <MilestoneModal
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onStart={handleStartChapter}
        />
      )}
    </div>
  );
}