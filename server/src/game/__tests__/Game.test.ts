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
});
