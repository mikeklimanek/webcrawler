const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set up event listeners before the navigation
    page.on('response', response => {
        console.log(`URL: ${response.url()}, Status code: ${response.status()}`);
    });

    page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
            console.log(`Main frame navigated to: ${frame.url()}`);
        }
    });

    try {
        // Navigate to the URL
        const response = await page.goto('https://login.microsoftonline.com/44d8f853-d5f5-44e2-9919-531d4e92e1af/oauth2/v2.0/authorize?client_id=d970d791-6cf7-43e9-a1e4-ac2182ca647c&scope=user.read%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fmy-rsms.com%2F&client-request-id=313e7ce6-1d59-4a59-96dc-42995aa99507&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.16.0&x-client-OS=&x-client-CPU=&client_info=1&code_challenge=E5aFd8g8xxCQuu7B-5I_9lGo6_1cmgbxgMW0pfWI488&code_challenge_method=S256&nonce=e8bd910e-10a6-4a0d-a06b-1c0df25e0ed8&state=eyJpZCI6IjRiNmUwOWNkLTE4ZjUtNDk2YS1iMDhmLTIzNjUxNDk3YzAzNSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D', {
            waitUntil: 'networkidle0'
        });

        // Wait for a specific amount of time, if necessary
        // await page.waitForTimeout(5000);

        // Take a screenshot for debug purposes
        await page.screenshot({ path: 'result.png' });
        if (response) {
            console.log(`${response.status()} ${response.statusText()} - no error detected`);
        }
    } catch (error) {
        console.log(error);
    }
    

    page.on('close', () => {
        console.log('Page closed!');
      });
      

})();