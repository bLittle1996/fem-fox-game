export const gameState = {
    current: "INIT",
    clock: 1,
    tick() {
        this.clock += 1;
        console.log(this.clock);
        return this.clock;
    },
    handleUserAction(icon) {
        console.log(icon);
    },
};
