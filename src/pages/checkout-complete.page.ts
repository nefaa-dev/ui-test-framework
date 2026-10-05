import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';

  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
  }
}
