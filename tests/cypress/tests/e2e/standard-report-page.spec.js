describe("state user enters a program", () => {
  it("enters data in the contact name and email fields", () => {
    //authenticate
    cy.visit("/");
    cy.authenticate("stateUser");
    cy.findByRole("button", { name: "Enter MCPAR online" }).click();
    cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();

    cy.findByRole("button", { name: "Add managed care program" }).click();

    cy.findByLabelText("Program name").type("program title");
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142023");
    cy.findByRole("checkbox").focus().click();
    cy.get("button[type=submit]").contains("Save").click();
    cy.reload();
    //enter program
    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get('input[name="stateName"]')
      .should("have.value", "Massachusetts")
      .should("be.disabled");
    cy.get('input[name="contactName"]').type("Random User");
    cy.get('input[name="contactEmailAddress"]').type("test@test.com");
    cy.get('input[name="submitterName"]').should("be.disabled");
    cy.get('input[name="submitterEmailAddress"]').should("be.disabled");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("cannot interact with data on Reporting Period page", () => {
    cy.get('input[name="reportingPeriodStartDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="reportingPeriodEndDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="programName"]')
      .should("have.value", "program title")
      .should("be.disabled");
  });

  it("adds plans", () => {
    cy.get("p").contains("Add Plans").click();
    cy.get('input[name="plans[0]"]').type("Plan 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="plans[1]"]').type("Plan 2");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("add entities", () => {
    cy.findByLabelText("BSS entity name");
    cy.get('input[name="bssEntities[0]"]').type("Entity 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="bssEntities[1]"]').type("Entity 2");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("fills out B: State-Level Indicators", () => {
    cy.get('input[name="state_statewideMedicaidEnrollment"]').type("1020");
    cy.get('input[name="state_statewideMedicaidManagedCareEnrollment"]').type(
      "1000"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();

    cy.get('[type="checkbox"]').check("State actuaries");
    cy.findByRole("button", { name: "Save & continue" }).click();

    cy.get(
      'textarea[name="state_focusedProgramIntegrityActivitiesConducted"]'
    ).type("nothing to note");
    cy.get('[type="radio"]').check("Allow plans to retain overpayments");
    cy.get(
      'textarea[name="state_overpaymentStandardContractLanguageLocation"]'
    ).type("In plan details");
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
      .check("No");
    cy.get('input[name="state_ownershipControlDisclosureWebsite"]')
      .get('[type="radio"]')
      .check("No");
    cy.get('textarea[name="state_submittedDataAuditResults"]').type(
      "https://www.auditwebsite.com"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("fills out section C", () => {
    cy.get('input[name="program_contractTitle"]').type("Contract Title");
    cy.get('input[name="program_contractDate"]').type("07142023");
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
    //III
    cy.get('input[name="program_encounterDataUses"]')
      .get('[type="checkbox"]')
      .check("Quality/performance measurement");
    cy.get('input[name="program_encounterDataUses"]')
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

    //IV
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

    //V
    cy.get('textarea[name="program_networkAdequacyChallenges"]').type(
      "Challenges here"
    );
    cy.get('textarea[name="program_networkAdequacyGapResponseEfforts"]').type(
      "Addressing the gaps"
    );
    cy.findByRole("button", { name: "Save & continue" }).click();
    cy.findByRole("button", { name: "Add access measure" }).click();
    cy.get('[type="radio"]').check(
      "General quantitative availability and accessibility standard"
    );
    cy.get('textarea[name="accessMeasure_standardDescription"]').type(
      "Wait times"
    );
    cy.get('[type="radio"]').check("Appointment wait time");
    cy.get("button[type=submit]").contains("Save").click();
    cy.findByRole("button", { name: "Continue" }).click();

    //IX
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

    //X
    cy.get('[type="radio"]').check("Yes");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("Fills out Section D", () => {
    // running into a problem here, the plans I created don't show up here
    cy.findByRole("button", { name: "Enter details" }).click();
    cy.get('[type="radio"]').check("Primary care");
    cy.get('[type="radio"]').check("Urban");
    cy.get('[type="radio"]').check("Adult and pediatric");
    cy.get('[type="checkbox"]').check("Geomapping");
    cy.get('[type="checkbox"]').check("Review of grievances related to access");
    cy.get('[type="radio"]').check("Quarterly");
    cy.get("button[type=submit]").contains("Save & Close").click();
    cy.findByRole("button", { name: "Continue" }).click();

    cy.get("button").contains("Enter");
    cy.findAllByRole("button", { name: "Enter" }).first().click();
    cy.findAllByRole("button", { name: "Cancel" }).click();
    cy.findByRole("button", { name: "Continue" }).click();
  });

  it("submits the program", () => {
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
