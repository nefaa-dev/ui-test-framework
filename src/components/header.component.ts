import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async cartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return Number((await this.cartBadge.textContent()) ?? 0);
    }
    return 0;
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
