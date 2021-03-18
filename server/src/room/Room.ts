import { Socket } from "node:net";
import Game from "../game/Game";

export default class Room {
  clients: Socket[] = [];
  game: Game = new Game();
}
