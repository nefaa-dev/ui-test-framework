import { Page } from '@playwright/test';

export abstract class BasePage {
  /** Path relative to baseURL, e.g. '/', '/inventory.html'. */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }
}
