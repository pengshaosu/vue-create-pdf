const puppeteer = require('puppeteer');

let browser;
let browserTimer;
const timeoutTime = 1000 * 60 * 12;

class Chrome {
    async getBrowser() {
        if (!browser) {
            browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        } else {
            clearTimeout(browserTimer);
        }
        browserTimer = setTimeout(async () => {
            const _browser = browser;
            browser = null;
            await _browser.close();
        }, timeoutTime);
        return browser;
    }


    async getPage() {
        const browser = await this.getBrowser();
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(600000);
        return page;
    }
}

module.exports = new Chrome();