/**
 * If there are feature flags, export the report JSON as the flag name,
 * matching how it is named in LaunchDarkly.
 *
 * Example:
 * export { reportTypeReportJson as myFeatureFlag } from "./myFeatureFlag";
 *
 * If there are no feature flags, use: export default {};
 */

// commented out export is intentional to preserve the flag for future use when the feature is ready to be enabled
// export { mcparReportJson as newQualityMeasuresSectionEnabled } from "./newQualityMeasuresSectionEnabled";
export { mcparReportJson as summer2026SansQm } from "./summer2026SansQm";
