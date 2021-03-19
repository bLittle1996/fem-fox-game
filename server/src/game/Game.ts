import EventEmitter from "events";
import Ticker from "./Ticker";
import {
  FoxState,
  GameState,
  TickAction,
  TickActionMap,
  TimeOfDay,
  WeatherType,
} from "./types";
import { createTickActionMap } from "./utils";

export default class Game extends EventEmitter {
  // Game state parameters
  protected foxState: FoxState = "initial";
  protected weather: WeatherType = "clear";
  protected time: TimeOfDay = "day";
  // internal utilities and trackers
  protected gameClock: Ticker = new Ticker();
  protected scheduledTickActions: TickActionMap = createTickActionMap();

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

  processTick(tickNumber: number): void {
    this.scheduledTickActions[tickNumber].forEach((action) => {
      action(this.getState());
    });
  }

  scheduleTickAction(tickNumber: number, action: TickAction): () => void {
    this.scheduledTickActions[tickNumber] = [
      ...this.scheduledTickActions[tickNumber],
      action,
    ];

    // Remove the passed in action from the schedule map.
    const unscheduleTickAction = (tickAction: TickAction): void => {
      this.scheduledTickActions[tickNumber] = this.scheduledTickActions[
        tickNumber
      ].filter((action) => action !== tickAction);
    };

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
