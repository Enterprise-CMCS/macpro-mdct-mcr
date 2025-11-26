import { test, expect } from "./fixtures/base";

test.describe("Global footer tests - State user", () => {
  test("Footer help link navigates to /help", async ({ statePage }) => {
    await statePage.goto("/");
    await statePage.page.getByRole("link", { name: "Contact Us" }).click();
    await expect(
      statePage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });

  test("Footer accessibility statement link navigates to the right external URL", async ({
    statePage,
  }) => {
    await statePage.goto("/");
    await expect(
      statePage.page.getByRole("link", { name: "Accessibility Statement" })
    ).toHaveAttribute(
      "href",
      "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
    );
  });
});

test.describe("Global footer tests - Admin user", () => {
  test("Footer help link navigates to /help", async ({ adminPage }) => {
    await adminPage.goto("/");
    await adminPage.page.getByRole("link", { name: "Contact Us" }).click();
    await expect(
      adminPage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });

  test("Footer accessibility statement link navigates to the right external URL", async ({
    adminPage,
  }) => {
    await adminPage.goto("/");
    await expect(
      adminPage.page.getByRole("link", { name: "Accessibility Statement" })
    ).toHaveAttribute(
      "href",
      "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
    );
  });
});
