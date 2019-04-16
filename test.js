var list =['20-29-132-040-0000','10-15-423-003-0000','21-31-115-011-0000']

async function f(pin) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    try {
        console.log("started fetching page:Tax Delinquent:" + pin);

        const page = await browser.newPage();
        await page.goto('https://taxdelinquent.cookcountyclerk.com/');
        await page.waitForSelector('#Pin');
        await page.focus('#Pin');
        await page.keyboard.type(pin);
        await page.click('button');
        await page.waitForSelector('#Pin',{visible: true,timeout:500});
            console.log('filtered');
        //flag = false;
        await browser.close();

    } catch (error) {
        console.log("finished fetching page clerk Of Court" + pin);
        await browser.close();
    }

}

async function f1() {
    for (i = 0; i < 3; i++)
        await f(list[i])
}
f1().then(()=>(console.log("done")))

