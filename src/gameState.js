import {
    DAY_LENGTH,
    getNextDieTime,
    getNextHungerTime,
    getNextPoopTime,
    NIGHT_LENGTH,
    RAIN_CHANCE,
    SCENES,
} from "./constants";
import { modFox, modScene, togglePoopBag, writeModal } from "./ui";

export const gameState = {
    current: "INIT",
    clock: 1,
    // sentinal value (at -1 it is not currently active.)
    wakeTime: -1,
    scene: 0,
    sleepTime: -1,
    hungryTime: -1,
    poopTime: -1,
    dieTime: -1, // ominous
    timeToStartCelebrating: -1,
    timeToEndCelebrating: -1,
    tick() {
        this.clock += 1;
        console.log(this);

        if (this.clock === this.wakeTime) {
            this.wake();
        } else if (this.clock === this.sleepTime) {
            this.sleep();
        } else if (this.clock === this.hungryTime) {
            this.getHungry();
        } else if (this.clock === this.dieTime) {
            this.die(); // :(
        } else if (this.clock === this.timeToStartCelebrating) {
            this.startCelebrating();
        } else if (this.clock === this.timeToEndCelebrating) {
            this.endCelebrating();
        } else if (this.clock === this.poopTime) {
            this.poop();
        }

        return this.clock;
    },
    handleUserAction(icon) {
        if (
            ["SLEEP", "FEEDING", "HATCHING", "CELEBRATING"].includes(
                this.current
            )
        ) {
            // Fox is a lazy boi during these states and won't do anything
            return;
        }

        // if we've not started the game yet (or can start a new game), do so!
        if (this.current === "INIT" || this.current === "DEAD") {
            this.startGame();
            return; // return so that we don't try to interact with other icon events
        }

        // based on the button pressed, do something
        switch (icon) {
            case "weather":
                this.changeWeather();
                break;
            case "poop":
                this.cleanPoop();
                break;
            case "fish":
                this.feed();
                break;
        }
    },
    getHungry() {
        this.current = "HUNGRY";
        this.dieTime = getNextDieTime(this.clock);
        this.hungryTime = -1;
        modFox("hungry");
    },
    poop() {
        this.current = "POOPING";
        this.poopTime = -1;
        this.dieTime = getNextDieTime(this.clock);
        modFox("pooping");
    },
    cleanPoop() {
        if (this.current !== "POOPING") {
            return;
        }
        togglePoopBag(true);
        this.dieTime = -1; // can no longer die of poop related causes
        this.startCelebrating();
        this.hungryTime = getNextHungerTime(this.clock);
    },
    die() {
        this.current = "DEAD";
        modFox("dead");
        modScene("dead");
        this.resetTimes(); // Well, we can't get hungry anymore, I suppose
        writeModal(
            "The fox has perished due to your overwhelming neglect, you monster.<br/><br/>Click the middle button to play again."
        );
    },
    sleep() {
        this.sleepTime = -1; // reset sleep time
        this.current = "SLEEP";
        modFox("sleep");
        modScene("night");
        this.resetTimes(); // do not die or poop or eat during the night
        this.wakeTime = this.clock + NIGHT_LENGTH; // this will trigger wake()! which sets our sleep time
    },
    changeWeather() {
        this.scene = (1 + this.scene) % SCENES.length;
        modScene(SCENES[this.scene]);
        this.determineFoxState();
    },
    feed() {
        // can only feed when hungry
        if (this.current !== "HUNGRY") {
            return;
        }

        this.current = "FEEDING";
        this.dieTime = -1;
        this.poopTime = getNextPoopTime(this.clock);
        modFox("eating");
        this.timeToStartCelebrating = this.clock + 2;
    },
    startCelebrating() {
        this.current = "CELEBRATING";
        modFox("celebrate");
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = this.clock + 2;
    },
    endCelebrating() {
        this.timeToEndCelebrating = -1;
        this.current = "IDLING";
        this.determineFoxState();
        togglePoopBag(false);
    },
    determineFoxState() {
        if (this.current === "IDLING") {
            if (SCENES[this.scene] === "rain") {
                modFox("rain");
            } else {
                modFox("idling");
            }
        }
    },
    startGame() {
        this.resetTimes();
        this.current = "HATCHING";
        this.wakeTime = this.clock + 3; // 3 ticks to hatch!
        modFox("egg");
        modScene("day");
        writeModal(""); // closes the modal due to CSS rules
    },
    wake() {
        this.current = "IDLING";
        this.wakeTime = -1; // no longer needs to wake.
        this.sleepTime = this.clock + DAY_LENGTH; // triggers sleep());
        // will today be a rainy day?
        this.scene = Math.random() <= RAIN_CHANCE ? 1 : 0;
        this.hungryTime = getNextHungerTime(this.clock);
        modScene(SCENES[this.scene]);
        this.determineFoxState();
    },
    resetTimes() {
        this.wakeTime = -1;
        this.sleepTime = -1;
        this.hungryTime = -1;
        this.dieTime = -1;
        this.poopTime = -1;
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = -1;
    },
};

window.gameState = gameState;
