import { test, expect } from '@fixtures';

test.describe('Cart', () => {
  test('an added product appears in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.header.cartBadge).toHaveText('1');

    await inventoryPage.header.openCart();

    await expect(cartPage.header.cartBadge).toHaveText('1');
    expect(await cartPage.itemNames()).toContain('Sauce Labs Backpack');
  });
});