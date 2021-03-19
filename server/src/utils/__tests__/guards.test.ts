import { isDefined, isNumber } from "../guards";

describe("guards", () => {
  describe(isDefined, () => {
    it("returns `true` if the passed in value is not `undefined`", () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined("")).toBe(true);
      expect(isDefined(null)).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined(NaN)).toBe(true);
      expect(
        isDefined(() => {
          /* noop */
        })
      ).toBe(true);
      expect(isDefined(0n)).toBe(true);
      expect(isDefined("undefined")).toBe(true);
      expect(isDefined(Infinity)).toBe(true);
    });
    it("returns `false` if the passed in value is `undefined`", () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe(isNumber, () => {
    it("returns `true` if a number is passed in", () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(0b001000101)).toBe(true);
      expect(isNumber(10e-1)).toBe(true);
      expect(isNumber(0xba55)).toBe(true);
    });

    it("returns `false` if a number is not passed in", () => {
      expect(isNumber(100n)).toBe(false);
      expect(isNumber("0")).toBe(false);
      expect(isNumber("number")).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(
        isNumber(() => {
          /**/
        })
      ).toBe(false);
    });
  });
});
