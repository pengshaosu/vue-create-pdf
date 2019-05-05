const express = require('express');
const router = express.Router();
const chrome = require('../common/chrome');


/**
 * text 文字
 * html 网页
 * id = size 为计算高宽的element对象
 * id = content 为插入内容的element对象
 * return 实际高宽
 */
router.post('/', async (req, res, next) => {
    try {
        const page = await chrome.getPage();
        await page.setContent(req.body.html);
        let nuxtError = false;
        try {
            nuxtError = await page.$eval('.__nuxt-error-page', e => e && e.innerHTML);
        } catch (e) {
        }
        if (nuxtError) {
            throw new Error("nuxt error");
        }
        if (req.body.content) {
            await page.addScriptTag({content: '(function(){document.getElementById("content").innerHTML = `' + req.body.text + '`})()'})
        } else {
            await page.addScriptTag({content: '(function(){document.getElementById("size").innerHTML = `' + req.body.text + '`})()'})
        }
        const data = await page.$eval('#size', (el) => {
            return {
                height: el.offsetHeight,
                width: el.offsetWidth
            };
        });
        await page.close()
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).send('error');
    }
});

module.exports = router;
