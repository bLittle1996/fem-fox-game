import { createMachine, interpret, Interpreter } from 'xstate';
import Ticker from './Ticker';


type FoxState = "initial" | "hatching" | "idle" | "hungry" | "eating" | "pooping" | "sleeping" | "dead"
type WeatherType = "clear" | "rain";
type TimeOfDay = "day" | "night";

export default class Game {
    foxState: FoxState = "initial";
    weather: WeatherType = "clear";
    time: TimeOfDay = "day";

    protected gameClock: Ticker = new Ticker();
}