export const adminUser = process.env.TEST_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.TEST_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const stateUser = process.env.TEST_STATE_USER_EMAIL!;
export const statePassword = process.env.TEST_STATE_USER_PASSWORD!; // pragma: allowlist secret

export const stateAbbreviation = process.env.TEST_STATE || "MN";
export const stateName = process.env.TEST_STATE_NAME || "Minnesota";

export const currentYear: number = new Date().getFullYear();

export const stateUserAuth: string = ".auth/user.json";
export const adminUserAuth: string = ".auth/admin.json";

export const a11yTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export const a11yViewports = {
  mobile: { width: 560, height: 800 },
  tablet: { width: 880, height: 1000 },
  desktop: { width: 1200, height: 1200 },
};
