const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(2000);
  console.log('--- Before Click ---');
  console.log('registration-container display:', await page.$eval('#registration-container', el => window.getComputedStyle(el).display));
  console.log('landing-container display:', await page.$eval('#landing-container', el => window.getComputedStyle(el).display));
  
  await page.click('#start-btn');
  await page.waitForTimeout(3000);
  
  console.log('--- After Click ---');
  console.log('registration-container display:', await page.$eval('#registration-container', el => window.getComputedStyle(el).display));
  console.log('landing-container display:', await page.$eval('#landing-container', el => window.getComputedStyle(el).display));
  console.log('registration-container opacity:', await page.$eval('#registration-container', el => window.getComputedStyle(el).opacity));
  console.log('registration-container visibility:', await page.$eval('#registration-container', el => window.getComputedStyle(el).visibility));
  console.log('registration-container bounding box:', await page.$eval('#registration-container', el => JSON.stringify(el.getBoundingClientRect())));
  
  await browser.close();
})();
