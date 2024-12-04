import { test } from "../utils/fixtures/base";

test("Is accessible on all device types for admin user", async ({
  adminHomePage,
}) => {
  await adminHomePage.goto("/admin");
  await adminHomePage.e2eA11y();
});
