import Ticker from "./Ticker";

describe(Ticker, () => {
  it("can be instantiated", () => {
    const someTicker = new Ticker();

    expect(someTicker).toBeInstanceOf(Ticker);
  });
});
