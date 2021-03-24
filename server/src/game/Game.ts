import EventEmitter from "events";
import Ticker from "./Ticker";
import {
  FoxState,
  GameState,
  TickAction,
  TickActionMap,
  TimeOfDay,
  WeatherType,
  UnscheduleTickActionsFunction,
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
    // Call all the callbacks
    this.scheduledTickActions[tickNumber].forEach((action) => {
      action(this.getState());
    });
    // and clear them out
    this.scheduledTickActions[tickNumber] = [];
  }

  scheduleTickAction(
    tickNumber: number,
    ...actions: TickAction[]
  ): UnscheduleTickActionsFunction {
    this.scheduledTickActions[tickNumber] = [
      ...this.scheduledTickActions[tickNumber],
      ...actions,
    ];

    // Remove the passed in action from the schedule map.
    const unscheduleTickActions = (): void => {
      this.scheduledTickActions[tickNumber] = this.scheduledTickActions[
        tickNumber
      ].filter((action) => !actions.includes(action));
    };

    return unscheduleTickActions;
  }

  /**
   * Called automatically when JSON.stringify is used on an instance.
   */
  toJSON(): GameState {
    return this.getState();
  }
}
