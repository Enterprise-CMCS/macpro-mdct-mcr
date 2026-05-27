/**
 * If there are feature flags, export the report JSON as the flag name,
 * matching how it is named in LaunchDarkly.
 *
 * Example:
 * export { reportTypeReportJson as myFeatureFlag } from "./myFeatureFlag";
 *
 * If there are no feature flags, use: export default {};
 */

export { mlrReportJson as summer2026SansQm } from "./summer2026SansQm";
