/*
 * Copyright (c) 2019
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: Ticker.js
 */

// Extracting the original timing functions from the Window object.
const originalSetTimeout = window.setTimeout;
const originalClearTimeout = window.clearTimeout;
const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;

const ticker = require('../src/ticker-service').default;

describe('Ticker Initialisation', () => {
    it("should replace timing functions with internal ones", () => {
        expect(ticker.useWindowFunctions).toBeFalsy();

        expect(setTimeout === originalSetTimeout).toBeFalsy();
        expect(clearTimeout === originalClearTimeout).toBeFalsy();
        expect(setInterval === originalSetInterval).toBeFalsy();
        expect(clearInterval === originalClearInterval).toBeFalsy();
        expect(requestAnimationFrame === originalRequestAnimationFrame).toBeFalsy();
        expect(cancelAnimationFrame === originalCancelAnimationFrame).toBeFalsy();

        expect(ticker.isRunning).toBeTruthy();
    });
    it("should be able to restore the original timing functions", () => {
        ticker.useWindowFunctions = true;

        expect(ticker.useWindowFunctions).toBeTruthy();

        expect(setTimeout === originalSetTimeout).toBeTruthy();
        expect(clearTimeout === originalClearTimeout).toBeTruthy();
        expect(setInterval === originalSetInterval).toBeTruthy();
        expect(clearInterval === originalClearInterval).toBeTruthy();
        expect(requestAnimationFrame === originalRequestAnimationFrame).toBeTruthy();
        expect(cancelAnimationFrame === originalCancelAnimationFrame).toBeTruthy();

        ticker.useWindowFunctions = false;
    });
});

describe("Ticker Timing Functions", () => {
    it("should execute the timeout callback", async () => {
        const initial = Date.now();
        const input = "Input Test";
        const timeout = 1000;

        const output = await new Promise(resolve => ticker.setTimeout(resolve, timeout, input));
        const final = Date.now();

        expect(final - initial >= timeout).toBeTruthy();
        expect(output).toBe(input);
    });
    it("should wait for the sleep to wake up", async () => {
        const initial = Date.now();
        const timeout = 1000;

        const delta = await sleep(timeout);

        const final = Date.now();

        expect(final - initial >= timeout).toBeTruthy();
    });
    it("should execute in the next frame", async () => {
        const initial = Date.now();

        await frame();

        const final = Date.now();

        expect(final - initial > 0 && final - initial <= 1000 / ticker.frameRate).toBeTruthy();
    });
    it("should execute the counter callback a specific number of times", async () => {
        let counter = 0;
        let time = 0;

        ticker.setCounter((delta) => {
            counter++;
            time += delta;
        }, 100, 5);

        await sleep(1000);

        expect(counter).toBe(5);
        expect(time >= 500).toBeTruthy();
    });
});