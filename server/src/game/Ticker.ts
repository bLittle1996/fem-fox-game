import EventEmitter from "node:events";
import { isDefined, isNumber } from "../utils/guards";

type TickerOptions = {
    tickInterval?: number;
};

class Ticker extends EventEmitter {
    /**
     * The number of ticks that have occurred since the ticker was created.
     */
    ticks: number = 0;
    /**
     * The timestamp (in milliseconds) when the last tick occurred.
     */
    lastTickTime: number = -1;
    /**
     * The rate (in milliseconds) that ticks should occur at.
     */
    protected _tickInterval?: number;
    scheduledTickImmediate?: NodeJS.Immediate;

    constructor(options?: TickerOptions) {
        super();
        this.tickInterval = options?.tickInterval;
    }

    tick() {
        const now = Date.now();
        const deltaTime = now - this.lastTickTime;
        /**
         * If we have no  tick interval defined, we should tick all the damn time.
         * 
         * If we do have a tick interval defined, we should only tick if the requisite amount of time
         * has passed since the last tick.
         */
        if(!isDefined(this.tickInterval) || (isDefined(this.tickInterval) && deltaTime - this.lastTickTime > this.tickInterval)) { 
            this.emit('tick', Date.now());
        }
        // Add a request to tick in the check queue, so that we continiously tick.
        this.scheduledTickImmediate = setImmediate(this.tick.bind(this));
    }
    
    start() {
        this.emit('started');
        this.tick();

        this.once
    }

    stop() {
        if(!isDefined(this.scheduledTickImmediate)) { 
            // still send the event even if we haven't ticked yet.
            this.emit('stopped', this);
            return; 
        };

        clearImmediate(this.scheduledTickImmediate);
        this.emit('stopped', this);
    }

    /**
     * 
     * @param interval The time between ticks in milliseconds. Negative numbers will result in an interval of zero milliseconds.
     */
    public set tickInterval(interval: number | undefined) {
        this._tickInterval = isNumber(interval) ?  Math.max(0, interval) : undefined;
    }

    public get tickInterval() {
        return this._tickInterval;
    }
}

export default Ticker;