import { createTickActionMap } from "../utils";

describe(createTickActionMap, () => {
  it("returns an object", () => {
    expect(createTickActionMap()).toBeInstanceOf(Object);
  });

  it("always returns an array for numeric indices", () => {
    const myMap = createTickActionMap();

    expect(myMap[0]).toBeInstanceOf(Array);
    expect(myMap[5]).toBeInstanceOf(Array);
    expect(myMap[-1]).toBeInstanceOf(Array);
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["-5"]).toBeInstanceOf(Array);
    expect(myMap[4]).toBeInstanceOf(Array);
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["2995"]).toBeInstanceOf(Array);
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["1000000"]).toBeInstanceOf(Array);
    expect(myMap[-892357]).toBeInstanceOf(Array);
    expect(myMap[-Infinity]).toBeInstanceOf(Array);
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["Infinity"]).toBeInstanceOf(Array);
  });

  it("returns null for non-numeric keys and NaN key", () => {
    const myMap = createTickActionMap();

    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["my key"]).toBeNull();
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap[Symbol("secret_key")]).toBeNull();
    expect(myMap[NaN]).toBeNull();
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["NaN"]).toBeNull();
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["whoa"]).toBeNull();
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["like 15 or so"]).toBeNull();
    // @ts-expect-error We are intentionally passing in non-numeric keys. Because we want to test that case!
    expect(myMap["10word"]).toBeNull();
  });
});
