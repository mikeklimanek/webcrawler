const puppeteer = require('puppeteer');
const fs = require('fs').promises;
require('dotenv').config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // pipe: true, <-- delete this property
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage', // <-- add this one
      ],
  });
  const page = await browser.newPage();

  // Step 1: Navigate to the general login page and login
  await page.goto('https://login.microsoftonline.com/');
  await page.waitForTimeout(5000);
  await page.focus('#i0116', { delay: 200 });
  await page.type('#i0116', username, { delay: 100 });
  await Promise.all([
    page.waitForNavigation(),
    page.click('#idSIButton9'), 
  ]);
  await page.waitForTimeout(5000);

  await page.waitForSelector('#i0118');
  await page.type('#i0118', password, { delay: 100 });

})();
