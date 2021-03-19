import { TickAction, TickActionMap } from "./types";

export const createTickActionMap = (): TickActionMap => {
  const map: TickActionMap = {};
  const proxy = new Proxy(map, {
    get: (target, prop: string | symbol): TickAction[] | null => {
      // Symbols can't be turned into numbers
      if (typeof prop === "symbol") {
        return null;
      }
      // convert requested key to a number
      const numericProp = +prop;
      // if it's NaN (i.e a word), return null. Otherwise return what;s at that numeric index (or an empty array);
      return Number.isNaN(numericProp) ? null : target[numericProp] ?? [];
    },
    set: (target, prop, value): boolean => {
      // Symbols can't be turned into numbers
      // In addition, if we weren't passed a function array, get out!
      if (
        typeof prop === "symbol" ||
        !Array.isArray(value) ||
        !value.every((v) => v instanceof Function)
      ) {
        return false;
      }
      // convert requested key to a number
      const numericProp = +prop;
      // If NaN, say nope.
      if (Number.isNaN(numericProp)) {
        return false;
      }
      // if we've made it here, we have a numeric index with an array of functions to pass to it.
      target[numericProp] = value;

      return true;
    },
  });

  return proxy;
};
