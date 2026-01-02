import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Test mobile viewport
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 } // iPhone 14 size
  });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push('Page error: ' + err.message);
  });

  await page.goto('https://tamata.pages.dev');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-mobile-main.png' });
  console.log('Mobile main screenshot saved');

  // Click sounds (mobile might only show icon)
  const soundsBtn = page.getByRole('button').filter({ has: page.locator('svg') }).first();
  await page.click('[data-slot="toggle-group-item"]:first-child');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-mobile-sounds.png' });
  console.log('Mobile sounds screenshot saved');

  // Close and try stats
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Click second toggle item (stats)
  const toggleItems = page.locator('[data-slot="toggle-group-item"]');
  const count = await toggleItems.count();
  console.log(`Found ${count} toggle items`);

  if (count >= 2) {
    await toggleItems.nth(1).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-mobile-stats.png' });
    console.log('Mobile stats screenshot saved');
  }

  console.log('\n=== Console Errors ===');
  if (errors.length > 0) {
    errors.forEach(e => console.log(e));
  } else {
    console.log('No errors!');
  }

  await browser.close();
})();
