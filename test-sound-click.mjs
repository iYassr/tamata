import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push('Page error: ' + err.message);
  });

  await page.goto('https://1559bb24.tamata.pages.dev');
  await page.waitForTimeout(2000);

  // Click on Sounds button
  await page.click('text=Sounds');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'test-before-click.png' });
  console.log('Before click screenshot saved');

  // On desktop (1280px), the aside panel should be visible
  // Look for the Light Rain text in the desktop panel
  const lightRainBtn = page.locator('text=Light Rain').first();
  const isVisible = await lightRainBtn.isVisible();
  console.log(`Light Rain button visible: ${isVisible}`);

  if (isVisible) {
    // Get parent div with cursor-pointer
    console.log('Clicking Light Rain...');
    await lightRainBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-after-click.png' });
    console.log('After click screenshot saved');

    // Check status text
    const pageText = await page.textContent('body');
    if (pageText?.includes('1 sound playing')) {
      console.log('SUCCESS: Sound is now playing!');
    } else if (pageText?.includes('No sounds active')) {
      console.log('ISSUE: Sound did not activate');
    }
  } else {
    console.log('Light Rain not visible, checking page structure...');
    const asideExists = await page.locator('aside').count();
    console.log(`Aside elements: ${asideExists}`);

    const motionAsideExists = await page.locator('motion.aside, [style*="transform"]').count();
    console.log(`Motion aside elements: ${motionAsideExists}`);
  }

  console.log('\n=== Console Errors ===');
  if (errors.length > 0) {
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('No errors!');
  }

  await browser.close();
})();
