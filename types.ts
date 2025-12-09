
export type Direction = number; // Allow cumulative angles (e.g., -90, 360, 450) for smooth animation

export enum CommandType {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  LOOP_START = 'LOOP_START',
  LOOP_END = 'LOOP_END',
  X2 = 'X2',
  X3 = 'X3',
}

export interface GridCell {
  x: number;
  y: number;
  item?: string; // 'owl', 'dog', 'house', etc.
  isObstacle?: boolean;
  isStar?: boolean;       // New: Bonus item
  portalColor?: string;   // New: 'blue', 'orange', etc.
}

export interface RobotState {
  x: number;
  y: number;
  direction: Direction;
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  start: { x: number; y: number; direction: Direction };
  target: { x: number; y: number; item: string };
  items: GridCell[]; // Other items/obstacles
}

export interface GameState {
  robot: RobotState;
  commands: CommandType[];
  isPlaying: boolean;
  currentStepIndex: number; 
  executionQueue: CommandType[]; 
}
