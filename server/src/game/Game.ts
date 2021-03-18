import EventEmitter from "events";
import Ticker from "./Ticker";

type FoxState =
  | "initial"
  | "hatching"
  | "idle"
  | "hungry"
  | "eating"
  | "pooping"
  | "sleeping"
  | "dead";
type WeatherType = "clear" | "rain";
type TimeOfDay = "day" | "night";

export default class Game extends EventEmitter {
  // Game state parameters
  foxState: FoxState = "initial";
  weather: WeatherType = "clear";
  time: TimeOfDay = "day";
  // internal utilities and trackers
  protected gameClock: Ticker = new Ticker();

  emitState() {
    return this.emit("stateChange", this);
  }

  hatch() {
    // We can only hatch when dead or first starting the game
    if (this.foxState !== "dead" && this.foxState !== "initial") return;
  }

  /**
   * Called automatically when JSON.stringify is used on an instance.
   * @returns
   */
  toJSON() {
    return {
      fox: this.foxState,
      weather: this.weather,
      time: this.time,
    };
  }
}
