import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";
import { a11yTags, a11yViewports } from "./consts";

export async function checkAccessibilityAcrossViewports(
  page: Page,
  url: string
) {
  await page.goto(url);
  const accessibilityResults: any[] = [];

  for (const [device, viewport] of Object.entries(a11yViewports)) {
    await page.setViewportSize(viewport);
    await page.locator("h1").first().waitFor({ state: "visible" });

    const axeBuilder = new AxeBuilder({ page })
      .withTags(a11yTags)
      .disableRules(["duplicate-id"]);

    const results = await axeBuilder.analyze();

    if (results.violations.length > 0) {
      accessibilityResults.push({
        device,
        viewport,
        violations: results.violations,
      });
    }
  }

  return accessibilityResults;
}
