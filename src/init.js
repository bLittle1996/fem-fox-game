import initButtons from "./buttons";
import { TICK_RATE } from "./constants";
import { gameState } from "./gameState";

async function init() {
    console.log("Init!");
    initButtons(gameState.handleUserAction.bind(gameState)); // bind this to gameState so our function knows the context it ought to be called from

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
