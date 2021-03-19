import EventEmitter from "node:events";
import { isDefined, isNumber } from "../utils/guards";

type TickerOptions = {
  tickInterval?: number;
};

class Ticker extends EventEmitter {
  /**
   * The number of ticks that have occurred since the ticker was created.
   */
  ticks = 0;
  /**
   * The timestamp (in milliseconds) when the last tick occurred.
   */
  protected lastTickTime = -1;
  /**
   *
   */
  isTicking = false;
  /**
   * The rate (in milliseconds) that ticks should occur at.
   */
  protected _tickInterval = 1;
  /**
   * Used to allow us to clearTimeout to prevent infinite ticking even after stopping.
   */
  scheduledTickTimeout?: NodeJS.Timeout;

  constructor(options?: TickerOptions) {
    super();

    if (isNumber(options?.tickInterval)) {
      this.tickInterval = options?.tickInterval as number; // We are casting here because the isNumber guard above guarantees the the property will be a number
    }
  }

  tick(): void {
    const now = Date.now();
    const deltaTime = now - this.lastTickTime;
    /**
     * We should only tick if the requisite amount of time
     * has passed since the last tick.
     */
    if (deltaTime >= this.tickInterval) {
      this.ticks += 1;
      this.lastTickTime = now;
      this.emit("tick", this.ticks);
    }

    if (this.isTicking) {
      // Add a request to tick in the check queue, so that we continiously tick.
      // Note that we will always tick every millisecond, instead of passing in the delay.
      // This allows for the user to change the tick interval and have it be reflected immediately,
      // instead of having to wait for the previous tick delay to pass.
      this.scheduledTickTimeout = setTimeout(this.tick.bind(this), 1);
    }
  }

  start(): void {
    if (this.isTicking) return;

    this.emit("started");
    this.isTicking = true;
    this.tick();
  }

  stop(): void {
    if (!this.isTicking) return;

    if (isDefined(this.scheduledTickTimeout)) {
      clearTimeout(this.scheduledTickTimeout);
      this.scheduledTickTimeout = undefined;
    }
    this.emit("stopped", this);
    this.isTicking = false;
  }

  /**
   *
   * @param interval The time between ticks in milliseconds. Negative numbers will result in an interval of zero milliseconds.
   */
  public set tickInterval(interval: number) {
    if (interval <= 0) {
      throw new RangeError("Must provide a number >= 1 as the `tickInterval`.");
    }
    this._tickInterval = interval;
  }

  public get tickInterval(): number {
    return this._tickInterval;
  }
}

export default Ticker;
