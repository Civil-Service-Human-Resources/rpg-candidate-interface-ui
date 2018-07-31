const selenium = require('selenium-webdriver');
const AxeBuilder = require('axe-webdriverjs');
// const util = require('util');
const jasmine = require('jasmine');

let driver;
let browser;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('Results Page', () => {
    beforeEach((done) => {
        driver = new selenium.Builder().forBrowser('chrome');
        browser = driver.build();
        browser.manage().timeouts().setScriptTimeout(60000);

        browser.get('http://test:test@localhost:3000/results?keyword=&location=').then(() => {
            browser.executeAsyncScript((callback) => {
                const script = document.createElement('script');
                script.innerHTML = 'document.documentElement.classList.add("deque-axe-is-ready");';
                document.documentElement.appendChild(script);
                callback();
            })
                .then(() => browser.wait(selenium.until.elementsLocated(selenium.By.css('.deque-axe-is-ready'))))
                .then(() => {
                    done();
                });
        });
    });

    afterEach((done) => {
        browser.quit().then(() => {
            done();
        });
    });

    it('should fetch the results page and analyze it', (done) => {
        browser.findElement(selenium.By.tagName('body'))
            .then(() => {
                AxeBuilder(browser).analyze((results) => {
                    if (results.violations.length > 0 || results.incomplete.length > 0) {
                        // console.error(util.inspect(results.violations, { showHidden: true, depth: 8 }));
                        // console.error(util.inspect(results.incomplete, { showHidden: true, depth: 8 }));
                    }
                    expect(results.violations.length).toBe(0);
                    expect(results.incomplete.length).toBe(0);
                    done();
                });
            });
    });
});
