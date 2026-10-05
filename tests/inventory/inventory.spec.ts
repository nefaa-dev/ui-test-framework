import { test, expect } from '@fixtures';

test.describe('Inventory', () => {
  test('authenticated user lands on the inventory directly', async ({ inventoryPage }) => {
    await inventoryPage.open();
    await expect(inventoryPage.title).toBeVisible();
  });

  test('a product can be added to the cart', async ({ inventoryPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');

    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });
});
