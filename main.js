'use strict';

const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    while(true) {
        console.log("---------------------------------------------------");
        const query = await new Promise(resolve => rl.question("Search: ", resolve));
        if (query === '!exit') {
            rl.close();
            await browser.close();
            return;
        }
        let searchQuery = query;
        await page.goto(`https://www.google.com/search?q=${searchQuery}`);

        await page.setViewport({width: 1080, height: 1024});

        const searchResultSelector = '.yuRUbf';
        await page.waitForSelector(searchResultSelector);
        const elements = await page.$$(searchResultSelector);
        if (elements.length > 100) { // Check to make sure it's getting the correct element
            console.log("Found over 100 elements under searchResultSelector, aborting");
            process.exit();
        }
        for (let i = 0; i < elements.length; i++) {
            const hrefValue = await elements[i].$eval('a', a => a.href);
            console.log("- " + hrefValue);
        } 
    }
})();
