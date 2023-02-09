const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');
const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Interactive Animation', () => {
    it("Page should contain total of 5 Strobe elements", async () => {
        const totalStropeElements = await page.$$('.strobe');
        expect(totalStropeElements.length).toBe(5);
    });
    it("Strobe color should change on hover", async () => {
        const strobe = await page.$('.strobe:nth-child(1)');
        const strobeColor = await page.$eval('.strobe:nth-child(1)', (element) => getComputedStyle(element).backgroundColor);
        await strobe.hover();
        const newStobeColor = await page.$eval('.strobe:nth-child(1)', (el) => getComputedStyle(el).backgroundColor);
        expect(strobeColor).not.toBe(newStobeColor);
    });
    it("`@keyframes` should be used with strobe elements", async () => {
        const stylesheet = fs.readFileSync(path.resolve('./main.css'), 'utf8');
        const keyframesRule = stylesheet.match(/@keyframes/g);
        expect(keyframesRule).toBeTruthy();
    });
});