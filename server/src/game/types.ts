/**
 * Game types
 */
export type FoxState =
  | "initial"
  | "hatching"
  | "idle"
  | "hungry"
  | "eating"
  | "pooping"
  | "sleeping"
  | "dead";
export type WeatherType = "clear" | "rain";
export type TimeOfDay = "day" | "night";

export interface GameState {
  fox: FoxState;
  weather: WeatherType;
  time: TimeOfDay;
}

export type TickAction = (state: GameState) => void;

export interface TickActionMap {
  [tick: number]: TickAction[];
}

export type UnscheduleTickActionsFunction = () => void;
