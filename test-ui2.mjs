import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push('Page error: ' + err.message);
  });

  // Go to the deployed site
  await page.goto('https://tamata.pages.dev');
  await page.waitForTimeout(3000);

  console.log('=== Console Errors ===');
  errors.forEach(e => console.log(e));

  // Click on Sounds button
  await page.click('text=Sounds');
  await page.waitForTimeout(1000);

  // Take full screenshot of sounds panel
  await page.screenshot({ path: 'screenshot-sounds-full.png', fullPage: true });

  // Try clicking a sound button
  const lightRain = page.locator('text=Light Rain');
  if (await lightRain.isVisible()) {
    console.log('Light Rain button found, clicking...');
    await lightRain.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshot-sounds-active.png', fullPage: true });
  }

  // Close the sheet by clicking outside or pressing escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Now click Stats
  await page.click('text=Stats');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-stats-full.png', fullPage: true });

  console.log('\n=== All Errors After Interactions ===');
  errors.forEach(e => console.log(e));

  if (errors.length === 0) {
    console.log('No console errors detected!');
  }

  await browser.close();
})();
