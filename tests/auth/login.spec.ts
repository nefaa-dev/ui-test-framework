import { test, expect } from '@fixtures';
import { config } from '@config';

test.describe('Login', () => {
  test('standard user can log in', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.loginAs(config.users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });
});

test('locked-out user is blocked with an error', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.loginAs(config.users.lockedOut);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });