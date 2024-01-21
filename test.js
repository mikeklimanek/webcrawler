const puppeteer = require('puppeteer');
const fs = require('fs').promises;
require('dotenv').config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Step 1: Navigate to the general login page and login
  await page.goto('https://login.microsoftonline.com/');
  await page.waitForTimeout(5000);
  await page.focus('#i0116', { delay: 200 });
  await page.type('#i0116', username, { delay: 100 });
  await Promise.all([
    page.waitForNavigation(), // Waits for the next page to load
    page.click('#idSIButton9'), // Clicks the 'next' button
  ]);
  await page.waitForTimeout(5000);

  await page.waitForSelector('#i0118');
  await page.type('#i0118', password, { delay: 100 });
  // ... Perform the login steps here ...

  // Step 2: Save cookies after successful login
  //const cookies = await page.cookies();
  //await fs.writeFile('cookies.json', JSON.stringify(cookies, null, 2));

  // Step 3: Load cookies and navigate to the specific URL
  //const savedCookies = JSON.parse(await fs.readFile('cookies.json'));
  //await page.setCookie(...savedCookies);
  //await page.goto('your specific URL', { waitUntil: 'networkidle2' });
  
  // Additional logic here...

  // Optional: Close the browser
  // await browser.close();
})();
