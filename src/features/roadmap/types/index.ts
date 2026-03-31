export interface Milestone {
  id: string;
  title: string;
  description: string;
  chapter: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  points: number;
  icon?: string;
}

export interface RoadmapProgress {
  currentMilestone: number;
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
}

export interface Position {
  x: number;
  y: number;
}

export type AnimationState = 'idle' | 'unlocking' | 'completing';

/** Screen-space position of the car (pixels, relative to container) */
export interface CarScreenPosition {
  x: number;      // pixels from container left
  y: number;      // pixels from container top
  angle: number;  // radians — road tangent, used to yaw the 3D car
}

/** Configuration passed to the Three.js car hook */
export interface ThreeCarConfig {
  /** Primary body color (hex number, e.g. 0x3B82F6) */
  bodyColor: number;
  /** Roof color — slightly darker shade */
  roofColor: number;
  /** Wheel color */
  wheelColor: number;
  /** Canvas element to render into */
  canvas: HTMLCanvasElement;
  /** Initial screen position */
  initialPosition: CarScreenPosition;
}