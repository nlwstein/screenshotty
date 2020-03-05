const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip != process.env.ALLOWED_IP) {
        return res.send('BAD_IP_ADDR');
    }
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
    })();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))