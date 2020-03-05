const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer')

app.get('/', (req, res) => {
    if (req.query.url == undefined) {
        return res.send({ error: "BAD_URL" });
    }
    var options = { url: req.query.url, size: { width: parseInt(req.query.width) || 1920, height: parseInt(req.query.height) || 1080 } };
    (async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport(options.size)
        await page.goto(options.url);
        await page.screenshot({ fullPage: true }).then((buffer) => {
            res.contentType('image/png')
            res.send(buffer);
        });
        await browser.close();
        // res.send('OK');
    })();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))