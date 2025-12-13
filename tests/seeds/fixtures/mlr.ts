import { faker } from "@faker-js/faker";
import {
  ReportStatus,
  ReportType,
} from "../../../services/app-api/utils/types";
import { dateFormat, numberFloat, numberInt } from "../helpers";
import { SeedFillReportShape, SeedNewReportShape } from "../types";

export const newMlr = (
  flags: { [key: string]: true },
  stateName: string
): SeedNewReportShape => {
  if (Object.keys(flags).length > 0) {
    // Add data mods by flag
  }

  return {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      locked: false,
      previousRevisions: [],
      programName: faker.book.series(),
      reportType: ReportType.MLR,
      status: ReportStatus.NOT_STARTED,
      submissionCount: 0,
    },
    fieldData: {
      stateName,
      versionControl: [
        {
          key: "versionControl-KFCd3rfEu3eT4UFskUhDtx",
          value: "No, this is an initial submission",
        },
      ],
    },
  };
};

export const fillMlr = (flags: {
  [key: string]: true;
}): SeedFillReportShape => {
  const newReportingPeriodStartDate = faker.date.soon({ days: 10 });
  const newReportingPeriodEndDate = faker.date.future({
    refDate: newReportingPeriodStartDate,
  });

  if (Object.keys(flags).length > 0) {
    // Add data mods by flag
  }

  return {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      status: ReportStatus.IN_PROGRESS,
    },
    fieldData: {
      contactEmailAddress: faker.internet.email(),
      contactJobTitle: faker.person.jobTitle(),
      contactPhoneNumber: faker.phone.number(),
      contactName: faker.person.fullName(),
      stateAgencyName: faker.company.name(),
      program: [
        {
          id: crypto.randomUUID(),
          report_planName: faker.music.songName(),
          report_adjustedMlrPercentage: numberFloat(),
          report_adjustedMlrPercentageExplanation: faker.lorem.sentence(),
          report_calculatedMlrPercentageForRemittancePurposes: numberFloat(),
          report_contractIncludesMlrRemittanceRequirement: [
            {
              key: "report_contractIncludesMlrRemittanceRequirement-7FP4jcg4jK7Ssqp3cCW5vQ",
              value: "Yes",
            },
          ],
          report_credibilityAdjustmentPercentage: numberInt(),
          report_eligibilityGroup: [
            {
              key: "report_eligibilityGroup-cRi6qE4T5c6BjbGUsiiEof",
              value: "All Populations",
            },
          ],
          report_healthCareQualityImprovementActivities: numberFloat(),
          report_incurredClaims: numberFloat(),
          report_isRemittancePeriodSameAsMlrReportingPeriod: [
            {
              key: "report_isRemittancePeriodSameAsMlrReportingPeriod-YzV3x7cp3u2sX92V3cbpDM",
              value: "Yes",
            },
          ],
          report_miscellaneousNotes: faker.lorem.sentence(),
          report_mlrDenominator: numberFloat(),
          report_mlrDenominatorExplanation: faker.lorem.sentence(),
          report_mlrNumerator: numberFloat(),
          report_mlrNumeratorExplanation: faker.lorem.sentence(),
          report_nonClaimsCosts: numberFloat(),
          report_premiumRevenue: numberFloat(),
          report_programName: faker.music.album(),
          report_programType: [
            {
              key: "report_programType-G4inXZJWYFsDZYGk75cW7L",
              value: "Comprehensive MCO",
            },
          ],
          report_remittanceDollarAmountDue: numberFloat(),
          report_remittanceDollarAmountOwed: numberFloat(),
          report_remittanceExplanation: faker.lorem.sentence(),
          report_reportingPeriodDiscrepancy: [
            {
              key: "report_reportingPeriodDiscrepancy-2NI2TmkWrS70g3U6adRKklWSv31",
              value: "Yes",
            },
          ],
          report_reportingPeriodDiscrepancyExplanation: faker.lorem.sentence(),
          report_reportingPeriodEndDate: dateFormat.format(
            newReportingPeriodEndDate
          ),
          report_reportingPeriodStartDate: dateFormat.format(
            newReportingPeriodStartDate
          ),
          report_requiredMemberMonths: numberInt(),
          report_stateFederalRemittanceShareDeterminationMethodologyDescription:
            faker.lorem.sentence(),
          report_taxesLicensingRegulatoryFees: numberFloat(),
          report_unadjustedMlrPercentage: numberFloat(),
          report_unadjustedMlrPercentageExplanation: faker.lorem.sentence(),
          state_doesStateRemittanceMlrCalculationAlign: [
            {
              key: "state_doesStateRemittanceMlrCalculationAlign-PpL7niYGJMaY2fgv7R8C7g",
              value: "Yes",
            },
          ],
          state_minimumMlrRequirement: numberFloat(),
        },
      ],
    },
  };
};
