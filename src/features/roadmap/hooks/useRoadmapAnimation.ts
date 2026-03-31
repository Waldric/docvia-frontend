import { useState, useEffect, useRef } from 'react';
import type { Milestone, Position, CarScreenPosition } from '../types';
import {
  approximatePathLength,
  getCarPositionAtProgress,
  getPathTangentAngle,
  svgToCanvasCoords,
} from '../utils/pathCalculations';

interface UseRoadmapAnimationProps {
  milestones: Milestone[];
  positions: Position[];
  currentMilestoneIndex: number;
  /** Ref to the hidden SVG path element used for getPointAtLength */
  pathEl: SVGPathElement | null;
  /** SVG viewBox dimensions */
  svgViewBox: { width: number; height: number };
  /** Rendered container dimensions (pixels) */
  containerRect: { width: number; height: number };
  /** Callback — called whenever the car should move */
  onCarMove: (pos: CarScreenPosition) => void;
}

export function useRoadmapAnimation({
  milestones,
  positions,
  currentMilestoneIndex,
  pathEl,
  svgViewBox,
  containerRect,
  onCarMove,
}: UseRoadmapAnimationProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [newlyUnlocked, setNewlyUnlocked]       = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti]         = useState(false);
  const [confettiOrigin, setConfettiOrigin]     = useState<Position>({ x: 0, y: 0 });
  const prevCompletedRef = useRef<Set<string>>(new Set());
  const totalPathLength  = approximatePathLength(positions);

  // Animate progress on milestone change
  useEffect(() => {
    if (milestones.length <= 1) return;

    const target =
      currentMilestoneIndex / (milestones.length - 1);

    let start: number | null = null;
    const startVal = animatedProgress;
    const duration = 1100;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const raw = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - raw, 3);
      const current = startVal + (target - startVal) * eased;
      setAnimatedProgress(current);

      // Drive car position on each animation frame
      if (positions.length > 0 && containerRect.width > 0) {
        const svgPt = getCarPositionAtProgress(current, positions, pathEl);
        const canvasPt = svgToCanvasCoords(svgPt, svgViewBox, containerRect);
        const angle = getPathTangentAngle(current, positions, pathEl);
        onCarMove({ x: canvasPt.x, y: canvasPt.y, angle });
      }

      if (raw < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMilestoneIndex, milestones.length]);

  // Detect newly unlocked milestones (for unlock animation)
  useEffect(() => {
    const currentCompleted = new Set(
      milestones.filter((m) => m.isCompleted).map((m) => m.id)
    );

    const freshlyUnlocked = milestones
      .filter(
        (m) =>
          m.isUnlocked &&
          !m.isCompleted &&
          !prevCompletedRef.current.has(m.id)
      )
      .map((m) => m.id);

    if (freshlyUnlocked.length > 0) {
      setNewlyUnlocked(new Set(freshlyUnlocked));
      setTimeout(() => setNewlyUnlocked(new Set()), 1200);
    }

    // Confetti on newly completed milestone
    const newlyCompleted = milestones.filter(
      (m) => m.isCompleted && !prevCompletedRef.current.has(m.id)
    );

    if (newlyCompleted.length > 0 && positions.length > 0) {
      const completedIdx = milestones.findIndex(
        (m) => m.id === newlyCompleted[0].id
      );
      if (positions[completedIdx]) {
        setConfettiOrigin(positions[completedIdx]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2800);
      }
    }

    prevCompletedRef.current = currentCompleted;
  }, [milestones, positions]);

  // strokeDashoffset for progress path
  const dashOffset =
    totalPathLength > 0
      ? totalPathLength - totalPathLength * animatedProgress
      : 0;

  return {
    animatedProgress,
    dashOffset,
    totalPathLength,
    newlyUnlocked,
    showConfetti,
    confettiOrigin,
  };
}