import { test, expect } from '@playwright/test';

test('First test ', async ({ page }) => {
// await page.goto('https://google.com/');
// await expect(page).toHaveTitle('Google');
// Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
await page.goto('http://localhost:3000/nikkilam20020404/login');
await page.pause();
await page.locator('form').filter({ hasText: 'EmailPasswordForgot password?' }).locator('#email').fill('test@gmail.com')
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
