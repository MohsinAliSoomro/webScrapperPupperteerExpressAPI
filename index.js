const express = require('express');
const puppeteer = require('puppeteer');
var cors = require('cors')
const app = express();
const URL = `https://www.barchart.com/options/unusual-activity/stocks`;
app.use(cors())
app.get('/getdata', function (req, res) {

    puppeteer.launch().then(async function (browser) {
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0)

        await page.goto(URL, { waitUntil: 'networkidle2' })
        const result = [];
        let elements = await page.$$('div[class="bc-table-scrollable-inner"]>ng-transclude >table > tbody>tr[class="odd"] ')
        for (element of elements) {
            let symbol = await element.$eval(('td[class="baseSymbol text-left"]'), node => node.innerText.trim());
            let price = await element.$eval(('td[class="baseLastPrice"]'), node => node.innerText.trim());
            let symbolType = await element.$eval(('td[class="symbolType"]'), node => node.innerText.trim());
            let strikeprice = await element.$eval(('td>div>span>span'), node => node.innerText.trim());
            let exp_date = await element.$eval(('td[class="expirationDate"]'), node => node.innerText.trim());
            let DTE = await element.$eval(('td[class="daysToExpiration"]'), node => node.innerText.trim());
            let bid = await element.$eval(('td[class="bidPrice"]'), node => node.innerText.trim());
            let midpoint = await element.$eval(('td[class="midpoint"]'), node => node.innerText.trim());
            let ask = await element.$eval(('td[class="askPrice"]'), node => node.innerText.trim());
            let last = await element.$eval(('td[class="lastPrice"]'), node => node.innerText.trim());
            let volume = await element.$eval(('td[class="volume"]'), node => node.innerText.trim());
            let openInt = await element.$eval(('td[class="openInterest"]'), node => node.innerText.trim());
            let VOI = await element.$eval(('td[class="volumeOpenInterestRatio"]'), node => node.innerText.trim());
            let IV = await element.$eval(('td[class="volatility"]'), node => node.innerText.trim());
            let lastTrade = await element.$eval(('td[class="tradeTime"]'), node => node.innerText.trim());

            result.push({
                symbol,
                price,
                symbolType,
                strikeprice,
                exp_date,
                DTE,
                bid,
                midpoint,
                ask,
                last,
                volume,
                openInt,
                VOI,
                IV,
                lastTrade,
            })

        }
        // console.log(result)
        await browser.close();
        res.send(result);
    })

})


app.listen(8000, () => console.log("app running on 8000 port"))






// const scrapper = require('./scraper');

// (async () => {
//     await scrapper.initialize('stocks');

//     let result = await scrapper.getResult();
//     console.log(result.map(item=>item.price))

// })();