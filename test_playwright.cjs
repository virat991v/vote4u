const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  console.log('--- Before Click ---');
  console.log('registration-container display:', await page.$eval('#registration-container', el => window.getComputedStyle(el).display));
  console.log('landing-container display:', await page.$eval('#landing-container', el => window.getComputedStyle(el).display));
  
  await page.click('#start-btn');
  await page.waitForTimeout(1500);
  
  console.log('--- After Start Click ---');
  await page.waitForTimeout(1500); // Wait for animations
  
  console.log('registration bounding box:', await page.$eval('#registration-container', el => JSON.stringify(el.getBoundingClientRect())));
  console.log('ai-assistant bounding box:', await page.$eval('#ai-assistant-container', el => JSON.stringify(el.getBoundingClientRect())));
  
  await page.fill('#voter-name', 'Test User');
  await page.fill('#voter-age', '25');
  await page.click('#register-btn');
  await page.waitForTimeout(1500);
  
  console.log('--- After Registration ---');
  await page.click('.candidate-btn[data-id="candidate-1"]');
  await page.waitForTimeout(500);
  await page.click('#cast-vote-btn');
  await page.waitForTimeout(3000); // wait for encryption and transition
  
  console.log('--- After Vote ---');
  console.log('results-container display:', await page.$eval('#results-container', el => window.getComputedStyle(el).display));
  
  await browser.close();
})();
