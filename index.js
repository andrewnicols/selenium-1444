// Test requirements.
require('dotenv-defaults/config');
const { PerformanceObserver, performance } = require('perf_hooks');
const async_hooks = require('async_hooks');
const ProgressBar = require('progress')
const fs = require('fs');

// Selenium components.
const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

////////////////////////////////////////////////////////////////////////////
// Run configuration
////////////////////////////////////////////////////////////////////////////

// The number of iterations to run for each browser and Selenium version.
const iterations = parseInt(process.env.ITERATIONS);

// The browser to run.
const browsers = process.env.BROWSERS.split(' ');

// The Selenium versions and URLs to test against.
const seleniums = [
    {
        name: '3.141.59',
        url: 'http://localhost:5444/wd/hub',
    },
    {
        name: '4.1.1',
        url: 'http://localhost:4444/',
    },
];


////////////////////////////////////////////////////////////////////////////
// End configuration
////////////////////////////////////////////////////////////////////////////

// Store the results in an Object for reporting at the end.
const results = {};

const obs = new PerformanceObserver((items) => {
    const result = items.getEntries()[0];
    if (!results[result.name]) {
        results[result.name] = {
            results: [],
            duration: 0,
            average: 0,
        };
    }

    results[result.name].results.push(result);
    results[result.name].duration += result.duration;
    results[result.name].average = results[result.name].duration / results[result.name].results.length;
    performance.clearMarks();
});
obs.observe({type: 'measure'});

async function run(url, browser) {
    const builder = new Builder()
        .forBrowser(browser)
        .setChromeOptions(new chrome.Options().headless())
        .setFirefoxOptions(new firefox.Options().headless())
        .usingServer(url);

    return await builder.build();
}

(async () => {
    for (const browserName of browsers) {
        for (const {name, url} of seleniums) {
            console.log("Starting runs for %s %s against %s", browserName, name, url);
            const bar = new ProgressBar(':bar', {total: iterations});
            const timerMark = `${name} - ${browserName}`;

            for (let iteration = 0; iteration < iterations; iteration++) {

                performance.mark(timerMark);

                const driver = await run(url, browserName);

                performance.measure(timerMark, timerMark);
                await driver.quit();
                bar.tick();
            }

            console.log("\tCompleted run for %s %s against %s", browserName, name, url);
            console.log(
                "\tAverage run time for %d runs: %d",
                results[timerMark].results.length,
                results[timerMark].average,
            );
        }
    }

    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    console.log("Results written to results.json");

})();
