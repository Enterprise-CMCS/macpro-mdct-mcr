import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForResponse(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    status: number
  ) {
    try {
      return await this.page.waitForResponse(
        (response) =>
          response.url().includes(endpoint) &&
          response.request().method() === method &&
          response.status() === status
      );
    } catch (error) {
      console.error(
        `Failed to find ${method} ${endpoint} with status ${status}`
      );
      throw error;
    }
  }
}
