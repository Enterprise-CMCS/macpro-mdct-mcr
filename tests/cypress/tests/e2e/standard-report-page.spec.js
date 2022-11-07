describe("state user enters a program", () => {
  it("enters data", () => {
    // Authenticate as a State User
    cy.visit("/");
    cy.authenticate("stateUser");

    // Navigate to MCPAR Programs List Page
    cy.findByRole("button", { name: "Enter MCPAR online" }).click();
    cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();

    // Create a Program
    cy.findByRole("button", { name: "Add managed care program" }).click();
    cy.findByLabelText("Program name").type("program title");
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142023");
    cy.findByRole("checkbox").focus().click();
    cy.get("button[type=submit]").contains("Save").click();
    cy.reload();

    // Enter the new Program, fill out fields and make sure some are disabled
    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get('input[name="stateName"]')
      .should("have.value", "Massachusetts")
      .should("be.disabled");
    cy.get('input[name="contactName"]').type("Random User");
    cy.get('input[name="contactEmailAddress"]').type("test@test.com");
    cy.get('input[name="submitterName"]').should("be.disabled");
    cy.get('input[name="submitterEmailAddress"]').should("be.disabled");
    cy.get('input[name="reportSubmissionDate"]').should("be.disabled");
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate and make sure you cannot interact with data on Reporting Period page
     * as its already been prepopulated with the date from creating the program
     */
    cy.get('input[name="reportingPeriodStartDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="reportingPeriodEndDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="programName"]')
      .should("have.value", "program title")
      .should("be.disabled");

    // Navigate to Add Plans (Using the side nav) and create 2 plans
    cy.get("p").contains("Add Plans").click();
    cy.get('input[name="plans[0]"]').type("Plan 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="plans[1]"]').type("Plan 2");
    cy.findByRole("button", { name: "Save & continue" }).click();

    //Navigate to Add BSS Entities and create 2 entities
    cy.findByLabelText("BSS entity name");
    cy.get('input[name="bssEntities[0]"]').type("Entity 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="bssEntities[1]"]').type("Entity 2");
    cy.findByRole("button", { name: "Save & continue" }).click();

    // Navigate to Section B: State Level Indicators/Program Characteristics and fill out the page
    cy.get('input[name="state_statewideMedicaidEnrollment"]').type("1020");
    cy.get('input[name="state_statewideMedicaidManagedCareEnrollment"]').type(
      "151512"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Encounter Data Report
     * Additional Field Paths Tested:
     *    Fill out all possible checkboxes
     *    Checkbox to Radio Child
     *    Checkbox to Textbox Child
     */
    cy.get('[type="checkbox"]').check("State Medicaid agency staff");
    cy.get('[type="checkbox"]').check("Other state agency staff");
    cy.get('[type="checkbox"]').check("State actuaries");
    cy.get('[type="checkbox"]').check("EQRO");
    cy.get('[type="checkbox"]').check("Other third-party vendor");
    cy.get('[type="checkbox"]').check("Proprietary system(s)");
    cy.get('[type="radio"]').check("Yes");
    cy.get('input[name="state_encounterDataValidationEntity"]')
      .get('[type="checkbox"]')
      .check("Other, specify");
    cy.get(
      'textarea[name="state_encounterDataValidationEntity-otherText"]'
    ).type("Textarea that can be filled and entered due to checking Other");
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Program Integrity and fill out fields
     * Additional Field Paths Tested:
     *    Test numbers for text field
     *    Test random characters for textfield
     *    Radio to Radio Child To Textbox Child
     *    Radio to Textbox Child
     *    Radio
     */
    cy.get(
      'textarea[name="state_focusedProgramIntegrityActivitiesConducted"]'
    ).type("1234124123123198237192 1231231");
    cy.get('[type="radio"]').check("Allow plans to retain overpayments");
    cy.get(
      'textarea[name="state_overpaymentStandardContractLanguageLocation"]'
    ).type("!@#$%!@*%#!%_!@#123:ASBAC");
    cy.get('textarea[name="state_overpaymentStandardDescription"]').type(
      "State returns payments"
    );
    cy.get('textarea[name="state_overpaymentReportingMonitoringEfforts"]').type(
      "State tracks compliance"
    );
    cy.get(
      'textarea[name="state_beneficiaryCircumstanceChangeReconciliationEfforts"]'
    ).type("State team dedicated to these cases");
    cy.get('input[name="state_providerTerminationReportingMonitoringEfforts"]')
      .get('[type="radio"]')
      .check("Yes");
    cy.get('input[name="state_providerTerminationReportingMonitoringMetrics"]')
      .get('[type="radio"]')
      .check("Yes");
    cy.get(
      'textarea[name="state_providerTerminationReportingMonitoringMetricsDescription"]'
    ).type("metric here");
    cy.get('input[name="state_excludedEntityIdentifiedInFederalDatabaseCheck"]')
      .get('[type="radio"]')
      .check("Yes");
    cy.get('textarea[name="state_ownershipControlDisclosureWebsiteLink"]').type(
      "Website Link"
    );
    cy.get('input[name="state_ownershipControlDisclosureWebsite"]')
      .get('[type="radio"]')
      .check("No");
    cy.get('textarea[name="state_submittedDataAuditResults"]').type(
      "https://www.auditwebsite.com"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Section C: Program-Level Indicators / 1: Program Characteristics
     * Additional Field Paths Tested:
     *    Date field accepts user inputted /
     *    URL Input
     *    Checkbox only check 1 option
     */
    cy.get('input[name="program_contractTitle"]').type("Contract Title");
    cy.get('input[name="program_contractDate"]').type("07/14/2023");
    cy.get('input[name="program_contractUrl"]').type(
      "https://www.contracturl.com"
    );
    cy.get('[type="radio"]').check("Other, specify");
    cy.get('textarea[name="program_type-otherText"]').type("Generic MCP here");
    cy.get('[type="checkbox"]').check("Dental");
    cy.get(
      'textarea[name="program_specialBenefitsAvailabilityVariation"]'
    ).type("N/A");
    cy.get('input[name="program_enrollment"]').type("100");
    cy.get('textarea[name="program_enrollmentBenefitChanges"]').type(
      "Changes to enrollment"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Encounter Data Report
     * Additional Field Paths Tested:
     *    4 Checkboxes checked with no children
     */
    cy.get('input[name="program_encounterDataUses"]')
      .get('[type="checkbox"]')
      .check("Quality/performance measurement");
    cy.get(
      'input[name="program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria"]'
    )
      .get('[type="checkbox"]')
      .check("Timeliness of data corrections");
    cy.get(
      'input[name="program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria"]'
    )
      .get('[type="checkbox"]')
      .check("Timeliness of data certifications");
    cy.get(
      'input[name="program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria"]'
    )
      .get('[type="checkbox"]')
      .check("Use of correct file formats");
    cy.get(
      'input[name="program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria"]'
    )
      .get('[type="checkbox"]')
      .check("Provider ID field complete");
    cy.get(
      'textarea[name="program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation"]'
    ).type("References here");
    cy.get(
      'textarea[name="program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation"]'
    ).type("Financial penalties");
    cy.get('textarea[name="program_encounterDataQualityIncentives"]').type(
      "N/A"
    );
    cy.get(
      'textarea[name="program_encounterDataCollectionValidationBarriers"]'
    ).type("Barriers to collecting data");
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Appeals, State Fair Hearings & Grievances
     */
    cy.get('textarea[name="program_criticalIncidentDefinition"]').type("N/A");
    cy.get(
      'textarea[name="program_standardAppealTimelyResolutionDefinition"]'
    ).type("No longer than 30 calendar days");
    cy.get(
      'textarea[name="program_expeditedAppealTimelyResolutionDefinition"]'
    ).type("No longer than 72 hours");
    cy.get('textarea[name="program_grievanceTimelyResolutionDefinition"]').type(
      "Within 90 days"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Availability, Accessibility: Network Adequacy
     */
    cy.get('textarea[name="program_networkAdequacyChallenges"]').type(
      "Challenges here"
    );
    cy.get('textarea[name="program_networkAdequacyGapResponseEfforts"]').type(
      "Addressing the gaps"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Availability, Accessibility: Access Measures
     * Additional Field Paths Tested:
     *    Opening and Saving a Modal Drawer Modal
     *    Closing a Modal Drawer Modal
     *    Editting a Modal Drawer Modals Data (Radio And Textarea)
     *    Entering details to a Modal Drawer Component
     */
    cy.findByRole("button", { name: "Add access measure" }).click();
    cy.findByRole("button", { name: "Close" }).click();
    cy.findByRole("button", { name: "Add access measure" }).click();
    cy.get('[type="radio"]').check(
      "General quantitative availability and accessibility standard"
    );
    cy.get('textarea[name="accessMeasure_standardDescription"]').type(
      "Wait times"
    );
    cy.get('[type="radio"]').check("Appointment wait time");
    cy.get("button[type=submit]").contains("Save").click();

    cy.findByRole("button", { name: "Edit measure" }).click();
    cy.get('[type="radio"]').check(
      "LTSS-related standard: provider travels to the enrollee"
    );
    cy.get('textarea[name="accessMeasure_standardDescription"]').type(
      "Additional Information"
    );
    cy.get('[type="radio"]').check("Hours of operation");
    cy.get("button[type=submit]").contains("Save").click();

    cy.findByRole("button", { name: "Enter details" }).click();
    cy.get('[type="radio"]').check("Primary care");
    cy.get('[type="radio"]').check("Urban");
    cy.get('[type="radio"]').check("Pediatric");
    cy.get('input[name="accessMeasure_monitoringMethods"]')
      .get('[type="checkbox"]')
      .check("Geomapping");
    cy.get('[type="radio"]').check("Monthly");
    cy.get("button[type=submit]").contains("Save & Close").click();

    cy.findByRole("button", { name: "Continue" }).click();

    // Navigate to BSS
    cy.get('textarea[name="state_bssWebsite"]').type("websites here");
    cy.get('textarea[name="state_bssEntityServiceAccessibility"]').type(
      "In person, phone, email"
    );
    cy.get(
      'textarea[name="state_bssEntityLtssProgramDataIssueAssistance"]'
    ).type("Assistance here");
    cy.get('textarea[name="state_bssEntityPerformanceEvaluationMethods"]').type(
      "Performance evaluations"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    // Navigate to Program Integrity
    cy.get('[type="radio"]').check("Yes");
    cy.findByRole("button", { name: "Save & continue" }).click();

    /*
     * Navigate to Section D: Plan-Level Indicators / 1: Program Characteristics
     * Additional Field Paths Tested:
     *    Openning a Drawer Component
     *    Closing a Drawer Component
     *    Entering a long decimal in a numberfield masked by percentage
     *    Entering a long decimal in a numberfield masked by number
     */
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.findAllByRole("button", { name: "Cancel" }).click();
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.findAllByRole("button", { name: "Close" }).click();
    // Data for First Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_enrollment"]').type("123");
    cy.get('input[name="plan_medicaidEnrollmentSharePercentage"]').type(
      "10.251"
    );
    cy.get(
      'input[name="plan_medicaidManagedCareEnrollmentSharePercentage"]'
    ).type("5");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Financial Performance
     * Additional Field Paths Tested:
     *    Openning a Drawer Component
     *    Closing a Drawer Component
     *    Entering a long decimal in a numberfield masked by percentage
     *    Entering a long decimal in a numberfield masked by number
     */
    // Data for first Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_medicalLossRatioPercentage"]').type("123");
    cy.get('[type="radio"]').check("Program-specific regional");
    cy.get(
      'textarea[name="plan_populationSpecificMedicalLossRatioDescription"]'
    ).type("N/A");
    cy.get('[type="radio"]').check("Yes");
    cy.get('input[name="plan_medicalLossRatioReportingPeriodStartDate"]').type(
      "05142022"
    );
    cy.get('input[name="plan_medicalLossRatioReportingPeriodEndDate"]').type(
      "12142023"
    );
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Encounter Data Report
     * Additional Field Paths Tested:
     *    Clearing and Editting a Drawer Components Data
     */
    // Data for first Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get(
      'textarea[name="program_encounterDataSubmissionTimelinessStandardDefinition"]'
    ).type("N/A");
    cy.get(
      'input[name="plan_encounterDataSubmissionTimelinessCompliancePercentage"]'
    ).type("123");
    cy.get(
      'input[name="plan_encounterDataSubmissionHipaaCompliancePercentage"]'
    ).type("123");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Edit the data for a plan
    cy.findAllByRole("button", { name: "Edit" }).first().click();
    cy.get(
      'textarea[name="program_encounterDataSubmissionTimelinessStandardDefinition"]'
    )
      .clear()
      .type("New Data");
    cy.get(
      'input[name="plan_encounterDataSubmissionTimelinessCompliancePercentage"]'
    )
      .clear()
      .type("717");
    cy.get(
      'input[name="plan_encounterDataSubmissionHipaaCompliancePercentage"]'
    )
      .clear()
      .type("945");
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Appeals Overview
     * Enter Data for first Plan
     */
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_resolvedAppeals"]').type("123");
    cy.get('input[name="plan_activeAppeals"]').type("123");
    cy.get('input[name="plan_ltssUserFiledAppeals"]').type("123");
    cy.get(
      'input[name="plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal"]'
    ).type("123");
    cy.get('input[name="plan_timelyResolvedStandardAppeals"]').type("123");
    cy.get('input[name="plan_timelyResolvedExpeditedAppeals"]').type("123");
    cy.get(
      'input[name="plan_resolvedPreServiceAuthorizationDenialAppeals"]'
    ).type("123");
    cy.get(
      'input[name="plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals"]'
    ).type("123");
    cy.get(
      'input[name="plan_resolvedPostServiceAuthorizationDenialAppeals"]'
    ).type("123");
    cy.get('input[name="plan_resolvedServiceTimelinessAppeals"]').type("123");
    cy.get('input[name="plan_resolvedUntimelyResponseAppeals"]').type("123");
    cy.get(
      'input[name="plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals"]'
    ).type("123");
    cy.get(
      'input[name="plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals"]'
    ).type("123");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Appeals by Service
     * Additional Field Paths Tested:
     *    'N/A' for numberfield
     *    'Data not available' for numberfield
     */
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_resolvedGeneralInpatientServiceAppeals"]').type(
      "N/A"
    );
    cy.get('input[name="plan_resolvedGeneralOutpatientServiceAppeals"]').type(
      "Data not available"
    );
    cy.get(
      'input[name="plan_resolvedInpatientBehavioralHealthServiceAppeals"]'
    ).type("123");
    cy.get(
      'input[name="plan_resolvedOutpatientBehavioralHealthServiceAppeals"]'
    ).type("123");
    cy.get(
      'input[name="plan_resolvedCoveredOutpatientPrescriptionDrugAppeals"]'
    ).type("123");
    cy.get('input[name="plan_resolvedSnfServiceAppeals"]').type("123");
    cy.get('input[name="plan_resolvedLtssServiceAppeals"]').type("123");
    cy.get('input[name="plan_resolvedDentalServiceAppeals"]').type("123");
    cy.get('input[name="plan_resolvedNemtAppeals"]').type("123");
    cy.get('input[name="plan_resolvedOtherServiceAppeals"]').type("123");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to State Fair Hearings
     */
    // First plan data
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_stateFairHearingRequestsFiled"]').type(
      "123515151"
    );
    cy.get(
      'input[name="plan_stateFairHearingRequestsWithFavorableDecision"]'
    ).type("115");
    cy.get(
      'input[name="plan_stateFairHearingRequestsWithAdverseDecision"]'
    ).type("1");
    cy.get('input[name="plan_stateFairHearingRequestsRetracted"]').type("167");
    cy.get(
      'input[name="plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision"]'
    ).type("1111111");
    cy.get(
      'input[name="plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision"]'
    ).type("867");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Grievances Overview
     */
    // First plan data
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_resolvedGrievances"]').type("123515151");
    cy.get('input[name="plan_activeGrievances"]').type("115");
    cy.get('input[name="plan_ltssUserFieldGrievances"]').type("1");
    cy.get(
      'input[name="plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance"]'
    ).type("167");
    cy.get('input[name="plan_timyleResolvedGrievances"]').type("1111111");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Grievances By Service
     */
    // First plan data
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_resolvedGeneralInpatientServiceGrievances"]').type(
      "123515151"
    );
    cy.get(
      'input[name="plan_resolvedGeneralOutpatientServiceGrievances"]'
    ).type("115");
    cy.get(
      'input[name="plan_resolvedInpatientBehavioralHealthServiceGrievances"]'
    ).type("1");
    cy.get(
      'input[name="plan_resolvedOutpatientBehavioralHealthServiceGrievances"]'
    ).type("167");
    cy.get(
      'input[name="plan_resolvedCoveredOutpatientPrescriptionDrugGrievances"]'
    ).type("1111111");
    cy.get('input[name="plan_resolvedSnfServiceGrievances"]').type("123515151");
    cy.get('input[name="plan_resolvedLtssServiceGrievances"]').type("115");
    cy.get('input[name="plan_resolvedDentalServiceGrievances"]').type("1");
    cy.get('input[name="plan_resolvedNemtGrievances"]').type("123515151");
    cy.get('input[name="plan_resolvedOtherServiceGrievances"]').type("115");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Grievances By Reason
     */
    // First plan data
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_resolvedCustomerServiceGrievances"]').type("1");
    cy.get('input[name="plan_resolvedCareCaseManagementGrievances"]').type("2");
    cy.get('input[name="plan_resolvedAccessToCareGrievances"]').type("3");
    cy.get('input[name="plan_resolvedQualityOfCareGrievances"]').type("4");
    cy.get('input[name="plan_resolvedPlanCommunicationGrievances"]').type("5");
    cy.get('input[name="plan_resolvedPaymentBillingGrievances"]').type("6");
    cy.get('input[name="plan_resolvedSuspectedFraudGrievances"]').type("7");
    cy.get(
      'input[name="plan_resolvedAbuseNeglectExploitationGrievances"]'
    ).type("8");
    cy.get('input[name="plan_resolvedUntimelyResponseGrievances"]').type("9");
    cy.get('input[name="plan_resolvedDenialOfExpeditedAppealGrievances"]').type(
      "10"
    );
    cy.get('input[name="plan_resolvedOtherGrievances"]').type("11");
    cy.get("button[type=submit]").contains("Save & Close").click();
    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Quality Measures
     * Additional Field Paths Tested:
     *    Multiple Measures Created
     *    Edit Measures
     */

    // First measure created
    cy.findByRole("button", {
      name: "Add quality & performance measure",
    }).click();
    cy.get('input[name="qualityMeasure_domain"]')
      .get('[type="radio"]')
      .check("Dental and oral health services");
    cy.get('textarea[name="qualityMeasure_name"]').type("measure name");
    cy.get('input[name="qualityMeasure_nqfNumber"]').type("8675309");
    cy.get('input[name="qualityMeasure_reportingRateType"]')
      .get('[type="radio"]')
      .check("Program-specific rate");
    cy.get('input[name="qualityMeasure_set"]')
      .get('[type="radio"]')
      .check("HEDIS");
    cy.get('input[name="qualityMeasure_reportingPeriod"]')
      .get('[type="radio"]')
      .check("Yes");
    cy.get('textarea[name="qualityMeasure_description"]').type(
      "measure details"
    );
    cy.findByRole("button", { name: "Save" }).click();

    // Second measure created
    cy.findByRole("button", {
      name: "Add quality & performance measure",
    }).click();
    cy.get('input[name="qualityMeasure_domain"]')
      .get('[type="radio"]')
      .check("Maternal and perinatal health");
    cy.get('textarea[name="qualityMeasure_name"]')
      .clear()
      .type("Second Measure");
    cy.get('input[name="qualityMeasure_nqfNumber"]').clear().type("123456789");
    cy.get('input[name="qualityMeasure_reportingRateType"]')
      .get('[type="radio"]')
      .check("Cross-specific rate");
    cy.get(
      'textarea[name="qualityMeasure_crossProgramReportingRateProgramList"]'
    )
      .clear()
      .type("Program List, Second Program Name, Third Program Name");
    cy.get('input[name="qualityMeasure_set"]')
      .get('[type="radio"]')
      .check("Other, specify");
    cy.get('textarea[name="qualityMeasure_set-otherText"]')
      .clear()
      .type("Program List, Second Program Name, Third Program Name");
    cy.get('input[name="qualityMeasure_reportingPeriod"]')
      .get('[type="radio"]')
      .check("No");
    cy.get('input[name="qualityMeasure_reportingPeriodStartDate"]')
      .clear()
      .type("11/07/2022");
    cy.get('input[name="qualityMeasure_reportingPeriodEndDate"]')
      .clear()
      .type("12/21/2022");
    cy.get('textarea[name="qualityMeasure_description"]')
      .clear()
      .type("Additional Measure Details");
    cy.findByRole("button", { name: "Save" }).click();

    // Enter details for first measure
    cy.findAllByRole("button", { name: "Enter measure results" })
      .first()
      .click();
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(0)
      .type("N/A");
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(1)
      .type("123");
    cy.get("button[type=submit]").contains("Save & Close").click();

    // Edit details for first measure
    cy.findAllByRole("button", { name: "Edit measure results" })
      .first()
      .click();
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(0)
      .clear()
      .type("Data not available");
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(1)
      .clear()
      .type("456");

    // Enter details for second measure
    cy.findAllByRole("button", { name: "Enter measure results" })
      .first()
      .click();
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(0)
      .clear()
      .type("N/A");
    cy.get('input[name^="qualityMeasure_plan_measureResults"]')
      .eq(1)
      .clear()
      .type("123");
    cy.get("button[type=submit]").contains("Save & Close").click();

    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Sanctions
     * Additional Field Paths Tested:
     *    Dropdown Selectors
     *    Currency Mask
     */
    // First Sanction created
    cy.findByRole("button", { name: "Add sanction" }).click();
    cy.get('input[name="sanction_interventionType"]')
      .get('[type="radio"]')
      .check("Corrective action plan");
    cy.get('input[name="sanction_interventionTopic"]')
      .get('[type="radio"]')
      .check("Performance management");
    cy.get("select").select("Plan 1");
    cy.get('textarea[name="sanction_interventionReason"]').type("Reason here");
    cy.findByRole("button", { name: "Save" }).click();

    // Enter details for first Sanction
    cy.findAllByRole("button", { name: "Enter sanction details" })
      .first()
      .click();
    cy.get('input[name="sanction_noncomplianceInstances"]').type("12");
    cy.get('input[name="sanction_dollarAmount"]').type("2,000000");
    cy.get('input[name="sanction_assessmentDate"]').type("11/07/2022");
    cy.get('input[name="sanction_remediationDate"]').type("11/07/2022");
    cy.get('input[name="qualityMeasure_reportingPeriod"]')
      .get('[type="radio"]')
      .check("No");
    cy.get("button[type=submit]").contains("Save & Close").click();

    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Program Integrity
     */
    // First plan data
    cy.get("button").contains("Enter");
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('input[name="plan_dedicatedProgramIntegrityStaff"]').type("12");
    cy.get('input[name="plan_openedProgramIntegrityInvestigations"]').type(
      "12"
    );
    cy.get(
      'input[name="plan_programIntegrityInvestigationsToEnrolleesRatio"]'
    ).type("123:111515111");
    cy.get('input[name="plan_resolvedProgramIntegrityInvestigations"]').type(
      "12"
    );
    cy.get(
      'input[name="plan_resolvedProgramIntegrityInvestigationsToEnrolleesRatio"]'
    ).type("1:1");
    cy.get('input[name="plan_programIntegrityReferralPath"]')
      .get('[type="radio"]')
      .check("Makes referrals to the Medicaid Fraud Control Unit (MFCU) only");
    cy.get('input[name="plan_mfcuProgramIntegrityReferrals"]').type("12");
    cy.get(
      'input[name="plan_programIntegrityReferralsPerThousandBeneficiaries"]'
    ).type("12");
    cy.get(
      'input[name="name="plan_overpaymentRecoveryReportDescription""]'
    ).type("Report Description");
    cy.get('input[name="plan_beneficiaryCircumstanceChangeReportingFrequency"]')
      .get('[type="radio"]')
      .check("Daily");
    cy.get("button[type=submit]").contains("Save & Close").click();

    // Use same data for second Plan
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to BSS Entity Indicators
     */
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.get('[type="checkbox"]').check(
      "State Health Insurance Assistance Program (SHIP)"
    );
    cy.get('[type="checkbox"]').check("Enrollment Broker/Choice Counseling");

    // Use same data for second Plan
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    /*
     * Navigate to Review & Submit
     */
    cy.get("p").contains("Review & Submit").click();
    cy.location("pathname").should("match", /review-and-submit/);
    cy.get("button[type=submit]").contains("Submit MCPAR").click();
    cy.get("button[type=button]").contains("Submit MCPAR").click();
  });
});

describe("admin user enters a program", () => {
  it("enters the program and all inputs should be disabled", () => {
    // authenticate
    cy.visit("/");
    cy.authenticate("adminUser");
    cy.get("select").select("Massachusetts");
    cy.get("button[type=submit]").contains("Go to Report Dashboard").click();

    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get('input[name="stateName"]')
      .should("have.value", "Massachusetts")
      .should("be.disabled");
    cy.get('input[name="contactName"]')
      .should("have.value", "Random User")
      .should("be.disabled");
    cy.get('input[name="contactEmailAddress"]')
      .should("have.value", "test@test.com")
      .should("be.disabled");
    cy.findByRole("button", { name: "Continue" }).click();

    cy.get("button[type=button]").contains("Leave form").click();
    cy.location("pathname").should("match", /mcpar/);
  });
});
