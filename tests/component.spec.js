// Writing this test in node and then bridging to the browser
// solely for mounting purposes
import { test, expect } from '@playwright/test';

test.describe('Counter component', () => {
  test('mounts with initial count and can be incremented/decremented', async ({ page }) => {
    await page.goto('/');
    
    // Mount the counter component with initial props
    await page.evaluate(() => {
      window.mountComponent('Counter', { initialCount: 5 });
    });
    
    // Check initial count
    await expect(page.locator('.count')).toHaveText('5');
    
    // Test increment
    await page.locator('.increment').click();
    await expect(page.locator('.count')).toHaveText('6');
    
    // Test decrement
    await page.locator('.decrement').click();
    await expect(page.locator('.count')).toHaveText('5');
  });
  
  test('can mount multiple times with different props', async ({ page }) => {
    await page.goto('/');
    
    // Mount with initial count 0
    await page.evaluate(() => {
      window.mountComponent('Counter', { initialCount: 0 });
    });
    await expect(page.locator('.count')).toHaveText('0');
    
    // Remount with different initial count
    await page.evaluate(() => {
      window.mountComponent('Counter', { initialCount: 10 });
    });
    await expect(page.locator('.count')).toHaveText('10');
  });
}); 
