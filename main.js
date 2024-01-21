const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')
const puppeteer = require('puppeteer');
const fs = require('fs');
const { TIMEOUT } = require('dns');


async function main(){
  if (process.argv.length < 3){
    console.log('no website provided')
  }
  if (process.argv.length > 3){
    console.log('too many arguments provided')
  }

  const browser = await puppeteer.launch({ headless: 'new', cookies: true, userDataDir: './user_data' });
  const page = await browser.newPage();
  let baseURL = process.argv[2]
  
  await page.goto(baseURL);
  await page.waitForTimeout(5000);

  const navigationPromise = page.waitForNavigation();


  require('dotenv').config();
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  await page.type('#userName', username);
  await page.type('#password-label', password);
  await page.focus('#password-label');

// Simulate Enter key press
  await page.keyboard.press('Enter');
  await page.screenshot({ path: 'screenshot.png' });
  await page.waitForResponse(response => response.url().includes('/login') && response.status() === 200);


  await page.screenshot({ path: 'screenshot2.png' });
// Check if login was successful by looking for a known element on the target page
  const isLoggedIn = await page.evaluate(() => {
    // Replace with a selector that is unique to the logged-in state
    const someElement = document.querySelector('jss17');
    return someElement !== null;
  });

  await page.screenshot({ path: 'screenshot3.png' });
  console.info(isLoggedIn ? "Logged in!" : "Failed to log in.");
  
  
  // Check for an element that exists on the /calendar page
  await page.screenshot({ path: 'screenshot4.png' });   
  baseURL = 'https://my-rsms.com/calendar';
  await page.goto(baseURL);
  console.info("On calendar page!");
  await page.goto(baseURL, { waitUntil: 'networkidle0' }); // Waits for network to be idle
  // Now query for the <p> elements
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
