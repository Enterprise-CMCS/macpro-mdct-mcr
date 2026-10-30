import {
  areRequiredFieldsComplete,
  getStandardStatus,
} from "./getStandardStatus";
// types
import { FormField } from "types";

const primaryCareId = "standard_coreProviderType-UZK4hxPVnuYGcIgNzYFHCk"; // pragma: allowlist secret
const mentalHealthId = "standard_coreProviderType-9kBoKCLD1dYizieU5psnJi"; // pragma: allowlist secret
const standardTypeChoiceId = "kIrheUXLpOwF7OEypso8Ylhs"; // pragma: allowlist secret

const providerTypeField = {
  id: "standard_coreProviderType",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: primaryCareId,
        label: "Primary care",
        children: [
          {
            id: primaryCareId,
            type: "text",
            validation: {
              type: "text",
              nested: true,
              parentFieldName: "standard_coreProviderType",
              parentOptionId: primaryCareId,
            },
          },
        ],
      },
      {
        id: mentalHealthId,
        label: "Mental health",
        children: [
          {
            id: mentalHealthId,
            type: "text",
            validation: {
              type: "textOptional",
              nested: true,
              parentFieldName: "standard_coreProviderType",
              parentOptionId: mentalHealthId,
            },
          },
        ],
      },
    ],
  },
} as unknown as FormField;

const standardTypeField = {
  id: "standard_standardType",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: standardTypeChoiceId,
        label: "Appointment wait time",
        children: [
          {
            id: `standard_standardDescription-${standardTypeChoiceId}`,
            type: "textarea",
            validation: {
              type: "text",
              nested: true,
              parentFieldName: "standard_standardType",
              parentOptionId: standardTypeChoiceId,
            },
          },
        ],
      },
    ],
  },
} as unknown as FormField;

const fields = [providerTypeField, standardTypeField];

const completeStandard = {
  id: "standard-1",
  standard_coreProviderType: [{ key: primaryCareId, value: "Primary care" }],
  [primaryCareId]: "Family physician",
  standard_standardType: [
    {
      key: `standard_standardType-${standardTypeChoiceId}`,
      value: "Appointment wait time",
    },
  ],
  [`standard_standardDescription-${standardTypeChoiceId}`]: "Within 30 days",
};

describe("getStandardStatus()", () => {
  test("returns true when all required and nested required fields are answered", () => {
    expect(getStandardStatus(completeStandard, fields)).toBe(true);
  });

  test("returns false when a required nested field under the selected choice is missing", () => {
    const { [primaryCareId]: _omitted, ...copiedStandard } = completeStandard;
    expect(getStandardStatus(copiedStandard, fields)).toBe(false);
  });

  test("returns false when a required nested field is blank", () => {
    expect(
      getStandardStatus({ ...completeStandard, [primaryCareId]: "   " }, fields)
    ).toBe(false);
  });

  test("returns true when the missing nested field is optional", () => {
    const mentalHealthStandard = {
      ...completeStandard,
      standard_coreProviderType: [
        { key: mentalHealthId, value: "Mental health" },
      ],
    };
    delete (mentalHealthStandard as any)[primaryCareId];
    expect(getStandardStatus(mentalHealthStandard, fields)).toBe(true);
  });

  test("matches choices whose stored key is prefixed with the field id", () => {
    const missingDescription = {
      ...completeStandard,
      [`standard_standardDescription-${standardTypeChoiceId}`]: "",
    };
    expect(getStandardStatus(missingDescription, fields)).toBe(false);
  });

  test("returns false when a required top-level field is missing", () => {
    const { standard_standardType: _omitted, ...noStandardType } =
      completeStandard;
    expect(getStandardStatus(noStandardType, fields)).toBe(false);
  });

  test("returns true when no fields are provided", () => {
    expect(getStandardStatus(completeStandard)).toBe(true);
    expect(areRequiredFieldsComplete(completeStandard, [])).toBe(true);
  });
});
