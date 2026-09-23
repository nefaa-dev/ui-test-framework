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