import { expect, test } from "./fixtures/base";
import { stateName } from "../utils";

let currentDate = "";
let programName = "";
let updatedProgramName = "";

test.beforeAll(async () => {
  currentDate = new Date().toISOString();
  programName = `automated test - ${currentDate}`;
  updatedProgramName = `Updated: ${programName}`;
});

test.describe("MCPAR Dashboard Page - Program Creation/Editing/Archiving @flaky", () => {
  test("State users can create and edit reports", async ({ statePage }) => {
    await statePage.goto("/");

    await statePage.page
      .getByRole("button", { name: "Enter MCPAR online" })
      .isVisible();
    await statePage.goToMCPAR();
    await statePage.redirectPage("/mcpar/get-started");

    await statePage.page
      .getByRole("button", { name: "Enter MCPAR online" })
      .isVisible();
    await statePage.enterMCPARFromGetStarted();
    await statePage.redirectPage("/mcpar");

    const table = statePage.page.getByRole("table");
    const originalRow = table.getByRole("row", {
      name: programName,
    });
    const updatedRow = table.getByRole("row", {
      name: updatedProgramName,
    });

    // Create MCPAR
    await statePage.createMCPAR(programName);
    await expect(originalRow).toBeVisible();
    await expect(updatedRow).toBeHidden();

    // Update MCPAR
    await statePage.updateMCPAR(programName, updatedProgramName);
    await expect(originalRow).toBeHidden();
    await expect(updatedRow).toBeVisible();
  });

  test("Admin users can archive/unarchive reports", async ({ adminPage }) => {
    await adminPage.archiveMCPAR(stateName, updatedProgramName);
    await adminPage.unarchiveMCPAR(stateName, updatedProgramName);
  });

  test("State users can't see archived programs", async ({
    adminPage,
    statePage,
  }) => {
    await adminPage.archiveMCPAR(stateName, updatedProgramName);

    await statePage.goto("/mcpar");
    const table = statePage.page.getByRole("table");
    await table.isVisible();
    await expect(
      table.getByRole("row", { name: updatedProgramName })
    ).toBeHidden();
  });
});
