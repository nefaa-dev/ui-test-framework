import { test, expect } from '@fixtures';
import { aCheckoutInfo } from '@builders';

test.describe('Checkout', { tag: '@smoke' },  () => {
  test('a user can complete a purchase end to end', { tag: '@regression' }, async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();

    await cartPage.proceedToCheckout();

    await checkoutInfoPage.fillInformation(aCheckoutInfo().build());
    await checkoutInfoPage.continueToOverview();

    await expect(checkoutOverviewPage.total).toContainText('Total:');
    await checkoutOverviewPage.finish();

    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout requires customer information', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.continueToOverview(); // submit with empty fields

    await expect(checkoutInfoPage.errorMessage).toContainText('First Name is required');
  });
});
