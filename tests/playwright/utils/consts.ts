import { Banner } from "./types";

export const adminUser = process.env.TEST_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.TEST_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const adminUserHeading = "View State/Territory Reports";
export const stateUser = process.env.TEST_STATE_USER_EMAIL!;
export const statePassword = process.env.TEST_STATE_USER_PASSWORD!; // pragma: allowlist secret
export const stateUserHeading = "Managed Care Reporting Portal";

export const stateAbbreviation = process.env.TEST_STATE || "MN";
export const stateName = process.env.TEST_STATE_NAME || "Minnesota";

export const currentYear: number = new Date().getFullYear();
export const currentDate: Date = new Date();
export const nextDate: Date = new Date(
  currentDate.getTime() + 24 * 60 * 60 * 1000
);

export const stateUserAuth: string = ".auth/user.json";
export const adminUserAuth: string = ".auth/admin.json";

export const cognitoIdentityRoute = "https://cognito-identity.*.amazonaws.com/";

export const a11yTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export const mnMcparPrograms = [
  "Minnesota Senior Health Options (MSHO)",
  "PMAP",
  "Special Needs Basic Care (SNBC)",
  "Minnesota Senior Care Plus (MSC+)",
  "MinnesotaCare",
];

export const a11yViewports = {
  mobile: { width: 560, height: 800 },
  tablet: { width: 880, height: 1000 },
  desktop: { width: 1200, height: 1200 },
};

export const bannerToDelete: Omit<Banner, "key" | "createdAt" | "lastAltered"> =
  {
    title: "Delete Banner Test",
    description: "Delete Banner Description",
    startDate: currentDate.getTime(),
    endDate: nextDate.getTime(),
  };

export const bannerToCreate = {
  title: "Create Banner Test",
  description: "Create Banner Description",
  startDate: currentDate,
  endDate: nextDate,
};
