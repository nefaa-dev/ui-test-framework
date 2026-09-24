import { test as setup, expect } from '@fixtures';
import { config } from '@config';
import { STANDARD_STORAGE_STATE } from '@config/auth-storage';

setup('authenticate as standard user', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.loginAs(config.users.standard);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: STANDARD_STORAGE_STATE });
});