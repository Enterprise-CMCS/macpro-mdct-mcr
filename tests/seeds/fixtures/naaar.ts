import { faker } from "@faker-js/faker";
import {
  ReportStatus,
  ReportType,
} from "../../../services/app-api/utils/types";
import { DEFAULT_ANALYSIS_METHODS } from "../../../services/ui-src/src/constants";
import { naaarProgramList } from "../../../services/ui-src/src/forms/addEditNaaarReport/naaarProgramList";
import { dateFormat, randomIndex } from "../helpers";
import { SeedFillReportShape, SeedNewReportShape } from "../types";

const analysisMethods = [...DEFAULT_ANALYSIS_METHODS];

export const newNaaar = (
  flags: { [key: string]: true },
  stateName: string,
  state: string,
  options: { [key: string]: boolean } = {}
): SeedNewReportShape => {
  const newReportingPeriodStartDate = faker.date.soon({ days: 10 });
  const newReportingPeriodEndDate = faker.date.future({
    refDate: newReportingPeriodStartDate,
  });
  const reportingPeriodStartDate = newReportingPeriodStartDate.getTime();
  const reportingPeriodEndDate = newReportingPeriodEndDate.getTime();

  const enums = {
    planTypeIncludedInProgram: [
      {
        key: "planTypeIncludedInProgram-NHAbx1VBdvZkHgG2HTfexemq",
        value: "MCO",
      },
      {
        key: "planTypeIncludedInProgram-MiyW1eKfcetIG8k2eyT5dbhw",
        value: "PIHP",
      },
      {
        key: "planTypeIncludedInProgram-QASeuhF5cDBrRpWbmYBndH2v",
        value: "PAHP",
      },
      {
        key: "planTypeIncludedInProgram-U4dg782RHft2Fs53fOpcbocr",
        value: "MMP",
      },
      {
        key: "planTypeIncludedInProgram-ZRH5GgCnJSlnCdieekgh67sv",
        value: "Other, specify",
      },
    ],
    newOrExistingProgram: [
      { key: "newOrExistingProgram-isNewProgram", value: "Add new program" },
      {
        key: "newOrExistingProgram-isExistingProgram",
        value: "Existing program",
      },
    ],
  };

  const { isNewProgram } = options;

  const planIndex = randomIndex(enums.planTypeIncludedInProgram.length);
  const generatedProgramName = `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`;

  // Pick an existing program name
  const existingPrograms =
    naaarProgramList[state as keyof typeof naaarProgramList];
  const existingProgramName =
    existingPrograms[randomIndex(existingPrograms.length)].label;

  // Check for new program name
  const programName = isNewProgram ? generatedProgramName : existingProgramName;
  const existingProgramNameSelection = isNewProgram
    ? undefined
    : { value: existingProgramName, label: "existingProgramNameSelection" };
  const newOrExistingProgram = [
    enums.newOrExistingProgram[isNewProgram ? 0 : 1],
  ];
  const newProgramName = isNewProgram ? programName : undefined;

  if (Object.keys(flags).length > 0) {
    // Add data mods by flag
  }

  return {
    metadata: {
      copyFieldDataSourceId: "",
      dueDate: reportingPeriodEndDate,
      existingProgramNameSelection,
      existingProgramNameSuggestion: "",
      lastAlteredBy: faker.person.fullName(),
      locked: false,
      newOrExistingProgram,
      newProgramName,
      planTypeIncludedInProgram: [enums.planTypeIncludedInProgram[planIndex]],
      "planTypeIncludedInProgram-otherText":
        planIndex === enums.planTypeIncludedInProgram.length - 1
          ? faker.hacker.abbreviation()
          : undefined,
      previousRevisions: [],
      programName,
      reportType: ReportType.NAAAR,
      reportingPeriodEndDate,
      reportingPeriodStartDate,
      status: ReportStatus.NOT_STARTED,
      submissionCount: 0,
    },
    fieldData: {
      analysisMethods,
      stateName,
    },
  };
};

export const newNaaarNewProgram = (
  flags: { [key: string]: true },
  stateName: string,
  state: string
) => {
  return newNaaar(flags, stateName, state, { isNewProgram: true });
};

export const fillNaaar = (flags: {
  [key: string]: true;
}): SeedFillReportShape => {
  const planId = crypto.randomUUID();
  const standardId = crypto.randomUUID();
  const planName = faker.animal.cat();
  const providerTypeId = "UZK4hxPVnuYGcIgNzYFHCk";
  const standardTypeId = "kIrheUXLpOwF7OEypso8Ylhs";

  if (Object.keys(flags).length > 0) {
    // Add data mods by flag
  }

  return {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      status: ReportStatus.IN_PROGRESS,
    },
    fieldData: {
      contactName: faker.person.fullName(),
      contactEmailAddress: faker.internet.email(),
      reportingScenario: [
        {
          key: "reportingScenario-g3B64XNZhZCZ017er2Y6hJ",
          value: "Scenario 1: New contract",
        },
      ],
      "reportingScenario-otherText": "",
      reportingScenario_significantChange: [],
      analysisMethods: analysisMethodsWithPlans(planId, planName),
      plans: [
        {
          id: planId,
          name: planName,
          isComplete: true,
          isRequired: true,
          planCompliance43868_assurance: [
            {
              key: "planCompliance43868_assurance-dq36WGX8Ev8wmALi1rg3bv",
              value:
                "No, the plan does not comply on all standards based on all analyses or exceptions granted",
            },
          ],
          [`planCompliance43868_standard-${standardId}`]: [
            {
              key: `planCompliance43868_standard-${standardId}-qynBP00OCjrE196bwX3n67`,
              value: "III.C.3a Exceptions granted under 42 C.F.R. § 438.68(d)",
            },
          ],
          [`planCompliance43868_standard-${standardId}-exceptionsDescription`]:
            faker.lorem.sentence(),
          [`planCompliance43868_standard-${standardId}-exceptionsJustification`]:
            faker.lorem.sentence(),
          planCompliance438206_assurance: [
            {
              key: "planCompliance438206_assurance-zC8SPm68FS8xI9igWQ0BdP",
              value:
                "No, the plan does not comply with all standards based on all analyses or exceptions granted",
            },
          ],
          "planCompliance438206_planDeficiencies-analyses":
            faker.lorem.sentence(),
          "planCompliance438206_planDeficiencies-compliance":
            faker.lorem.sentence(),
          "planCompliance438206_planDeficiencies-date": dateFormat.format(
            faker.date.future()
          ),
          "planCompliance438206_planDeficiencies-description":
            faker.lorem.sentence(),
          "planCompliance438206_planDeficiencies-progress":
            faker.lorem.sentence(),
          planCompliance438206_requirements: [
            {
              key: "planCompliance438206_requirements-lWYfZ8qpdK2vwNXXwy9b1l",
              value:
                "Does not maintain and monitor a sufficient network of appropriate providers",
            },
            {
              key: "planCompliance438206_requirements-LR9DAx31NetMHZmnGNfP37",
              value:
                "Does not meet and require its network providers to meet State standards for timely access to care and services taking into account the urgency of the need for services, as well as appointment wait times specified in § 438.68(e).",
            },
            {
              key: "planCompliance438206_requirements-TlP89DrzdEg5KQ1LXXFCUe",
              value:
                "Does not take into account access and cultural considerations",
            },
          ],
        },
      ],
      providerTypes: [
        {
          key: providerTypeId,
          value: "Primary Care",
        },
      ],
      standards: [
        {
          id: standardId,
          [`standard_analysisMethodsUtilized-${standardTypeId}`]:
            analysisMethods.map(({ id, name }) => ({
              key: `standard_analysisMethodsUtilized-${standardTypeId}-${id}`,
              value: name,
            })),
          standard_applicableRegion: [
            {
              key: "standard_applicableRegion-KaDliEkRCXvPNlRS7DVjjt9q",
              value: "Statewide",
            },
          ],
          standard_coreProviderType: [
            {
              key: `standard_coreProviderType-${providerTypeId}`,
              value: "Primary care",
            },
          ],
          [`standard_coreProviderType-${providerTypeId}`]:
            faker.lorem.sentence(),
          standard_populationCoveredByStandard: [
            {
              key: "standard_populationCoveredByStandard-I71x1VFmmQJmKSUlFcJVS8cT",
              value: "Adult",
            },
          ],
          [`standard_standardDescription-${standardTypeId}`]:
            faker.lorem.sentence(),
          standard_standardType: [
            {
              key: `standard_standardType-${standardTypeId}`,
              value: "Maximum time to travel",
            },
          ],
        },
      ],
    },
  };
};

const analysisMethodsWithPlans = (planId: string, planName: string) =>
  analysisMethods.map((am) => ({
    ...am,
    analysis_applicable: [
      {
        key: "analysis_applicable-Br7jPULxsYgbiuHV9zwyIB",
        value: "Yes",
      },
    ],
    analysis_method_applicable_plans: [
      {
        key: `analysis_method_applicable_plans-${planId}`,
        value: planName,
      },
    ],
    analysis_method_frequency: [
      {
        key: "analysis_method_frequency-Sol1W6HJCixyOVxw4vDgXQ",
        value: "Weekly",
      },
    ],
    isRequired: true,
  }));
