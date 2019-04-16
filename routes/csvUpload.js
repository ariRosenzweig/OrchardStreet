let express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
var propertyIds = [];
const fs = require('fs');



router.use(bodyParser.urlencoded({ extended: false }));
function replaceAllBackSlash(targetStr){
    var index=targetStr.indexOf("\\");
    while(index >= 0){
        targetStr=targetStr.replace("\\","");
        index=targetStr.indexOf("\\");
    }
    return targetStr;
}


//Cook County Scraper function
function cookCountyScrapper(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id){
    console.log("Inside Cook County Scrapper Function");
    const puppeteer = require('puppeteer');
    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        try{
            console.log("started fetching page");

            await page.goto('http://www.cookcountypropertyinfo.com/');
            await page.focus('#pinBox1');
            await page.keyboard.type(pinbox1);
            await page.focus('#pinBox2');
            await page.keyboard.type(pinbox2);
            await page.focus('#pinBox3');
            await page.keyboard.type(pinbox3);
            await page.focus('#pinBox4');
            await page.keyboard.type(pinbox4);
            await page.focus('#pinBox5');
            await page.keyboard.type(pinbox5);
            await page.click('#ContentPlaceHolder1_PINAddressSearch_btnSearch');
            await page.waitForSelector('#ContentPlaceHolder1_PropertyImage_propertyImage',{timeout:1000});
            await page.waitFor(1000);
            await page.screenshot({path: 'public/Images/CookCounty/'+id+'.png',fullPage: true });
            await browser.close();
            console.log("finished fetching page");

        }
        catch (error) {
            await page.waitFor(1000);
            await page.screenshot({path: 'public/Images/CookCounty/'+id+'.png',fullPage: true });
            await browser.close();
            console.log(error);

        }


    })()
}
function clerkOfCourt(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id) {
    const puppeteer = require('puppeteer');
    (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox']});
            const page = await browser.newPage();
         try{
            console.log("started fetching page:Clerk oF court");
            await page.goto('http://www.cookcountyclerkofcourt.org/countydivsearch/default.aspx');
            await page.click('#rblSearchType_ctl01',{timeout: 700});
            await page.waitForSelector('#txtPin1');
            await page.focus('#txtPin1');
            await page.keyboard.type(pinbox1);
            await page.focus('#txtPin2');
            await page.keyboard.type(pinbox2);
            await page.focus('#txtPin3');
            await page.keyboard.type(pinbox3);
            await page.focus('#txtPin4');
            await page.keyboard.type(pinbox4);
            await page.focus('#txtPin5');
            await page.keyboard.type(pinbox5);
            await page.click('#btnSearch');
            await page.waitForSelector('#btnSearchAgain');
            await page.screenshot({path: 'public/Images/ClerkOfCourt/' + id + '.png', fullPage: true});
            await browser.close();
            console.log("finished fetching page clerk Of Court");
        }
        catch (error) {
            await page.screenshot({path: 'public/Images/ClerkOfCourt/' + id + '.png', fullPage: true});
            await browser.close();
            console.log("Error in recognizing");

        }



    })()
}
function TaxDelinquent(pinbox,id) {
    const puppeteer = require('puppeteer');
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        try {
            console.log("started fetching page:Tax Delinquent:"+pinbox+":"+id);
            await page.goto('https://taxdelinquent.cookcountyclerk.com/');
            await page.focus('#Pin');
            await page.keyboard.type(pinbox);
            await page.click('button');
            await page.waitFor(100);
            await page.waitForSelector('#Pin',{visible: true,timeout:1500});
            await page.waitFor(100);
            await page.screenshot({path: 'public/Images/TaxDelinquent/'+id+'.png',fullPage: true });
            await browser.close();
            console.log("finished fetching page clerk Of Court"+pinbox+":"+id);
        }
        catch (error) {
            await page.screenshot({path: 'public/Images/TaxDelinquent/'+id+'.png',fullPage: true });
            await browser.close();
            console.log("finished fetching page clerk Of Court"+pinbox+":"+id);
        }


    })()
}
function RecorderOfDeeds(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id) {
    console.log("Inside recorder of deeds");
    const puppeteer = require('puppeteer');
    (async () => {
        const browser = await puppeteer.launch();
        await new Promise(resolve => setTimeout(resolve, 800));
        const page = await browser.newPage();
        try{
            console.log("started fetching page");
            await page.goto('http://162.217.184.82/i2/default.aspx');
            await page.waitFor(3000);
            console.log(pinbox2);
            await page.waitForSelector('#SearchFormEx1_PINTextBox0',{timeout:1000});
            await page.focus('#SearchFormEx1_PINTextBox0');
            await page.keyboard.type(pinbox1);
            await page.waitFor(10);
            await page.focus('#SearchFormEx1_PINTextBox1');
            await page.keyboard.type(pinbox2);
            await page.waitFor(10);
            await page.focus('#SearchFormEx1_PINTextBox2');
            await page.keyboard.type(pinbox3);
            await page.waitFor(10);
            await page.focus('#SearchFormEx1_PINTextBox3');
            await page.keyboard.type(pinbox4 );
            await page.waitFor(10);
            await page.focus('#SearchFormEx1_PINTextBox4');
            await page.keyboard.type(pinbox5);
            await page.click('#SearchFormEx1_btnSearch');
            await page.waitFor(2000);
            await page.screenshot({path: 'public/Images/RecorderOfDeeds/'+id+'.png' });
            await browser.close();
            console.log("finished fetching page Recorder of Deeds" );
        }
        catch (error) {
            await page.screenshot({path: 'public/Images/RecorderOfDeeds/'+id+'.png',fullPage: true });
            await browser.close();
            console.log("Error in recognizing");
        }

    })()
}


async function processData(propertyId,i) {

    console.log("Property ID:csvUpload function" + i);
    pinBox = propertyId.split('\t');
    console.log(pinBox);
    if (pinBox.length != 5)
        pinBox = propertyId.split(' ');
    if (pinBox.length != 5)
        pinBox = propertyId.split('-');
    if (pinBox.length != 5)
        return;
    try {
            cookCountyScrapper(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
            await new Promise(resolve => setTimeout(resolve, 800));
            clerkOfCourt(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
            await new Promise(resolve => setTimeout(resolve, 900));
        //     RecorderOfDeeds(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
        //     await new Promise(resolve => setTimeout(resolve, 900));
            TaxDelinquent(propertyId,propertyId) ;
    } catch(err) {
        console.error(err)
    }
    console.log("next");

}
// Main Controller function
async function mainControllerScrapper(propertyIds,res) {
    console.log("Inside Main Controller  Controller function");
    var pinBox = []; //used to save splitted pin numbers
    var i = 0;
    var loop = function(propertyIds, i, processData) {
        console.log("Inside Loop");
        processData(propertyIds[i].replace('{','').replace('}','').trim(), i).then(async function () {
            console.log("After Process data");
            if (++i < propertyIds.length) {
                if (i % 15 == 0){
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
                loop(propertyIds, i, processData);
            } else {
                await new Promise(resolve => setTimeout(resolve, 9000));
                console.log("done");
                res.send("Completed Scrapping");
            }
        });
    };
    loop(propertyIds, 0, processData)
}
router.post("/renderresposnsepage",function (req,res) {
    let url1 = "/Images/ClerkOfCourt/"+propertyIds[0]+".png";
    console.log(url1);
    let url2 = "/Images/CookCounty/"+propertyIds[0]+".png";
    let url3 = "/Images/RecorderOfDeeds/"+propertyIds[0]+".png";
    let url4 = "/Images/TaxDelinquent/"+propertyIds[0]+".png";
    res.render("response.ejs",{"url1": url1, "url2": url2, "url3": url3, "url4": url4});
});
router.post("/search",function (req,res) {
    console.log("search");
    var temp = JSON.stringify(req.body).replace('[',' ');
    temp = temp.replace('[','');
    temp = temp.replace(':\"','');
    temp = temp.replace(']','');
    var find = '\"';
    var re = new RegExp(find, 'g');
    temp = temp.replace(re, '');
    temp = replaceAllBackSlash(temp);
    propertyIds = temp.split(',');
    var clerkOfCourtImages = [];
    var cookCountyImages = [];
    var recorderOfDeedsImages = [];
    var taxDelinquentImages = [];
    console.log(propertyIds.length);
    mainControllerScrapper(propertyIds,res);


});
router.post("/map", function (req, res) {
    console.log("map");
    var temp = JSON.stringify(req.body).replace('[', ' ');
    console.log(temp);
    temp = temp.replace('[', '');
    temp = temp.replace(':\"', '');
    temp = temp.replace(']', '');
    var find = '\"';
    var re = new RegExp(find, 'g');
    temp = temp.replace(re, '');
    temp = replaceAllBackSlash(temp);
    temp = temp.replace('{','');
    temp = temp.replace('}','');
    dtls = temp.split("$$$");

    propertyIds = dtls[0].split(',');
    (async () => {
        for (var i = 0; i < propertyIds.length; i++) {
            if (i % 5 == 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (propertyIds[i].trim() != "0") {
                console.log(propertyIds[i]);
                await cookCountyScrapper(propertyIds[i].substring(0, 2), propertyIds[i].substring(2, 4), propertyIds[i].substring(4, 7),
                    propertyIds[i].substring(7, 10), propertyIds[i].substring(10, 14), propertyIds[i]);
                await new Promise(resolve => setTimeout(resolve, 800));
                await clerkOfCourt(propertyIds[i].substring(0, 2), propertyIds[i].substring(2, 4), propertyIds[i].substring(4, 7),
                    propertyIds[i].substring(7, 10), propertyIds[i].substring(10, 14), propertyIds[i]);
                await new Promise(resolve => setTimeout(resolve, 800));
                await TaxDelinquent(propertyIds[i], propertyIds[i]);
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    })()
        .then(() => {
        console.log("Done Scrapping");
       // res.redirect(200,"displayMapWithImages",{"x":dtls[1]});
          //  res.send("test");
    });
});
module.exports = router;