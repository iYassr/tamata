import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Go to the deployed site
  await page.goto('https://tamata.pages.dev');
  await page.waitForTimeout(2000);

  // Take screenshot of main page
  await page.screenshot({ path: 'screenshot-main.png', fullPage: true });
  console.log('Main page screenshot saved');

  // Click on Sounds button
  const soundsBtn = page.locator('text=Sounds').first();
  if (await soundsBtn.isVisible()) {
    await soundsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-sounds.png', fullPage: true });
    console.log('Sounds panel screenshot saved');
  } else {
    console.log('Sounds button not found');
  }

  // Click on Stats button
  const statsBtn = page.locator('text=Stats').first();
  if (await statsBtn.isVisible()) {
    await statsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-stats.png', fullPage: true });
    console.log('Stats panel screenshot saved');
  } else {
    console.log('Stats button not found');
  }

  // Get console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });

  // Check for any visible error messages
  const bodyText = await page.textContent('body');
  console.log('\n--- Page content preview ---');
  console.log(bodyText?.substring(0, 500));

  await browser.close();
})();
