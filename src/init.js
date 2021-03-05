import initButtons from "./buttons";
import { TICK_RATE } from "./constants";
import { gameState } from "./gameState";

async function init() {
    console.log("Starting game!");
    initButtons(gameState.handleUserAction);

    let nextTimeToTick = Date.now();

    function nextAnimationFrame() {
        const now = Date.now();

        if (nextTimeToTick <= now) {
            gameState.tick();
            nextTimeToTick = now + TICK_RATE;
        }

        requestAnimationFrame(nextAnimationFrame);
    }
    requestAnimationFrame(nextAnimationFrame);
}
// Immediately invoke the initialize function for our app and get our game up and tickin'
init();
