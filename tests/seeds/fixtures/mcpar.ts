import { faker } from "@faker-js/faker";
import { suppressionText } from "../../../services/app-api/utils/constants/constants";
import {
  Choice,
  ReportStatus,
  ReportType,
} from "../../../services/app-api/utils/types";
import { mcparProgramList } from "../../../services/ui-src/src/forms/addEditMcparReport/mcparProgramList";
import { dateFormat, numberFloat, numberInt, randomIndex } from "../helpers";
import { SeedFillReportShape, SeedNewReportShape } from "../types";

export const newMcpar = (
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
    programIsPCCM: [
      { key: "programIsPCCM-yes_programIsPCCM", value: "Yes" },
      { key: "programIsPCCM-no_programIsNotPCCM", value: "No" },
    ],
    naaarSubmission: [
      {
        key: "naaarSubmissionForThisProgram-Oidjp5sYMuMEmkVYjNxZ5aDV",
        value: "Yes, I submitted it",
      },
      {
        key: "naaarSubmissionForThisProgram-Z9Ysnff8zxb1IVjxQgoG9ndW",
        value: "Yes, I plan on submitting it",
      },
      {
        key: "naaarSubmissionForThisProgram-yG8AlzEtPXPnE7rvek6Q1xIk",
        value: "No",
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

  const {
    hasExpectedNaaarSubmission,
    hasNaaarSubmission,
    isPccm,
    isNewProgram,
  } = options;

  // Has NAAAR submission
  const naaarSubmissionDateForThisProgram = hasNaaarSubmission
    ? dateFormat.format(faker.date.recent())
    : undefined;
  const naaarExpectedSubmissionDateForThisProgram = hasExpectedNaaarSubmission
    ? dateFormat.format(faker.date.future())
    : undefined;
  const naaarSubmissionForThisProgram = [
    enums.naaarSubmission[
      hasNaaarSubmission ? 0 : hasExpectedNaaarSubmission ? 1 : 2
    ],
  ];

  // PCCM
  const programIsPCCM = [enums.programIsPCCM[isPccm ? 0 : 1]];
  const generatedProgramName = `${isPccm ? "PCCM: " : ""}${faker.book.title()}`;

  // Pick an existing program name
  const existingPrograms =
    mcparProgramList[state as keyof typeof mcparProgramList];
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

  return {
    metadata: {
      combinedData: faker.datatype.boolean(),
      copyFieldDataSourceId: "",
      dueDate: reportingPeriodEndDate,
      existingProgramNameSelection,
      existingProgramNameSuggestion: "",
      lastAlteredBy: faker.person.fullName(),
      locked: false,
      naaarExpectedSubmissionDateForThisProgram,
      naaarSubmissionDateForThisProgram,
      naaarSubmissionForThisProgram,
      newOrExistingProgram,
      newProgramName,
      previousRevisions: [],
      programIsPCCM,
      programName,
      reportType: ReportType.MCPAR,
      reportingPeriodEndDate,
      reportingPeriodStartDate,
      status: ReportStatus.NOT_STARTED,
      submissionCount: 0,
    },
    fieldData: {
      programName,
      reportingPeriodEndDate: dateFormat.format(newReportingPeriodEndDate),
      reportingPeriodStartDate: dateFormat.format(newReportingPeriodStartDate),
      stateName,
    },
  };
};

export const newMcparHasNaaarSubmission = (
  stateName: string,
  state: string
) => {
  return newMcpar(stateName, state, { hasNaaarSubmission: true });
};

export const newMcparHasExpectedNaaarSubmission = (
  stateName: string,
  state: string
) => {
  return newMcpar(stateName, state, { hasExpectedNaaarSubmission: true });
};

export const newMcparNewProgram = (stateName: string, state: string) => {
  return newMcpar(stateName, state, { isNewProgram: true });
};

export const newMcparNewProgramPCCM = (stateName: string, state: string) => {
  return newMcpar(stateName, state, { isNewProgram: true, isPccm: true });
};

export const newMcparPCCM = (stateName: string, state: string) => {
  return newMcpar(stateName, state, { isPccm: true });
};

export const fillMcpar = (programIsPCCM?: Choice[]): SeedFillReportShape => {
  const planId = crypto.randomUUID();

  if (programIsPCCM?.[0].value === "Yes") {
    return fillMcparPCCM(planId);
  }

  const ilosId = crypto.randomUUID();
  const ilosName = faker.animal.dog();
  const newReportingPeriodStartDate = faker.date.soon({ days: 10 });
  const newReportingPeriodEndDate = faker.date.future({
    refDate: newReportingPeriodStartDate,
  });

  return {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      status: ReportStatus.IN_PROGRESS,
    },
    fieldData: {
      contactEmailAddress: faker.internet.email(),
      contactName: faker.person.fullName(),
      dateStateWillRemediateThisAreaOfNoncompliance: "",
      descriptionOfDeficienciesInLastAnalysisConducted: faker.lorem.sentence(),
      descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis:
        [
          {
            key: "descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis-iLzELvKBsBoZxJ96fLU5wyDM",
            value: "Changes in benefits",
          },
        ],
      "descriptionOfEventsInReportingPeriodThatNecessitatedUpdateToParityAnalysis-otherText":
        "",
      plan_patientAccessApiReporting: [
        {
          key: "plan_patientAccessApiReporting-taijmIVhoXueygYHFhrx6FrI",
          value: "Yes",
        },
      ],
      plan_priorAuthorizationReporting: [
        {
          key: "plan_priorAuthorizationReporting-bByTWRIwTSTBncyZRUiibagB",
          value: "Yes",
        },
      ],
      program_areServicesProvidedToMcEnrolleesByPihpPahpOrFfsDeliverySystem: [
        {
          key: "program_areServicesProvidedToMcEnrolleesByPihpPahpOrFfsDeliverySystem-FjCDK2ONpqtd0z2DTz8YaGjP",
          value: "Yes",
        },
      ],
      program_contractDate: dateFormat.format(faker.date.future()),
      program_contractTitle: faker.book.series(),
      program_contractUrl: faker.internet.url(),
      program_coveredSpecialBenefits: [
        {
          key: "program_coveredSpecialBenefits-TXvFpzmNqkCgpLcDckL5QQ",
          value: "Behavioral health",
        },
      ],
      "program_coveredSpecialBenefits-otherText": "",
      program_criticalIncidentDefinition: faker.lorem.sentence(),
      program_didStateOrMCOsCompleteAnalysis: [
        {
          key: "program_didStateOrMCOsCompleteAnalysis-hzfe4WnueXTUDk0FoFcJcq1G",
          value: "MCO",
        },
      ],
      "program_didStateOrMCOsCompleteAnalysis-otherText": "",
      program_doesThisProgramIncludeMCOs: [
        {
          key: "program_doesThisProgramIncludeMCOs-A4uFU0YyU9useo3DsWjnH264",
          value: "Yes",
        },
      ],
      program_encounterDataUses: [
        {
          key: "program_encounterDataUses-eSrOkLMTyEmmixeqNXV1ZA",
          value: "Rate setting",
        },
      ],
      program_encounterDataCollectionValidationBarriers: faker.lorem.sentence(),
      program_encounterDataQualityIncentives: faker.lorem.sentence(),
      program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria: [
        {
          key: "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-kP5W9deIb06jK7SXX8dnRA",
          value: "Timeliness of initial data submissions",
        },
      ],
      "program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria-otherText":
        "",
      program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation:
        faker.lorem.sentence(),
      program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation:
        faker.lorem.sentence(),
      "program_encounterDataUses-otherText": "",
      program_enrollment: numberInt(),
      program_enrollmentBenefitChanges: faker.lorem.sentence(),
      program_expeditedAppealTimelyResolutionDefinition: faker.lorem.sentence(),
      program_grievanceTimelyResolutionDefinition: faker.lorem.sentence(),
      program_hasStatePostedCurrentParityAnalysisCoveringThisProgram: [
        {
          key: "program_hasStatePostedCurrentParityAnalysisCoveringThisProgram-fncOB9LFBZd1nFJvLv9YM1Pb",
          value: "Yes",
        },
      ],
      program_haveTheseDeficienciesBeenResolvedForAllPlans: [
        {
          key: "program_haveTheseDeficienciesBeenResolvedForAllPlans-sLd8M1tgf9dpVIZWRYEXvdBe",
          value: "Yes",
        },
      ],
      program_prohibitedAffiliationDisclosure: [
        {
          key: "program_prohibitedAffiliationDisclosure-7emiYPcs60GzXxKS5Pc9bg",
          value: "Yes",
        },
      ],
      program_specialBenefitsAvailabilityVariation: faker.lorem.sentence(),
      program_standardAppealTimelyResolutionDefinition: faker.lorem.sentence(),
      program_triggeringEventsNecessitatingUpdatesToParityAnalysis: [
        {
          key: "program_triggeringEventsNecessitatingUpdatesToParityAnalysis-q6F3AvbLimTiLUDN2xQvd2ip",
          value: "Yes",
        },
      ],
      program_type: [
        {
          key: "program_type-rP1NWfC2jEGDwLSnSZVWDg",
          value: "Managed Care Organization (MCO)",
        },
      ],
      "program_type-otherText": "",
      program_wereAnyDeficienciesIdentifiedDuringTheAnalysisConducted: [
        {
          key: "program_wereAnyDeficienciesIdentifiedDuringTheAnalysisConducted-z3iOa69iV6mQVBWTqIJBl5Ck",
          value: "Yes",
        },
      ],
      program_whenWasTheLastParityAnalysisCoveringThisProgramCompleted:
        dateFormat.format(faker.date.recent()),
      program_whenWasTheLastParityAnalysisForThisProgramSubmittedToCMS:
        dateFormat.format(faker.date.recent()),
      reasonsForNoDeficiencyResolutionsForAllPlans: [],
      "reasonsForNoDeficiencyResolutionsForAllPlans-otherText": "",
      state_beneficiaryCircumstanceChangeReconciliationEfforts:
        faker.lorem.sentence(),
      state_bssEntityServiceAccessibility: faker.lorem.sentence(),
      state_bssEntityLtssProgramDataIssueAssistance: faker.lorem.sentence(),
      state_bssEntityPerformanceEvaluationMethods: faker.lorem.sentence(),
      state_bssWebsite: faker.internet.url(),
      state_encounterDataValidationEntity: [
        {
          key: "state_encounterDataValidationEntity-2iuXO7C6nk6cuP9JXbdd2w",
          value: "State Medicaid agency staff",
        },
      ],
      "state_encounterDataValidationEntity-otherText": "",
      state_encounterDataValidationSystemHipaaCompliance: [],
      state_excludedEntityIdentifiedInFederalDatabaseCheck: [
        {
          key: "state_excludedEntityIdentifiedInFederalDatabaseCheck-zrrv4vmXRkGhSkaS2V2d3A",
          value: "Yes",
        },
      ],
      state_excludedEntityIdentificationInstancesSummary:
        faker.lorem.sentence(),
      state_focusedProgramIntegrityActivitiesConducted: faker.lorem.sentence(),
      state_overpaymentReportingMonitoringEfforts: faker.lorem.sentence(),
      state_overpaymentStandard: [
        {
          key: "state_overpaymentStandard-UG7uunqq5UCtUq1is3iyiw",
          value: "Allow plans to retain overpayments",
        },
      ],
      state_overpaymentStandardContractLanguageLocation: faker.lorem.sentence(),
      state_overpaymentStandardDescription: faker.lorem.sentence(),
      state_ownershipControlDisclosureWebsite: [
        {
          key: "state_ownershipControlDisclosureWebsite-fNiPtEub20Soo1W5FcdU3A",
          value: "Yes",
        },
      ],
      state_ownershipControlDisclosureWebsiteLink: faker.internet.url(),
      state_priorAuthorizationReporting: [
        {
          key: "state_priorAuthorizationReporting-2nAidDjXBvvkzLtaeYyE2RymW4G",
          value: "Yes",
        },
      ],
      state_providerTerminationReportingMonitoringEfforts: [
        {
          key: "state_providerTerminationReportingMonitoringEfforts-WFrdLUutmEujEZkS7rWVqQ",
          value: "Yes",
        },
      ],
      state_providerTerminationReportingMonitoringMetrics: [
        {
          key: "state_providerTerminationReportingMonitoringMetrics-SPqyExyg8UioX6Od1IWvlg",
          value: "Yes",
        },
      ],
      state_providerTerminationReportingMonitoringMetricsDescription:
        faker.lorem.sentence(),
      state_stateTimeframeForExpeditedPriorAuthorizationDecisions: numberInt(),
      state_stateTimeframeForStandardPriorAuthorizationDecisions: numberInt(),
      state_statewideMedicaidEnrollment: numberInt(),
      state_statewideMedicaidManagedCareEnrollment: numberInt(),
      state_submittedDataAuditResults: faker.lorem.sentence(),
      state_timeframesForExpeditedPriorAuthorizationDecisions: [
        {
          key: "state_timeframesForExpeditedPriorAuthorizationDecisions-2nAidJFG47lnFfJsNJS2tU7d4pp",
          value: "Yes",
        },
      ],
      state_timeframesForStandardPriorAuthorizationDecisions: [
        {
          key: "state_timeframesForStandardPriorAuthorizationDecisions-2nAidFCWvENhYZvzLt3DxJWOqtx",
          value: "Yes",
        },
      ],
      websiteStatePostedCurrentParityAnalysisCoveringThisProgram:
        faker.internet.url(),
      accessMeasures: [
        {
          id: crypto.randomUUID(),
          accessMeasure_applicableRegion: [
            {
              key: "accessMeasure_applicableRegion-aZ4JmR9kfLKZEqQje3N1R1",
              value: "Statewide",
            },
          ],
          accessMeasure_generalCategory: [
            {
              key: "accessMeasure_generalCategory-XbR70C9iDU2yPtQXBuwZgA",
              value:
                "General quantitative availability and accessibility standard",
            },
          ],
          accessMeasure_monitoringMethods: [
            {
              key: "accessMeasure_monitoringMethods-gbWqxtPWaUC1yUbmhWA0UA",
              value: "Geomapping",
            },
          ],
          accessMeasure_oversightMethodFrequency: [
            {
              key: "accessMeasure_oversightMethodFrequency-vtAjpZENepsmacGCddGdyt",
              value: "Weekly",
            },
          ],
          accessMeasure_population: [
            {
              key: "accessMeasure_population-YtRX5yx7NEWkGfU9vDI03g",
              value: "Adult",
            },
          ],
          accessMeasure_providerType: [
            {
              key: "accessMeasure_providerType-7z1m6zajqUupPe89o3dAGQ",
              value: "Primary care",
            },
          ],
          accessMeasure_standardDescription: faker.lorem.sentence(),
          accessMeasure_standardType: [
            {
              key: "accessMeasure_standardType-kBady0XnCUG8nxXWSHHeBg",
              value: "Maximum time to travel",
            },
          ],
        },
      ],
      plans: [
        {
          id: planId,
          name: faker.animal.cat(),
          plan_activeAppeals: numberInt(),
          plan_activeGrievances: numberInt(),
          plan_appealsDenied: numberInt(),
          plan_appealsResolvedInFavorOfEnrollee: numberInt(),
          plan_appealsResolvedInPartialFavorOfEnrollee: numberInt(),
          plan_averageTimeToDecisionForExpeditedPriorAuthorizations:
            numberFloat(),
          plan_averageTimeToDecisionForStandardPriorAuthorizations:
            numberFloat(),
          plan_beneficiaryCircumstanceChangeReportingFrequency: [
            {
              key: "plan_beneficiaryCircumstanceChangeReportingFrequency-D79APWVHmkGzLcmBQrRXOA",
              value: "Daily",
            },
          ],
          plan_dedicatedProgramIntegrityStaff: numberInt(),
          plan_encounterDataSubmissionHipaaCompliancePercentage: numberInt(),
          plan_encounterDataSubmissionTimelinessCompliancePercentage:
            numberInt(),
          plan_enrollment: suppressionText,
          plan_ilosOfferedByPlan: [
            {
              key: "plan_ilosOfferedByPlan-1qdYiWh0SaO7IQ41NeOt0uJU",
              value: "Yes, at least 1 ILOS is offered by this plan",
            },
          ],
          plan_ilosUtilizationByPlan: [
            { key: `plan_ilosUtilizationByPlan-${ilosId}`, value: ilosName },
          ],
          [`plan_ilosUtilizationByPlan_${ilosId}`]: numberInt(),
          plan_ltssUserFieldGrievances: numberInt(),
          plan_ltssUserFiledAppeals: numberInt(),
          plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal:
            numberInt(),
          plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance:
            numberInt(),
          plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests:
            numberFloat(),
          plan_medianTimeToDecisionOnStandardPriorAuthorizations: numberFloat(),
          plan_medicaidEnrollmentSharePercentage: suppressionText,
          plan_medicaidManagedCareEnrollmentSharePercentage: suppressionText,
          plan_parentOrganization: faker.lorem.sentence(),
          plan_mfcuProgramIntegrityReferrals: numberInt(),
          plan_numberOfUniqueBeneficiariesWithAtLeastOneDataTransfer:
            numberInt(),
          plan_numberOfUniqueBeneficiariesWithMultipleDataTransfers:
            numberInt(),
          plan_openedProgramIntegrityInvestigations: numberInt(),
          plan_overpaymentReportingToStateCorrespondingYearPremiumRevenue:
            numberFloat(),
          plan_overpaymentReportingToStateDollarAmount: numberFloat(),
          plan_overpaymentReportingToStateEndDate: dateFormat.format(
            newReportingPeriodEndDate
          ),
          plan_overpaymentReportingToStateStartDate: dateFormat.format(
            newReportingPeriodStartDate
          ),
          plan_percentageOfExpeditedPriorAuthorizationRequestsApproved:
            numberFloat(),
          plan_percentageOfExpeditedPriorAuthorizationRequestsDenied:
            numberFloat(),
          plan_percentageOfStandardPriorAuthorizationRequestsApproved:
            numberFloat(),
          plan_percentageOfStandardPriorAuthorizationRequestsApprovedAfterAppeal:
            numberFloat(),
          plan_percentageOfStandardPriorAuthorizationRequestsDenied:
            numberFloat(),
          plan_percentageOfTotalPriorAuthorizationRequestsApprovedWithExtendedTimeframe:
            numberFloat(),
          plan_programIntegrityReferralPath: [
            {
              key: "plan_programIntegrityReferralPath-1LOghpdQOkaOd76btMJ8qA",
              value:
                "Makes referrals to the Medicaid Fraud Control Unit (MFCU) only",
            },
          ],
          plan_resolvedAbuseNeglectExploitationGrievances: numberInt(),
          plan_resolvedAccessToCareGrievances: numberInt(),
          plan_resolvedAppeals: numberInt(),
          plan_resolvedCareCaseManagementGrievances: numberInt(),
          plan_resolvedCoveredOutpatientPrescriptionDrugAppeals: numberInt(),
          plan_resolvedCoveredOutpatientPrescriptionDrugGrievances: numberInt(),
          plan_resolvedCustomerServiceGrievances: numberInt(),
          plan_resolvedDenialOfExpeditedAppealGrievances: numberInt(),
          plan_resolvedDentalServiceAppeals: numberInt(),
          plan_resolvedDentalServiceGrievances: numberInt(),
          plan_resolvedDmeAndSuppliesAppeals: numberInt(),
          plan_resolvedDmeGrievances: numberInt(),
          plan_resolvedEmergencyServicesAppeals: numberInt(),
          plan_resolvedEmergencyServicesGrievances: numberInt(),
          plan_resolvedGeneralInpatientServiceAppeals: numberInt(),
          plan_resolvedGeneralInpatientServiceGrievances: numberInt(),
          plan_resolvedGeneralOutpatientServiceAppeals: numberInt(),
          plan_resolvedGeneralOutpatientServiceGrievances: numberInt(),
          plan_resolvedGrievances: numberInt(),
          plan_resolvedHomeHealthAppeals: numberInt(),
          plan_resolvedHomeHealthGrievances: numberInt(),
          plan_resolvedInpatientBehavioralHealthServiceAppeals: numberInt(),
          plan_resolvedInpatientBehavioralHealthServiceGrievances: numberInt(),
          plan_resolvedLtssServiceAppeals: numberInt(),
          plan_resolvedLtssServiceGrievances: numberInt(),
          plan_resolvedNemtAppeals: numberInt(),
          plan_resolvedNemtGrievances: numberInt(),
          plan_resolvedOtherGrievances: numberInt(),
          plan_resolvedOtherServiceAppeals: numberInt(),
          plan_resolvedOtherServiceGrievances: numberInt(),
          plan_resolvedOutpatientBehavioralHealthServiceAppeals: numberInt(),
          plan_resolvedOutpatientBehavioralHealthServiceGrievances: numberInt(),
          plan_resolvedPaymentBillingGrievances: numberInt(),
          plan_resolvedPlanCommunicationGrievances: numberInt(),
          plan_resolvedPostServiceAuthorizationDenialAppeals: numberInt(),
          plan_resolvedPreServiceAuthorizationDenialAppeals: numberInt(),
          plan_resolvedProgramIntegrityInvestigations: numberInt(),
          plan_resolvedQualityOfCareGrievances: numberInt(),
          plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals:
            numberInt(),
          plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals:
            numberInt(),
          plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals: numberInt(),
          plan_resolvedServiceTimelinessAppeals: numberInt(),
          plan_resolvedSnfServiceAppeals: numberInt(),
          plan_resolvedSnfServiceGrievances: numberInt(),
          plan_resolvedSuspectedFraudGrievances: numberInt(),
          plan_resolvedTherapiesAppeals: numberInt(),
          plan_resolvedTherapyGrievances: numberInt(),
          plan_resolvedUntimelyResponseAppeals: numberInt(),
          plan_resolvedUntimelyResponseGrievances: numberInt(),
          plan_stateFairHearingRequestsFiled: numberInt(),
          plan_stateFairHearingRequestsRetracted: numberInt(),
          plan_stateFairHearingRequestsWithAdverseDecision: numberInt(),
          plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision:
            numberInt(),
          plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision:
            numberInt(),
          plan_stateFairHearingRequestsWithFavorableDecision: numberInt(),
          plan_timelyResolvedExpeditedAppeals: numberInt(),
          plan_timelyResolvedStandardAppeals: numberInt(),
          plan_timyleResolvedGrievances: numberInt(),
          plan_totalExpeditedPriorAuthorizationRequestsReceived: numberInt(),
          plan_totalStandardAndExpeditedPriorAuthorizationRequestsReceived:
            numberInt(),
          plan_totalStandardPriorAuthorizationRequestsReceived: numberInt(),
          plan_urlForListOfAllItemsAndServicesSubjectToPriorAuthorization:
            faker.internet.url(),
          plan_urlForPatientAccessApi: faker.internet.url(),
          plan_urlForPatientResourcesForPatientAccessApi: faker.internet.url(),
          plan_urlForPatientResourcesForProviderAccessAndPayerToPayerApi:
            faker.internet.url(),
          plan_urlForPriorAuthorizationDataOnPlanWebsite: faker.internet.url(),
          program_encounterDataSubmissionTimelinessStandardDefinition:
            faker.lorem.sentence(),
        },
      ],
      bssEntities: [
        {
          id: crypto.randomUUID(),
          name: faker.animal.cetacean(),
          bssEntity_entityRole: [
            {
              key: "bssEntity_entityRole-aZ0uOjpYOE6zavUNXcZYrw",
              value: "Enrollment Broker/Choice Counseling",
            },
          ],
          bssEntity_entityType: [
            {
              key: "bssEntity_entityType-b8RT4wLcoU2yb0QgswyAfQ",
              value: "State Government Entity",
            },
          ],
        },
      ],
      ilos: [
        {
          id: ilosId,
          name: ilosName,
        },
      ],
      qualityMeasures: [
        {
          id: crypto.randomUUID(),
          qualityMeasure_name: faker.animal.insect(),
          qualityMeasure_description: faker.lorem.sentence(),
          qualityMeasure_domain: [
            {
              key: "qualityMeasure_domain-Y3InqsLp4kSTgAUvTwq0CA",
              value: "Primary care access and preventative care",
            },
          ],
          qualityMeasure_nqfNumber: faker.hacker.abbreviation(),
          [`qualityMeasure_plan_measureResults_${planId}`]:
            faker.lorem.sentence(),
          qualityMeasure_reportingPeriod: [
            {
              key: "qualityMeasure_reportingPeriod-XAalDWT7l0qPz676XFGSGQ",
              value: "Yes",
            },
          ],
          qualityMeasure_reportingRateType: [
            {
              key: "qualityMeasure_reportingRateType-lTIN7GiY2Ui2kJYrWzXqVw",
              value: "Program-specific rate",
            },
          ],
          qualityMeasure_set: [
            {
              key: "qualityMeasure_set-tjSQLCDhgEy7H3VrhtUKxw",
              value: "Medicaid Child Core Set",
            },
          ],
        },
      ],
      sanctions: [createSanction(planId)],
    },
  };
};

export const fillMcparPCCM = (planId: string): SeedFillReportShape => {
  return {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      status: ReportStatus.IN_PROGRESS,
    },
    fieldData: {
      contactEmailAddress: faker.internet.email(),
      contactName: faker.person.fullName(),
      program_contractDate: dateFormat.format(faker.date.future()),
      program_contractTitle: faker.book.series(),
      program_contractUrl: faker.internet.url(),
      program_coveredSpecialBenefits: [
        {
          key: "program_coveredSpecialBenefits-TXvFpzmNqkCgpLcDckL5QQ",
          value: "Behavioral health",
        },
      ],
      program_enrollment: numberInt(),
      program_enrollmentBenefitChanges: faker.lorem.sentence(),
      program_specialBenefitsAvailabilityVariation: faker.lorem.sentence(),
      state_statewideMedicaidEnrollment: numberInt(),
      state_statewideMedicaidManagedCareEnrollment: numberInt(),
      plans: [
        {
          id: planId,
          name: faker.animal.cat(),
          plan_enrollment: suppressionText,
          plan_medicaidEnrollmentSharePercentage: suppressionText,
          plan_medicaidManagedCareEnrollmentSharePercentage: suppressionText,
          plan_parentOrganization: faker.lorem.sentence(),
        },
      ],
      sanctions: [createSanction(planId)],
    },
  };
};

const createSanction = (planId: string) => ({
  id: crypto.randomUUID(),
  sanction_assessmentDate: dateFormat.format(faker.date.recent({ days: 10 })),
  sanction_correctiveActionPlan: [
    {
      key: "sanction_correctiveActionPlan-doioZOW5CUmcCfO5TQXpbw",
      value: "Yes",
    },
  ],
  sanction_dollarAmount: numberFloat(),
  sanction_interventionReason: faker.lorem.sentence(),
  sanction_interventionTopic: [
    {
      key: "sanction_interventionTopic-x6Cwd4oSrki6De4SnpjrMQ",
      value: "Discrimination",
    },
  ],
  sanction_interventionType: [
    {
      key: "sanction_interventionType-lF2t0ruXf0aPrT3EDd3IXA",
      value: "Civil monetary penalty",
    },
  ],
  sanction_noncomplianceInstances: numberInt(),
  sanction_planName: {
    label: "sanction_planName",
    value: planId,
  },
  sanction_remediationCompleted: [
    {
      key: "sanction_remediationCompleted-J9FTVN9fJpgXX6X2xJiAiP",
      value: "Yes, remediated",
    },
  ],
  sanction_remediationDate: dateFormat.format(faker.date.recent({ days: 2 })),
});
