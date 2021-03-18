import EventEmitter from "node:events";
import Ticker from "../Ticker";

/**
 * Ticks as fast as possible.
 */
let ticker: Ticker;
/**
 * Ticks every one second.
 */
let secondTicker: Ticker;

describe(Ticker, () => {
  // Because our ticker ticks with delta time using Date.now, we should make sure it responds with values we can control!
  const originalDateNow = Date.now;
  const defaultDateNowResult = 840254400000;
  // Uses jest.mockReturnValueOnce to set the next return value of Date.now.
  let nextDateNowResult: (date: number) => void;

  beforeAll(() => {
    Date.now = jest.fn(() => defaultDateNowResult);
    nextDateNowResult = (date: number) => {
      (Date.now as jest.Mock<number, []>).mockReturnValueOnce(date);
    };
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });

  beforeEach(() => {
    ticker?.stop();
    secondTicker?.stop();

    jest.useFakeTimers();

    ticker = new Ticker();
    secondTicker = new Ticker({
      tickInterval: 1000,
    });
    (Date.now as jest.Mock<number, []>).mockReturnValue;
  });

  afterEach(() => {
    jest.clearAllTimers();
    ticker.removeAllListeners();
    secondTicker.removeAllListeners();
  });

  it("can be instantiated", () => {
    const someTicker = new Ticker();

    expect(someTicker).toBeInstanceOf(Ticker);
  });

  it("has the same functionality as an EventEmitter", () => {
    const someTicker = new Ticker();

    expect(someTicker).toBeInstanceOf(EventEmitter);
  });

  it("has a `isTicking` property, defaulting to false", () => {
    expect(Object.prototype.hasOwnProperty.call(ticker, "isTicking")).toBe(
      true
    );
    expect(ticker.isTicking).toBe(false);
  });

  it("has a `ticks` property, defaulting to zero", () => {
    expect(Object.prototype.hasOwnProperty.call(ticker, "ticks")).toBe(true);
    expect(ticker.ticks).toBe(0);
  });

  describe("tickInterval", () => {
    it("defaults to a tick interval of 1ms if none is provided", () => {
      expect(ticker.tickInterval).toBe(1);
    });

    it("Allows for a positive non-zero number as the tick interval", () => {
      const neverTick = new Ticker({
        tickInterval: Infinity,
      });
      expect(secondTicker.tickInterval).toBe(1000);
      expect(neverTick.tickInterval).toBe(Infinity);
    });

    it("throws a RangeError when providing a tick interval <= 0", () => {
      expect(
        () =>
          new Ticker({
            tickInterval: 0,
          })
      ).toThrowError(RangeError);
      expect(
        () =>
          new Ticker({
            tickInterval: -50,
          })
      ).toThrowError(RangeError);
      expect(
        () =>
          new Ticker({
            tickInterval: -Infinity,
          })
      ).toThrowError(RangeError);
      expect(() => ticker && (ticker.tickInterval = -1)).toThrowError(
        RangeError
      );
      expect(() => ticker && (ticker.tickInterval = 0)).toThrowError(
        RangeError
      );
      expect(() => ticker && (ticker.tickInterval = -Infinity)).toThrowError(
        RangeError
      );
    });
  });

  describe("start", () => {
    let onStart: jest.Mock;
    beforeEach(() => {
      onStart = jest.fn();
      ticker.on("started", onStart);
    });

    afterEach(() => {
      ticker.off("started", onStart);
    });

    it("emits a started event when called", () => {
      expect(onStart).not.toHaveBeenCalled();
      ticker.start();
      expect(onStart).toHaveBeenCalled();
    });

    it("sets the `isTicking` property to true", () => {
      ticker.start();
      expect(ticker.isTicking).toBe(true);
    });

    it("immediately calls the tick method", () => {
      const tickSpy = jest.spyOn(ticker as Ticker, "tick");
      ticker.start();
      expect(tickSpy).toHaveBeenCalled();
    });
    it("will not do anything if called again while the ticker is ticking", () => {
      const tickSpy = jest.spyOn(ticker as Ticker, "tick");
      ticker.start();
      ticker.start();
      ticker.start();
      ticker.start();
      ticker.start();
      expect(tickSpy).toHaveBeenCalledTimes(1); // because we are not running timers in this test, subsequent ticks will not happen
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe("tick", () => {
    const onTick: jest.Mock = jest.fn();

    beforeEach(() => {
      onTick.mockReset();
    });

    it("emits a tick event", () => {
      ticker.on("tick", onTick);
      ticker.tick();
    });

    it("increments the `ticks` property when a tick event occurs.", () => {
      secondTicker.start(); // calls starts ticks under the hood.
      expect(secondTicker.ticks).toBe(1);
      nextDateNowResult(defaultDateNowResult + 1000); // tell Date.now that 1s has passed :)
      jest.advanceTimersToNextTimer();
      expect(secondTicker.ticks).toBe(2);
      nextDateNowResult(defaultDateNowResult + 2000); // tell Date.now that 1s has passed :)
      jest.advanceTimersToNextTimer();
      expect(secondTicker.ticks).toBe(3);
      nextDateNowResult(defaultDateNowResult + 3000); // tell Date.now that 1s has passed :)
      jest.advanceTimersToNextTimer();
      expect(secondTicker.ticks).toBe(4);
    });

    it("schedules a tick if the ticker is running", () => {
      ticker.on("tick", onTick);
      ticker.tick();
      expect(setTimeout).not.toHaveBeenCalled();
      ticker.start();
      expect(setTimeout).toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    let onStop: jest.Mock;
    beforeEach(() => {
      onStop = jest.fn();
      ticker.on("stopped", onStop);
    });

    afterEach(() => {
      ticker.off("stopped", onStop);
    });

    it("emits a stopped event when stopped", () => {
      ticker.start();
      ticker.stop();
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it("sets `isTicking` to false", () => {
      ticker.isTicking = true;
      ticker.stop();
      expect(ticker.isTicking).toBe(false);
    });

    it("prevents future emissions of the tick event", () => {
      const onTick = jest.fn();
      ticker.start();
      jest.advanceTimersByTime(1000); // one second passes...
      ticker.on("tick", onTick); // we start snooping around for tick events
      ticker.stop(); // but we stop the ticker.
      // therefore, if more time passes, no more events!
      jest.advanceTimersByTime(1000);
      expect(onTick).not.toHaveBeenCalled();
    });

    it("does not do anything if already stopped", () => {
      ticker.stop();
      expect(onStop).toHaveBeenCalledTimes(0);
      ticker.start();
      ticker.stop();
      ticker.stop();
      ticker.stop();
      ticker.stop();
      ticker.stop();
      ticker.stop();
      ticker.stop();
      expect(onStop).toHaveBeenCalledTimes(1);
    });
  });
});
