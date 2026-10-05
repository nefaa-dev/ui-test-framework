import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '@components';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly header: HeaderComponent;
  private readonly itemNameLabels: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.itemNameLabels = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async itemNames(): Promise<string[]> {
    return this.itemNameLabels.allTextContents();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
