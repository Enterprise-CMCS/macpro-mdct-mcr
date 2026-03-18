import { expect, test } from "./fixtures/base";
import { checkAccessibilityAcrossViewports } from "../utils/a11y";

test("Is accessible on all device types for state user @a11y", async ({
  statePage,
}) => {
  const accessibilityResults = await checkAccessibilityAcrossViewports(
    statePage.page,
    "/help"
  );
  expect(accessibilityResults).toEqual([]);
});

test("Is accessible on all device types for admin user @a11y", async ({
  adminPage,
}) => {
  const accessibilityResults = await checkAccessibilityAcrossViewports(
    adminPage.page,
    "/help"
  );
  expect(accessibilityResults).toEqual([]);
});
