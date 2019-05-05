const express = require('express');
const router = express.Router();
const chrome = require('../common/chrome');
const os = require('os');

router.get('/', async (req, res, next) => {
    try {
        const page = await chrome.getPage();
        let url = req.query.url;
        if (!url.toLowerCase().startsWith("http")) {
            if (!url.startsWith("/")) {
                url = "/" + url;
            }
            url = process.env.PDF_BASE_URL + url;
        }
        await page.goto(url);
        let nuxtError = false;
        try {
            nuxtError = await page.$eval('.__nuxt-error-page', e => e && e.innerHTML);
        } catch (e) {
        }
        if (nuxtError) {
            throw new Error("nuxt error");
        }
        const filePath = os.tmpdir() + "/" + Math.random().toString().replace(".", "") + ".pdf";
        await page.pdf({path: filePath, width: "21cm", height: "29.71cm", printBackground: true});
        await page.close();
        res.download(filePath);
    } catch (e) {
        console.error(e);
        res.status(500).send('error');
    }
});

module.exports = router;
