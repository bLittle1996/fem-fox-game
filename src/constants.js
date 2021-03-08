export const TICK_RATE = 3000;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.5;
export const SCENES = ["day", "rain"];
export const DAY_LENGTH = 30; // in game ticks
export const NIGHT_LENGTH = 5; // in game ticks

// Functions that get which game tick certain events should occur
export const getNextHungerTime = (clock) =>
    clock + Math.floor(Math.random() * 3) + 5;

export const getNextDieTime = (clock) =>
    clock + Math.floor(Math.random() * 3) + 3;

export const getNextPoopTime = (clock) => getNextHungerTime(clock);
