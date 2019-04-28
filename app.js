var express = require("express");
var path = require('path');
const fs = require('fs');


var app = express();

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));
var port = 8080;

var csvRoutes = require('./routes/csvUpload');
app.use('/csvupload', csvRoutes);

const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));

require('events').EventEmitter.prototype._maxListeners = 100;

const rimraf = require('rimraf');
rimraf('./public/Images/ClerkOfCourt/*', function () { console.log('Cleaning ClerkOf Court folder'); });
rimraf('./public/Images/CookCounty/*', function () { console.log('Cleaning Cook County folder'); });
rimraf('./public/Images/TaxDelinquent/*', function () { console.log('Cleaning Tax Delinquient  folder'); });
rimraf('./public/Images/RecorderOfDeeds/*', function () { console.log('Cleaning Tax Delinquient  folder'); });

var csvUpload = require('./routes/csvUpload');
app.use('/csvUpload', csvUpload);

app.get("/",function (req,res) {
  res.render("home.ejs");
});


//Cook County Scraper function
function cookCountyScrapper(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id){
  console.log("Inside Cook County Scrapper Function");
  const puppeteer = require('puppeteer');
  (async () => {
    try{
      console.log("started fetching page");
      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();
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
      await page.waitForSelector('#ContentPlaceHolder1_PropertyImage_propertyImage');
      await page.waitFor(1000);
      await page.screenshot({path: 'public/Images/CookCounty/'+id+'.png',fullPage: true });
      await browser.close();
      console.log("finished fetching page");
    }
    catch (error) {
      console.log(error);
    }


  })()
}
function clerkOfCourt(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id) {
  const puppeteer = require('puppeteer');
  (async () => {
    try{
      console.log("started fetching page:Clerk oF court");
      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();
      await page.goto('http://www.cookcountyclerkofcourt.org/countydivsearch/default.aspx');
      await page.click('#rblSearchType_ctl01');
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
      console.log("Error in recognizing");
    }

  })()
}
function TaxDelinquent(pinbox,id) {
  const puppeteer = require('puppeteer');
  (async () => {
    try {
      console.log("started fetching page:Tax Delinquent:"+pinbox+":"+id);
      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();
      await page.goto('https://taxdelinquent.cookcountyclerk.com/');
      await page.focus('#Pin');
      await page.keyboard.type(pinbox);
      await page.click('button');
      await page.waitFor(500);
      await page.screenshot({path: 'public/Images/TaxDelinquent/'+id+'.png',fullPage: true });
      await browser.close();
      console.log("finished fetching page clerk Of Court"+pinbox+":"+id);
    }
    catch (error) {
      //await page.screenshot({path: 'public/Images/TaxDelinquent/'+id+'.png',fullPage: true });
      //await browser.close();
      console.log("Error in recognizing");
    }
  })()
}
function RecorderOfDeeds(pinbox1,pinbox2,pinbox3,pinbox4,pinbox5,id) {
  const puppeteer = require('puppeteer');
  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    try{
      console.log("started fetching page");
      const page = await browser.newPage();
      await page.goto('http://162.217.184.82/i2/default.aspx');
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(pinbox2);
      await page.waitForSelector('#SearchFormEx1_PINTextBox0');
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
    }catch (e) {
      await browser.close();
    }

  })()
}

app.get("/search",function (req,res) {
  var flag = false;
  propertyId= req.query.searchbox;
  propertyId=propertyId.trim();
  console.log("PropertyId is:"+propertyId);
  var pinBox = propertyId.split(" ");
  if(pinBox.length!=5)
    res.render("home.ejs");
  try {
      if (!fs.existsSync("public/Images/CookCounty/"+propertyId+".png")) {
        cookCountyScrapper(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
      }
      if (!fs.existsSync("public/Images/CookCounty/"+propertyId+".png")) {

        clerkOfCourt(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
      }
      if (!fs.existsSync("public/Images/RecorderOfDeeds/"+propertyId+".png")) {

        RecorderOfDeeds(pinBox[0].trim(),pinBox[1].trim(),pinBox[2].trim(),pinBox[3].trim(),pinBox[4].trim(),propertyId);
      }
      if (!fs.existsSync( "public/Images/TaxDelinquent/"+propertyId+".png")) {

        TaxDelinquent(propertyId,propertyId) ;
      }
    } catch(err) {
      console.error(err)
    }


  (async ()=>{
    let url1 = "/Images/ClerkOfCourt/"+propertyId+".png";
    console.log(url1);
    let url2 = "/Images/CookCounty/"+propertyId+".png";
    let url3 = "/Images/RecorderOfDeeds/"+propertyId+".png";
    let url4 = "/Images/TaxDelinquent/"+propertyId+".png";
    if(flag==true)
      await new Promise(resolve => setTimeout(resolve, 5000));
    res.render("response.ejs",{"url1": url1, "url2": url2, "url3": url3, "url4": url4});
  })();
});
coordinates = [];
async function checkProfitable(jsonObj) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  try {
    console.log("started fetching page:Tax Delinquent:" + jsonObj['Property Identification Number']);
    const page = await browser.newPage();
    await page.goto('https://taxdelinquent.cookcountyclerk.com/');
    await page.waitForSelector('#Pin');
    await page.focus('#Pin');
    await page.keyboard.type(jsonObj['Property Identification Number']);
    await page.click('button');
    await page.waitForSelector('#Pin',{visible: true,timeout:500});
    console.log('filtered');
    await browser.close();

  } catch (error) {
            console.log("finished fetching page clerk Of Court" + jsonObj['Property Identification Number']);
            await browser.close();
            if (jsonObj.Latitude == '' || jsonObj.Longitude == '') {
              var NodeGeocoder = require('node-geocoder');
              var options = {
                provider: 'google',
                // Optional depending on the providers
                httpAdapter: 'https', // Default
                apiKey: 'AIzaSyBFf18v1TUapIPxyTkgTbybjgK672hwt-s', // for Mapquest, OpenCage, Google Premier
                formatter: null         // 'gpx', 'string', ...
              };
              var geocoder = NodeGeocoder(options);
              console.log(jsonObj['Property Address']+' '+jsonObj['Property City']);
              geocoder.geocode(jsonObj['Property Address']+' '+jsonObj['Property City'])
                  .then(function (res) {
                    console.log("Reverse geocoded", res[0].latitude,res[0].longitude);
                    coordinates.push(res[0].latitude);
                    coordinates.push(res[0].longitude);
                    coordinates.push("**");
                    coordinates.push(jsonObj['RIS Input Date']);
                    coordinates.push(jsonObj['Property Identification Number']);
                    coordinates.push(jsonObj['Deed Number']);
                    coordinates.push(jsonObj['Redemption Exp Date']);
                      coordinates.push(jsonObj['Respondent First Name 1']);
                      coordinates.push(jsonObj['Respondent Last Name 1']);
                      coordinates.push(jsonObj['Respondent First Name 2']);
                      coordinates.push(jsonObj['Respondent Last Name 2']);
                      coordinates.push(jsonObj['Property Address']);
                      coordinates.push(jsonObj['Property City']);
                      coordinates.push(jsonObj['Property State']);
                      coordinates.push(jsonObj['Property Zip Code']);
                      coordinates.push(jsonObj['Property Type']);
                      coordinates.push(jsonObj['Tax Year Owed']);
                      coordinates.push(jsonObj['County FIPS']);
                      coordinates.push(jsonObj['Date of Sale']);
                      coordinates.push(jsonObj['Lien Amount'].replace(',',':'));
                      coordinates.push(jsonObj['Multiple Listing Service']);
                      coordinates.push(jsonObj['Mail To First Name']);
                      coordinates.push(jsonObj['Mail To Last Name']);
                      coordinates.push(jsonObj['Mail To Address']);
                      coordinates.push(jsonObj['Mail To State']);
                      coordinates.push(jsonObj['Mail To Zip']);
                      coordinates.push(jsonObj['Mail To Phone']);
                      coordinates.push(jsonObj['First Name Purchaser']);
                      coordinates.push(jsonObj['Do Not Call']);
                      coordinates.push("xx");
                  })
                  .catch(function (err) {
                    console.log(err);
                  });


            }
            else {
                console.log("Excel sheet", jsonObj.Latitude,jsonObj.Longitude);
                coordinates.push(jsonObj.Longitude);
                coordinates.push(jsonObj.Latitude);
                coordinates.push("**");
                coordinates.push(jsonObj['RIS Input Date']);
                coordinates.push(jsonObj['Property Identification Number']);
                coordinates.push(jsonObj['Deed Number']);
                coordinates.push(jsonObj['Redemption Exp Date']);
                coordinates.push(jsonObj['Respondent First Name 1']);
                coordinates.push(jsonObj['Respondent Last Name 1']);
                coordinates.push(jsonObj['Respondent First Name 2']);
                coordinates.push(jsonObj['Respondent Last Name 2']);
                coordinates.push(jsonObj['Property Address']);
                coordinates.push(jsonObj['Property City']);
                coordinates.push(jsonObj['Property State']);
                coordinates.push(jsonObj['Property Zip Code']);
                coordinates.push(jsonObj['Property Type']);
                coordinates.push(jsonObj['Tax Year Owed']);
                coordinates.push(jsonObj['County FIPS']);
                coordinates.push(jsonObj['Date of Sale']);
                coordinates.push(jsonObj['Lien Amount'].replace(',',':'));
                coordinates.push(jsonObj['Multiple Listing Service']);
                coordinates.push(jsonObj['Mail To First Name']);
                coordinates.push(jsonObj['Mail To Last Name']);
                coordinates.push(jsonObj['Mail To Address']);
                coordinates.push(jsonObj['Mail To State']);
                coordinates.push(jsonObj['Mail To Zip']);
                coordinates.push(jsonObj['Mail To Phone']);
                coordinates.push(jsonObj['First Name Purchaser']);
                coordinates.push(jsonObj['Do Not Call']);
                coordinates.push("xx")
            }
  }

}

app.post("/map",function (req,res) {
  var parsedData = req.files.file["data"].toString('utf8');
  var lat=[],long=[];
  var flag;
  const csv=require('csvtojson');
  jsondata=csv({
    header:true,

  })
      .fromString(parsedData)
      .then(async (jsonObj) => {
            console.log(jsonObj.length);

            for (let i = 0; i < jsonObj.length; i++) {
                await checkProfitable(jsonObj[i]);
            }
          }
      ).then(()=>{
          var propertyDetails;
          propertyDetails = coordinates;
          res.render("ViewMap.ejs", {x: coordinates})})

});

app.post("/scrape",function (req,res) {
  console.log("checking");
  propertyId = req.body;
  console.log(propertyId);


});
var server =app.listen(port,function () {

  console.log("Sever started")
});
//
//server.close();
module.exports = app;


