const express = require('express')
const puppeteer = require('puppeteer')
const cors = require('cors')

var port = process.env.PORT || 3000;

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var allowedIps = process.env.ALLOWED_IP.split(','); 
    if (!allowedIps.includes(ip) && ip != '::1') {
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
