const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')
const puppeteer = require('puppeteer');
const fs = require('fs');
const { TIMEOUT } = require('dns');
require('dotenv').config();


async function main(){
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  if (process.argv.length < 3){
    console.log('no website provided')
  }
  if (process.argv.length > 3){
    console.log('too many arguments provided')
  }

  const browser = await puppeteer.launch({ headless: false, cookies: true, userDataDir: './user_data' });
  const page = await browser.newPage();
  let baseURL = process.argv[2]
  
  await page.goto(baseURL);
  await page.screenshot({ path: 'screenshot.png' });

  //////////////////////////
  const buttons = await page.$$('.MuiButton-label'); 

  let found = false;
  
  try {
    for (const button of buttons) {
      const label = await page.evaluate(el => el.textContent, button);
      console.log('Button label:', label); 
      if (label.includes('LOGIN by AZURE AD')) {
        console.log('Found and clicking the button');
        await button.click();
        found = true;
        break;
      }
    }
  
    if (!found) {
      console.error('Button not found');
      return;
    }
    console.log('Waiting for navigation after button click');
    await page.waitForNavigation({ timeout: 20000 });
  
    baseURL = page.url();
    console.log('Redirected to:', baseURL);
  
    console.log('Waiting for navigation after button click');
    baseURL = page.url();
    console.log('Redirected to:', baseURL);
    console.log('Navigation complete, taking screenshot');
    await page.screenshot({ path: 'after-click.png' });
    
  } catch (error) {
    console.error('Error during button click or navigation:', error);
  }
  
  //////////////////////////
  
  
  await page.waitForNavigation({ timeout: 20000 });
  await page.screenshot({ path: 'screenshot2.png' });
  await page.type('#loginfmt', username);
  await page.focus('#loginfmt');
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  
  await page.waitForTimeout(5000);
  await page.type('#passwd', password);
  await page.focus('#passwd');
  await page.screenshot({ path: 'screenshot3.png' });
  await page.keyboard.press('Enter');
  
  const navigationPromise = page.waitForNavigation();
  await page.waitForResponse(response => response.url().includes('/login') && response.status() === 200);

  await page.screenshot({ path: 'screenshot4.png' });   

  const isLoggedIn = await page.evaluate(() => {
    const someElement = document.querySelector('jss17');
    return someElement !== null;
  });

  console.info(isLoggedIn ? "Logged in!" : "Failed to log in.");
  
  
  baseURL = 'https://my-rsms.com/calendar';
  await page.goto(baseURL);
  console.info("On calendar page!");
  await page.goto(baseURL, { waitUntil: 'networkidle0' }); 

  const content = await page.evaluate(() => {
    const elements = document.querySelectorAll('p.MuiTypography-root.MuiTypography-body1.MuiTypography-colorPrimary.MuiTypography-alignCenter');
    return Array.from(elements).map(el => el.textContent.trim());
  });
  
  console.log(content);
    console.log(`starting crawl of: ${baseURL}...`)

  const pages = await crawlPage(baseURL, baseURL, {})

  printReport(pages)
}

main()