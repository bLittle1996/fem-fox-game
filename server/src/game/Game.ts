import EventEmitter from "events";
import Ticker from "./Ticker";
import {
  FoxState,
  GameState,
  TickAction,
  TimeOfDay,
  WeatherType,
} from "./types";

export default class Game extends EventEmitter {
  // Game state parameters
  protected foxState: FoxState = "initial";
  protected weather: WeatherType = "clear";
  protected time: TimeOfDay = "day";
  // internal utilities and trackers
  protected gameClock: Ticker = new Ticker();

  constructor() {
    super();

    this.gameClock.on("tick", this.processTick.bind(this));
  }

  getState(): GameState {
    return {
      fox: this.foxState,
      weather: this.weather,
      time: this.time,
    };
  }

  processTick(tickNumber: number): void {}

  scheduleTickAction(
    tickNumber: number,
    action: TickAction
  ): UnscheduleActionFunction {
    return () => unscheduleTickAction(action);
  }

  /**
   * Called automatically when JSON.stringify is used on an instance.
   * @returns
   */
  toJSON(): GameState {
    return this.getState();
  }
}
