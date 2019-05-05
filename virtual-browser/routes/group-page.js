const express = require('express');
const router = express.Router();
const chrome = require('../common/chrome');

const azRegex = /^[A-Za-z]/;

/**
 * text 文字
 * heightList 每页最大高度 如果超出下标则去最后一个下标值
 * html 网页
 * id = size 为计算高宽的element对象
 * id = content 为插入内容的element对象
 */
router.post('/', async (req, res, next) => {
    try {
        let data = [];
        let start = 0;
        let end = req.body.text.length;
        let mid = end - start;

        let pageIndex = 0;
        let pageHeight = req.body.heightList[pageIndex];
        let minimumDichotomy = false;

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
        while (true) {
            await page.addScriptTag({content: '(function(){document.getElementById("content").innerHTML = `' + req.body.text.substring(start, end) + '`})()'})
            const height = await page.$eval('#size', (el) => {
                return el.offsetHeight
            });
            // console.log(height + "-" + start + "-" + end);
            let _minimumDichotomy = false;
            if (!minimumDichotomy) {
                mid = Math.floor(mid / 2);
                if (mid === 0) {
                    mid = 1;
                    _minimumDichotomy = true;
                }
            }
            if (height <= pageHeight) {
                if (minimumDichotomy || end === req.body.text.length) {
                    if (end === req.body.text.length) {
                        data.push({
                            start: start,
                            end: end
                        });
                        break;
                    } else {
                        pageIndex++;
                        if (pageIndex < req.body.heightList.length) {
                            pageHeight = req.body.heightList[pageIndex];
                        }
                    }
                    //如果最后一个字符和前后都是字母则进行整个单词换行
                    if (azRegex.test(req.body.text.substring(end - 2, end + 1))) {
                        while (end-- > start) {
                            if (!azRegex.test(req.body.text.substring(end - 1, end))) {
                                break;
                            }
                        }
                    }
                    data.push({
                        start: start,
                        end: end
                    });
                    start = end;
                    end = req.body.text.length;
                    mid = end - start;
                    minimumDichotomy = false;
                    continue;
                } else {
                    end = end + mid;
                }
            } else {
                end = end - mid;
            }
            if (end > req.body.text.length) {
                end = req.body.text.length;
            } else if (end < start) {
                end = start;
            }
            if (_minimumDichotomy) {
                minimumDichotomy = true;
            }
        }

        await page.close();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).send('error');
    }
});

module.exports = router;
