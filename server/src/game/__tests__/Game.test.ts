import Game from "../Game";

describe(Game, () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("getState", () => {
    it("returns an object representing the state of the game", () => {
      const game = new Game();

      expect(game.getState()).toBeInstanceOf(Object);
      expect(game.getState()).toEqual({
        fox: expect.any(String),
        weather: expect.any(String),
        time: expect.any(String),
      });
    });
  });

  describe("toJSON", () => {
    it("Returns the object created by `getState` when serialized to JSON.", () => {
      const game = new Game();
      const serializedGameState = JSON.stringify(game);

      expect(JSON.parse(serializedGameState)).toEqual(game.getState());
    });
  });

  describe("scheduleTickAction", () => {
    it("adds a callback to an array of callbacks to process on a given tick", () => {
      const myCallback = () => undefined;
      const anotherCallback = () => 1;
      const game = new Game();

      game.scheduleTickAction(13, myCallback);
      game.scheduleTickAction(14, myCallback);
      game.scheduleTickAction(14, anotherCallback);

      // We use the Reflection API to access to property, because we defined it as protected or private on the class. This bypasses the compiler warning about it.
      expect(Reflect.get(game, "scheduledTickActions")[13]).toEqual([
        myCallback,
      ]);
      expect(Reflect.get(game, "scheduledTickActions")[14]).toEqual([
        myCallback,
        anotherCallback,
      ]);
    });

    it("Can schedule multiple callbacks at once", () => {
      const myCallback = () => undefined;
      const anotherCallback = () => 1;
      const game = new Game();

      game.scheduleTickAction(13, myCallback, anotherCallback);

      expect(Reflect.get(game, "scheduledTickActions")[13]).toEqual([
        myCallback,
        anotherCallback,
      ]);
    });

    it("returns a function that can be used to remove registered callbacks from the queue.", () => {
      const myCallback = () => undefined;
      const myOtherCallback = () => undefined;
      const myOtherOtherCallback = () => undefined;
      const butISurvive = () => "live lord";
      const game = new Game();

      const unscheduleThatFunctionPleaseMyGoodFriend = game.scheduleTickAction(
        13,
        myCallback
      );

      const unscheduleManyAtOnce = game.scheduleTickAction(
        2,
        myCallback,
        myOtherCallback,
        myOtherOtherCallback,
        myCallback
      );

      // since it's the same reference, we should expect that it goes away. I think.
      const unscheduleAllMyCallback = game.scheduleTickAction(1, myCallback);
      game.scheduleTickAction(1, myCallback);

      game.scheduleTickAction(2, butISurvive);

      expect(Reflect.get(game, "scheduledTickActions")[13]).toEqual([
        myCallback,
      ]);

      expect(Reflect.get(game, "scheduledTickActions")[2]).toEqual([
        myCallback,
        myOtherCallback,
        myOtherOtherCallback,
        myCallback,
        butISurvive,
      ]);

      expect(Reflect.get(game, "scheduledTickActions")[1]).toEqual([
        myCallback,
        myCallback,
      ]);

      unscheduleThatFunctionPleaseMyGoodFriend();
      unscheduleManyAtOnce();
      unscheduleAllMyCallback();

      expect(Reflect.get(game, "scheduledTickActions")[2]).toEqual([
        butISurvive,
      ]);

      expect(Reflect.get(game, "scheduledTickActions")[13]).toEqual([]);

      expect(Reflect.get(game, "scheduledTickActions")[1]).toEqual([]);
    });
  });

  describe("processTick", () => {
    /**
     * Because a jest.Mock is _not_ an instanceof Function, we must wrap it to ensure that it can
     * pass such checks in conditionals.
     *
     * @param mock The mock function you'd like towrap
     * @returns A function that will call the passed in mock, passing in any arguments.
     */
    const wrapMockFn = (mock: jest.Mock) => (...params: any[]) =>
      mock(...params);
    it("executes all functions registered for that tick number", () => {
      const tickOne = jest.fn();
      const tickTwo = jest.fn();
      const game = new Game();

      game.scheduleTickAction(1, wrapMockFn(tickOne), wrapMockFn(tickOne));
      game.scheduleTickAction(2, wrapMockFn(tickTwo));

      game.processTick(1);

      expect(tickOne).toHaveBeenCalledTimes(2);
      expect(tickTwo).not.toHaveBeenCalled();
    });

    it("calls the registered functions with the current state of the game", () => {
      const tickOne = jest.fn();
      const game = new Game();
      const gameState = game.getState();

      game.scheduleTickAction(1, wrapMockFn(tickOne));
      game.processTick(1);

      expect(tickOne).toHaveBeenCalledWith(gameState);
    });

    it("empties the registered callback array for the passed in tick", () => {
      const tickOne = jest.fn();
      const game = new Game();

      game.scheduleTickAction(1, wrapMockFn(tickOne));

      game.processTick(1);

      expect(Reflect.get(game, "scheduledTickActions")[1]).toEqual([]);
    });
  });
});
