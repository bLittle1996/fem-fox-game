export const isDefined = <T>(thing: T): thing is Exclude<T, undefined> => {
  return typeof thing !== "undefined";
};

export const isNumber = (thing: unknown): thing is number => {
  return typeof thing === "number";
};
