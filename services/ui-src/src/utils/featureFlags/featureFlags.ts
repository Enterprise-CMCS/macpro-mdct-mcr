/**
 * Based on the CMSgov/managed-care-review project: https://github.com/CMSgov/managed-care-review/
 *
 * Contains a list of all our feature flags in Launch Darkly each flag should contain a default value. This is used to
 * provide type safety around flag names when enabling and disabling features in our code.
 *
 * This list is also used to generate Types for Unit and Cypress tests.
 */

export const featureFlags = {
  // Toggles the PDF export button on the MCPAR Review and Submit page
  PDF_EXPORT: {
    flag: "pdfExport",
    defaultValue: true,
  },

  // Toggles autosave functionality across the MCPAR form
  AUTOSAVE: {
    flag: "autosave",
    defaultValue: true,
  },
} as const;

export type FlagEnumType = keyof typeof featureFlags;

/**
 * featureFlags object top level property keys in an array. Used for LD integration into Cypress
 */
export const featureFlagEnums: FlagEnumType[] = Object.keys(featureFlags).map(
  (flag): keyof typeof featureFlags => flag as FlagEnumType
);

/**
 * Get a union type of all `flag` values of `featureFlags`. This type will constrain code to only use feature flags defined
 * in the featureFlag object. Mainly used in testing to restrict testing to actual feature flags.
 */
export type FeatureFlagTypes =
  typeof featureFlags[keyof typeof featureFlags]["flag"];

/**
 * Flag value types from Launch Darkly and used to restrict feature flag default types as well as values in testing.
 */
export type FlagValueTypes = boolean | string | number | object | [];
