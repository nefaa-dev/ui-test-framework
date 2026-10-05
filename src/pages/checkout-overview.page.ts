import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly total: Locator;
  private readonly finishButton: Locator;
  private readonly itemNameLabels: Locator;

  constructor(page: Page) {
    super(page);
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.itemNameLabels = page.getByTestId('inventory-item-name');
  }

  async itemNames(): Promise<string[]> {
    return this.itemNameLabels.allTextContents();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
