import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });
});