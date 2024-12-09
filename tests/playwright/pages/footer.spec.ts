import { test, expect } from "../utils/fixtures/base";

test.describe("Global footer tests", () => {
  test("Footer help link  navigates to /help", async ({
    helpPage,
    stateHomePage,
  }) => {
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.contactUsLink.click();
    await helpPage.isReady();
    await expect(helpPage.title).toBeVisible();
  });

  test("Footer accessibility statement link navigates to the right external URL", async ({
    stateHomePage,
  }) => {
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.accessibilityStatementLink.click();
    const page = stateHomePage.page;
    expect(page.url()).toBe(
      "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
    );
  });
});
