import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '@components';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly header: HeaderComponent;
  readonly title: Locator;
  private readonly items: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByText('Products');
    this.items = page.getByTestId('inventory-item');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  private itemByName(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allTextContents();
  }
}
