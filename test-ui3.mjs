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

  console.log('=== Initial Console Errors ===');
  if (errors.length > 0) {
    errors.forEach(e => console.log(e));
  } else {
    console.log('None');
  }

  // Click on Sounds button
  await page.click('text=Sounds');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot-sounds-panel.png', fullPage: true });
  console.log('Sounds panel screenshot saved');

  // Close by pressing escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Now click Stats
  await page.click('text=Stats');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot-stats-panel.png', fullPage: true });
  console.log('Stats panel screenshot saved');

  console.log('\n=== All Console Errors ===');
  if (errors.length > 0) {
    errors.forEach(e => console.log(e));
  } else {
    console.log('No console errors detected!');
  }

  // Check what elements are visible
  console.log('\n=== Checking Elements ===');

  // Check if sound grid items are visible
  const soundItems = await page.locator('[class*="aspect-square"]').count();
  console.log(`Sound grid items found: ${soundItems}`);

  // Check stats elements
  const statsVisible = await page.locator('text=Today').isVisible();
  console.log(`Stats "Today" visible: ${statsVisible}`);

  await browser.close();
})();
