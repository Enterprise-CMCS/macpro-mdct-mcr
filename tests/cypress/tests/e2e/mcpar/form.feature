Feature: MCPAR E2E Form Submission

    Scenario Outline: A State user creates a program
        Given I am logged in as a state user
        And I am on "/mcpar"

        When I click the "Add managed care program" button
        And these form elements are filled:
            | programName              | text           | <title>        |
            | reportingPeriodStartDate | text           | <startDate>    |
            | reportingPeriodEndDate   | text           | <endDate>      |
            | combinedData             | singleCheckbox | <combinedData> |
        And I click the "Save" button
        Then there is an active program

        Examples: #Form Data
            | title        | startDate  | endDate    | combinedData |
            | Test Program | 07/11/2022 | 11/07/2026 | true         |

    Scenario: Fills out Section A: Program Information
        Given I am on "/mcpar"
        And I click the "Enter" button
        Then the "/mcpar/program-information/point-of-contact" page is loaded

        When these form elements are filled:
            | contactName         | text | Mary Poppins                              |
            | contactEmailAddress | text | aspoonfullofsuger@themedicinegoesdown.com |
        And these form elements are prefilled and disabled:
            | stateName | text | Minnesota |
        And I click the "Save & continue" button

        Then the "/mcpar/program-information/reporting-period" page is loaded

# Scenario: Fills out Section A: Reporting Period
#     Given I am on "/mcpar/program-information/reporting-period"

#     When these form elements are prefilled and disabled:
#         | reportingPeriodStartDate | text | 07/11/2022   |
#         | reportingPeriodEndDate   | text | 11/07/2026   |
#         | programName              | text | Test Program |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-information/reporting-period" page is loaded

# Scenario: Fills out Section A: Add Plans
#     Given I am on "/mcpar/program-information/add-plans"

#     When these form elements are filled:
#         | plans[0] | text | First Plan |
#     And I click the "Add a row" button
#     And these form elements are filled:
#         | plans[1] | text | Second Plan |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-information/add-bss-entities" page is loaded

# Scenario: Fills out Section A: Add BSS Entities
#     Given I am on "/mcpar/program-information/add-bss-entities"

#     When these form elements are filled:
#         | bssEntities[0] | text | First Entity |
#     And I click the "Add a row" button
#     And these form elements are filled:
#         | bssEntities[1] | text | Second Entity |

#     And I click the "Save & continue" button

#     Then the "/mcpar/state-level-indicators/program-characteristics" page is loaded

# Scenario: Fills out Section B: State Level Indicators/Program Characteristics
#     Given I am on "/mcpar/state-level-indicators/program-characteristics"

#     When these form elements are filled:
#         | state_statewideMedicaidEnrollment            | text | 1020   |
#         | state_statewideMedicaidManagedCareEnrollment | text | 151512 |

#     And I click the "Save & continue" button

#     Then the "/mcpar/state-level-indicators/encounter-data-report" page is loaded

# Scenario: Fills out Section B: Encounter Data Report
#     Given I am on "/mcpar/state-level-indicators/encounter-data-report"

#     When these form elements are filled:
#         | state_encounterDataValidationEntity                | checkbox | State Medicaid agency staff                                   |
#         | state_encounterDataValidationEntity                | checkbox | Other state agency staff                                      |
#         | state_encounterDataValidationEntity                | checkbox | State actuaries                                               |
#         | state_encounterDataValidationEntity                | checkbox | EQRO                                                          |
#         | state_encounterDataValidationEntity                | checkbox | Other third-party vendor                                      |
#         | state_encounterDataValidationEntity                | checkbox | Proprietary system(s)                                         |
#         | state_encounterDataValidationSystemHipaaCompliance | radio    | Yes                                                           |
#         | state_encounterDataValidationEntity                | checkbox | Other, specify                                                |
#         | state_encounterDataValidationEntity-otherText      | text     | Textarea that can be filled and entered due to checking Other |

#     And I click the "Save & continue" button

#     Then the "/mcpar/state-level-indicators/program-integrity" page is loaded

# Scenario: Fills out Section B: Program Integrity
#     Given I am on "/mcpar/state-level-indicators/program-integrity"

#     When these form elements are filled:
#         | state_focusedProgramIntegrityActivitiesConducted               | text  | 1234124123123198237192 1231231      |
#         | state_overpaymentStandard                                      | radio | Allow plans to retain overpayments  |
#         | state_overpaymentStandardContractLanguageLocation              | text  | !@#$%!@*%#!%_!@#123:ASBAC           |
#         | state_overpaymentStandardDescription                           | text  | State returns payments              |
#         | state_overpaymentReportingMonitoringEfforts                    | text  | State tracks compliance             |
#         | state_beneficiaryCircumstanceChangeReconciliationEfforts       | text  | State team dedicated to these cases |
#         | state_providerTerminationReportingMonitoringEfforts            | radio | Yes                                 |
#         | state_providerTerminationReportingMonitoringMetrics            | radio | Yes                                 |
#         | state_providerTerminationReportingMonitoringMetricsDescription | text  | metric here                         |
#         | state_excludedEntityIdentifiedInFederalDatabaseCheck           | radio | Yes                                 |
#         | state_excludedEntityIdentificationInstancesSummary             | text  | Instances                           |
#         | state_ownershipControlDisclosureWebsite                        | radio | Yes                                 |
#         | state_ownershipControlDisclosureWebsiteLink                    | text  | https://www.auditwebsite.com        |
#         | state_submittedDataAuditResults                                | text  | Audit Results findings              |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/program-characteristics" page is loaded

# Scenario: Fills out Section C: Program Characteristics
#     Given I am on "/mcpar/program-level-indicators/program-characteristics"

#     When these form elements are filled:
#         | program_contractTitle                        | text     | Contract Title              |
#         | program_contractDate                         | text     | 07/14/2023                  |
#         | program_contractUrl                          | text     | https://www.contracturl.com |
#         | program_type                                 | radio    | Other, specify              |
#         | program_type-otherText                       | text     | Generic MCP here            |
#         | program_coveredSpecialBenefits               | checkbox | Dental                      |
#         | program_specialBenefitsAvailabilityVariation | text     | N/A                         |
#         | program_enrollment                           | text     | 100                         |
#         | program_enrollmentBenefitChanges             | text     | Changes to enrollment       |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/encounter-data-report" page is loaded

# Scenario: Fills out Section C: Encounter Data Report
#     Given I am on "/mcpar/program-level-indicators/encounter-data-report"

#     When these form elements are filled:
#         | program_encounterDataUses                                                                      | checkbox | Quality/performance measurement   |
#         | program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria                         | checkbox | Timeliness of data corrections    |
#         | program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria                         | checkbox | Timeliness of data certifications |
#         | program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria                         | checkbox | Use of correct file formats       |
#         | program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteria                         | checkbox | Provider ID field complete        |
#         | program_encounterDataSubmissionCorrectionPerformanceEvaluationCriteriaContractLanguageLocation | text     | References Here                   |
#         | program_encounterDataSubmissionQualityFinancialPenaltiesContractLanguageLocation               | text     | Financial Penalties               |
#         | program_encounterDataQualityIncentives                                                         | text     | N/A                               |
#         | program_encounterDataCollectionValidationBarriers                                              | text     | Barriers to collecting data       |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/appeals-state-fair-hearings-and-grievances" page is loaded

# Scenario: Fills out Section C: Appeals, State Fair Hearings & Grievances
#     Given I am on "/mcpar/program-level-indicators/appeals-state-fair-hearings-and-grievances"

#     When these form elements are filled:
#         | program_criticalIncidentDefinition                | text | Data not available              |
#         | program_standardAppealTimelyResolutionDefinition  | text | No longer then 30 calendar days |
#         | program_expeditedAppealTimelyResolutionDefinition | text | No longer then 72 hours         |
#         | program_grievanceTimelyResolutionDefinition       | text | Within 90 days                  |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/availability-and-accessibility/network-adequacy" page is loaded

# Scenario: Fills out Section C: Availability, Accessibility: Network Adequacy
#     Given I am on "/mcpar/program-level-indicators/availability-and-accessibility/network-adequacy"

#     When these form elements are filled:
#         | program_networkAdequacyChallenges         | text | 1 |
#         | program_networkAdequacyGapResponseEfforts | text | 2 |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/availability-and-accessibility/access-measures" page is loaded

# Scenario Outline: Fills out Section C: Availability, Accessibility: Access Measures - Create multiple measures
#     Given I am on "/mcpar/program-level-indicators/availability-and-accessibility/access-measures"

#     When I click the "Add access measure" button
#     And these form elements are filled:
#         | accessMeasure_generalCategory     | radio | <category>    |
#         | accessMeasure_standardDescription | text  | <description> |
#         | accessMeasure_standardType        | radio | <type>        |

#     And I click the "Save" button

#     Then the access measure "<category>", "<description>", and "<type>" is created

#     Examples: #Access Measure Data
#         | category                                                     | description            | type                  |
#         | General quantitative availability and accessibility standard | Wait times             | Appointment wait time |
#         | LTSS-related standard: provider travels to the enrollee      | Additional Information | Hours of operation    |


# Scenario Outline: Fills out Section C: Availability, Accessibility: Access Measures - Edit a measure
#     Given I am on "/mcpar/program-level-indicators/availability-and-accessibility/access-measures"
#     And there are "2" "access measures"
#     And I click the "Edit measure" button

#     When these form elements are edited:
#         | accessMeasure_generalCategory     | radio | <category>    |
#         | accessMeasure_standardDescription | text  | <description> |
#         | accessMeasure_standardType        | radio | <type>        |

#     And I click the "Save" button

#     Then the access measure "<category>", "<description>", and "<type>" is created
#     And there are "2" "access measures"

#     Examples: #Access Measure Data
#         | category                                  | description    | type                  |
#         | Exceptions to time and distance standards | Time Exception | Appointment wait time |

# Scenario Outline: Fills out Section C: Availability, Accessibility: Access Measures - Measure Details
#     Given I am on "/mcpar/program-level-indicators/availability-and-accessibility/access-measures"
#     And I click the "Enter details" button

#     When these form elements are filled:
#         | accessMeasure_providerType             | radio    | <type>       |
#         | accessMeasure_applicableRegion         | radio    | <region>     |
#         | accessMeasure_population               | radio    | <population> |
#         | accessMeasure_monitoringMethods        | checkbox | <method>     |
#         | accessMeasure_oversightMethodFrequency | radio    | <frequency>  |

#     And I click the "Save & Close" button

#     Then the access measure is completed with "<type>", "<region>", "<population>", "<method>", and "<frequency>"

#     Examples: #Access Measure Details Data
#         | type         | region | population | method            | frequency |
#         | Primary care | Urban  | Pediatric  | Geomapping        | Monthly   |
#         | Hospital     | Rural  | MLTSS      | EVV data analysis | Annually  |

# Scenario Outline: Fills out Section C: Availability, Accessibility: Access Measures - Edit Measure Details
#     Given I am on "/mcpar/program-level-indicators/availability-and-accessibility/access-measures"
#     And there are "2" "access measures"
#     And I click the "Edit details" button

#     When these form elements are edited:
#         | accessMeasure_providerType             | radio    | <type>       |
#         | accessMeasure_applicableRegion         | radio    | <region>     |
#         | accessMeasure_population               | radio    | <population> |
#         | accessMeasure_monitoringMethods        | checkbox | <method>     |
#         | accessMeasure_oversightMethodFrequency | radio    | <frequency>  |

#     And I click the "Save & Close" button

#     Then the access measure is completed with "<type>", "<region>", "<population>", "<method>", and "<frequency>"
#     And there are "2" "access measures"
#     And I click the "Continue" button

#     Then the "/mcpar/program-level-indicators/bss" page is loaded

#     Examples: #Access Measure Details Data
#         | type              | region         | population | method               | frequency |
#         | Behavioral health | Large counties | Adult      | Secret shopper calls | Quarterly |

# Scenario: Fills out Section C: BSS
#     Given I am on "/mcpar/program-level-indicators/bss"

#     When these form elements are filled:
#         | state_bssWebsite                              | text | websites here           |
#         | state_bssEntityServiceAccessibility           | text | In person, phone, email |
#         | state_bssEntityLtssProgramDataIssueAssistance | text | Assistance here         |
#         | state_bssEntityPerformanceEvaluationMethods   | text | Performance evaluations |

#     And I click the "Save & continue" button

#     Then the "/mcpar/program-level-indicators/program-integrity" page is loaded

# Scenario: Fills out Section C: Program Integrity
#     Given I am on "/mcpar/program-level-indicators/program-integrity"

#     When these form elements are filled:
#         | program_prohibitedAffiliationDisclosure | radio | Yes |

#     And I click the "Save & continue" button

#     Then the "/mcpar/plan-level-indicators/program-characteristics" page is loaded

# Scenario: Fills out Section D: Program Characteristics - Entering Data
#     Given I am on "/mcpar/plan-level-indicators/program-characteristics"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_enrollment                                   | text | 123    |
#         | plan_medicaidEnrollmentSharePercentage            | text | 10.251 |
#         | plan_medicaidManagedCareEnrollmentSharePercentage | text | 5      |
#     And I click the "Save & Close" button

# Scenario: Fills out Section D: Program Characteristics - Editing Data
#     Given I am on "/mcpar/plan-level-indicators/program-characteristics"

#     When I click the "Edit" button
#     And these form elements are filled:
#         | plan_enrollment                                   | text | 456 |
#         | plan_medicaidEnrollmentSharePercentage            | text | 789 |
#         | plan_medicaidManagedCareEnrollmentSharePercentage | text | 42  |
#     And I click the "Save & Close" button
#     Then I have completed "1" drawer reports

# Scenario: Fills out Section D: Program Characteristics - Enter Additional Data
#     Given I am on "/mcpar/plan-level-indicators/program-characteristics"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_enrollment                                   | text | 123    |
#         | plan_medicaidEnrollmentSharePercentage            | text | 10.251 |
#         | plan_medicaidManagedCareEnrollmentSharePercentage | text | 5      |
#     And I click the "Save & Close" button

#     Then I have completed "2" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/financial-performance" page is loaded

# Scenario Outline: Fills out Section D: Financial Performance
#     Given I am on "/mcpar/plan-level-indicators/financial-performance"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_medicalLossRatioPercentage                           | text  | <percentage>    |
#         | plan_medicalLossRatioPercentageAggregationLevel           | radio | <aggLevel>      |
#         | plan_medicalLossRatioPercentageAggregationLevel-otherText | text  | <aggLevelOther> |
#         | plan_populationSpecificMedicalLossRatioDescription        | text  | <description>   |
#         | plan_medicalLossRatioReportingPeriod                      | radio | <period>        |
#         | plan_medicalLossRatioReportingPeriodStartDate             | text  | <startDate>     |
#         | plan_medicalLossRatioReportingPeriodEndDate               | text  | <endDate>       |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/encounter-data-report" page is loaded

#     Examples: #Financial Performance Data
#         | percentage | aggLevel       | aggLevelOther               | description     | period | startDate  | endDate    |
#         | 100        | Other, specify | Other Levels of aggregation | MLD Description | Yes    | 12/14/2022 | 12/15/2022 |


# Scenario: Fills out Section D: Encounter Data Report
#     Given I am on "/mcpar/plan-level-indicators/encounter-data-report"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | program_encounterDataSubmissionTimelinessStandardDefinition | text | N/A |
#         | plan_encounterDataSubmissionTimelinessCompliancePercentage  | text | 123 |
#         | plan_encounterDataSubmissionHipaaCompliancePercentage       | text | 123 |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview" page is loaded

# Scenario: Fills out Section D: Appeals Overview
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_resolvedAppeals                                                            | text | N/A |
#         | plan_activeAppeals                                                              | text | 123 |
#         | plan_ltssUserFiledAppeals                                                       | text | 123 |
#         | plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal                    | text | 123 |
#         | plan_timelyResolvedStandardAppeals                                              | text | 123 |
#         | plan_timelyResolvedExpeditedAppeals                                             | text | 123 |
#         | plan_resolvedPreServiceAuthorizationDenialAppeals                               | text | 123 |
#         | plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals | text | 123 |
#         | plan_resolvedPostServiceAuthorizationDenialAppeals                              | text | 123 |
#         | plan_resolvedServiceTimelinessAppeals                                           | text | 123 |
#         | plan_resolvedUntimelyResponseAppeals                                            | text | 123 |
#         | plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals                        | text | 123 |
#         | plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals                    | text | 123 |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-service" page is loaded

# Scenario: Fills out Section D: Appeals By Service
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-service"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_resolvedGeneralInpatientServiceAppeals           | text | N/A                |
#         | plan_resolvedGeneralOutpatientServiceAppeals          | text | Data not available |
#         | plan_resolvedInpatientBehavioralHealthServiceAppeals  | text | 1                  |
#         | plan_resolvedOutpatientBehavioralHealthServiceAppeals | text | 1                  |
#         | plan_resolvedCoveredOutpatientPrescriptionDrugAppeals | text | 1                  |
#         | plan_resolvedSnfServiceAppeals                        | text | 1                  |
#         | plan_resolvedLtssServiceAppeals                       | text | 1                  |
#         | plan_resolvedDentalServiceAppeals                     | text | 1                  |
#         | plan_resolvedNemtAppeals                              | text | 1                  |
#         | plan_resolvedOtherServiceAppeals                      | text | 1                  |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/state-fair-hearings" page is loaded

# Scenario: Fills out Section D: State Fair Hearings
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/state-fair-hearings"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_stateFairHearingRequestsFiled                                          | text | N/A                |
#         | plan_stateFairHearingRequestsWithFavorableDecision                          | text | Data not available |
#         | plan_stateFairHearingRequestsWithAdverseDecision                            | text | 1                  |
#         | plan_stateFairHearingRequestsRetracted                                      | text | 1                  |
#         | plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision | text | 1                  |
#         | plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision   | text | 1                  |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview" page is loaded

# Scenario: Fills out Section D: Grievances Overview
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_resolvedGrievances                                         | text | N/A                |
#         | plan_activeGrievances                                           | text | Data not available |
#         | plan_ltssUserFieldGrievances                                    | text | 1                  |
#         | plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance | text | 1                  |
#         | plan_timyleResolvedGrievances                                   | text | 1                  |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-service" page is loaded

# Scenario: Fills out Section D: Grievances By Service
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-service"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_resolvedGeneralInpatientServiceGrievances           | text | N/A                |
#         | plan_resolvedGeneralOutpatientServiceGrievances          | text | Data not available |
#         | plan_resolvedInpatientBehavioralHealthServiceGrievances  | text | 1                  |
#         | plan_resolvedOutpatientBehavioralHealthServiceGrievances | text | 2                  |
#         | plan_resolvedCoveredOutpatientPrescriptionDrugGrievances | text | 3                  |
#         | plan_resolvedSnfServiceGrievances                        | text | 4                  |
#         | plan_resolvedLtssServiceGrievances                       | text | 5                  |
#         | plan_resolvedDentalServiceGrievances                     | text | 6                  |
#         | plan_resolvedNemtGrievances                              | text | 7                  |
#         | plan_resolvedOtherServiceGrievances                      | text | 8                  |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-reason" page is loaded

# Scenario: Fills out Section D: Grievances By Reason
#     Given I am on "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-reason"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_resolvedCustomerServiceGrievances          | text | N/A                |
#         | plan_resolvedCareCaseManagementGrievances       | text | Data not available |
#         | plan_resolvedAccessToCareGrievances             | text | 1                  |
#         | plan_resolvedQualityOfCareGrievances            | text | 2                  |
#         | plan_resolvedPlanCommunicationGrievances        | text | 3                  |
#         | plan_resolvedPaymentBillingGrievances           | text | 4                  |
#         | plan_resolvedSuspectedFraudGrievances           | text | 5                  |
#         | plan_resolvedAbuseNeglectExploitationGrievances | text | 6                  |
#         | plan_resolvedUntimelyResponseGrievances         | text | 7                  |
#         | plan_resolvedDenialOfExpeditedAppealGrievances  | text | 8                  |
#         | plan_resolvedOtherGrievances                    | text | 9                  |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/quality-measures" page is loaded


# Scenario Outline: Fills out Section D: Quality & Performance Measures - Create multiple measures
#     Given I am on "/mcpar/plan-level-indicators/quality-measures"

#     When I click the "Add quality & performance measure" button
#     And these form elements are filled:
#         | qualityMeasure_domain            | radio | <domain>      |
#         | qualityMeasure_name              | text  | <name>        |
#         | qualityMeasure_nqfNumber         | text  | <nqfNumber>   |
#         | qualityMeasure_reportingRateType | radio | <type>        |
#         | qualityMeasure_set               | radio | <set>         |
#         | qualityMeasure_reportingPeriod   | radio | <period>      |
#         | qualityMeasure_description       | text  | <description> |

#     And I click the "Save" button

#     Then the access measure "<domain>", "<name>", and "<nqfNumber>" is created

#     Examples: #Quality Measure Data
#         | domain                          | name           | nqfNumber | type                  | set   | period | description        |
#         | Dental and oral health services | measure name   | 8675309   | Program-specific rate | HEDIS | Yes    | Details            |
#         | Maternal and perinatal health   | Second Measure | 123456789 | Program-specific rate | HEDIS | Yes    | Additional Details |


# Scenario Outline: Fills out Section D: Quality & Performance Measures - Edit a measure
#     Given I am on "/mcpar/plan-level-indicators/quality-measures"
#     And there are "2" "quality measures"
#     And I click the "Edit measure" button

#     When these form elements are edited:
#         | qualityMeasure_domain            | radio | <domain>      |
#         | qualityMeasure_name              | text  | <name>        |
#         | qualityMeasure_nqfNumber         | text  | <nqfNumber>   |
#         | qualityMeasure_reportingRateType | radio | <type>        |
#         | qualityMeasure_set               | radio | <set>         |
#         | qualityMeasure_reportingPeriod   | radio | <period>      |
#         | qualityMeasure_description       | text  | <description> |

#     And I click the "Save" button

#     Then the access measure "<domain>", "<name>", and "<nqfNumber>" is created
#     And there are "2" "quality measures"

#     Examples: #Quality Measure Edited Data
#         | domain                 | name        | nqfNumber | type                  | set   | period | description    |
#         | Behavioral health care | Edited Name | 21        | Program-specific rate | HEDIS | Yes    | Edited Details |

# Scenario Outline: Fills out Section D: Quality & Performance Measures - Measure Details
#     Given I am on "/mcpar/plan-level-indicators/quality-measures"
#     And I click the "Enter measure results" button

#     When these form elements are filled:
#         | qualityMeasure_plan_measureResults | repeated | <resultOne> | 0 |
#         | qualityMeasure_plan_measureResults | repeated | <resultTwo> | 1 |

#     And I click the "Save & Close" button

#     Then the quality measure is completed with "<resultOne>" and "<resultTwo>"

#     Examples: #Quality Measure Details Data
#         | resultOne  | resultTwo         |
#         | Detail One | More details      |
#         | Detail Two | Even more details |

# Scenario Outline: Fills out Section D: Quality & Performance Measures - Edit Measure Details
#     Given I am on "/mcpar/plan-level-indicators/quality-measures"
#     And there are "2" "quality measures"
#     And I click the "Edit measure results" button

#     When these form elements are edited:
#         | qualityMeasure_plan_measureResults | repeated | <resultOne> | 0 |
#         | qualityMeasure_plan_measureResults | repeated | <resultTwo> | 1 |

#     And I click the "Save & Close" button

#     Then the quality measure is completed with "<resultOne>" and "<resultTwo>"
#     And there are "2" "quality measures"

#     Then I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/sanctions" page is loaded

#     Examples: #Quality Measure Edited Data
#         | resultOne       | resultTwo                                           |
#         | Changed Details | Its getting ridiculous how many details are changed |

# Scenario Outline: Fills out Section D: Sanctions - Create multiple measures
#     Given I am on "/mcpar/plan-level-indicators/sanctions"

#     When I click the "Add sanction" button
#     And these form elements are filled:
#         | sanction_interventionType   | radio    | <type>   |
#         | sanction_interventionTopic  | radio    | <topic>  |
#         | sanction_planName           | dropdown | <plan>   |
#         | sanction_interventionReason | text     | <reason> |

#     And I click the "Save" button

#     Then the sanction "<type>" and "<plan>" is created

#     Examples: #Sanctions Measure Data
#         | type                   | topic                  | plan        | reason               |
#         | Corrective action plan | Performance management | First Plan  | These are my reasons |
#         | Fine                   | Reporting              | Second Plan | They are many        |


# Scenario Outline: Fills out Section D: Sanctions - Edit a measure
#     Given I am on "/mcpar/plan-level-indicators/sanctions"
#     And there are "2" "sanctions"
#     And I click the "Edit sanction" button

#     When these form elements are edited:
#         | sanction_interventionType   | radio    | <type>   |
#         | sanction_interventionTopic  | radio    | <topic>  |
#         | sanction_planName           | dropdown | <plan>   |
#         | sanction_interventionReason | text     | <reason> |

#     And I click the "Save" button

#     Then the sanction "<type>" and "<plan>" is created
#     And there are "2" "sanctions"

#     Examples: #Sanctions Edited Data
#         | type              | topic          | plan        | reason                                |
#         | Compliance letter | Excess charges | Second Plan | Many are there just so gosh darn many |

# Scenario Outline: Fills out Section D: Sanctions - Measure Details
#     Given I am on "/mcpar/plan-level-indicators/sanctions"
#     And I click the "Enter sanction details" button

#     When these form elements are filled:
#         | sanction_noncomplianceInstances | text  | <instances>      |
#         | sanction_dollarAmount           | text  | <amount>         |
#         | sanction_assessmentDate         | text  | <dateAssessed>   |
#         | sanction_remediationCompleted   | radio | <remedCompleted> |
#         | sanction_remediationDate        | text  | <remedDate>      |
#         | sanction_correctiveActionPlan   | radio | <actionPlan>     |

#     And I click the "Save & Close" button

#     Then the sanction is completed with "<instances>", "<amount>", "<dateAssessed>", "<remedDate>", and "<actionPlan>"

#     Examples: #Sanctions Details Data
#         | instances | amount | dateAssessed | remedCompleted | remedDate  | actionPlan |
#         | 1         | 1,109  | 04/05/2022   | Yes            | 05/06/2022 | No         |
#         | 2         | 1,776  | 04/05/2022   | Yes            | 05/06/2022 | No         |

# Scenario Outline: Fills out Section D: Sanctions - Edit Measure Details
#     Given I am on "/mcpar/plan-level-indicators/sanctions"
#     And there are "2" "sanctions"
#     And I click the "Edit sanction details" button

#     When these form elements are edited:
#         | sanction_noncomplianceInstances | text  | <instances>      |
#         | sanction_dollarAmount           | text  | <amount>         |
#         | sanction_assessmentDate         | text  | <dateAssessed>   |
#         | sanction_remediationCompleted   | radio | <remedCompleted> |
#         | sanction_remediationDate        | text  | <remedDate>      |
#         | sanction_correctiveActionPlan   | radio | <actionPlan>     |

#     And I click the "Save & Close" button

#     Then the sanction is completed with "<instances>", "<amount>", "<dateAssessed>", "<remedDate>", and "<actionPlan>"
#     And there are "2" "sanctions"

#     Then I click the "Continue" button
#     And the "/mcpar/plan-level-indicators/program-integrity" page is loaded

#     Examples: #Sanctions Edited Data
#         | instances | amount | dateAssessed | remedCompleted | remedDate  | actionPlan |
#         | 3         | 911    | 08/05/2022   | Yes            | 09/06/2022 | Yes        |

# Scenario: Fills out Section D: Program Integrity
#     Given I am on "/mcpar/plan-level-indicators/program-integrity"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | plan_dedicatedProgramIntegrityStaff                         | text  | N/A                                                            |
#         | plan_openedProgramIntegrityInvestigations                   | text  | Data not available                                             |
#         | plan_programIntegrityInvestigationsToEnrolleesRatio         | text  | 123:111515111                                                  |
#         | plan_resolvedProgramIntegrityInvestigations                 | text  | 46                                                             |
#         | plan_resolvedProgramIntegrityInvestigationsToEnrolleesRatio | text  | 1:1                                                            |
#         | plan_programIntegrityReferralPath                           | radio | Makes referrals to the Medicaid Fraud Control Unit (MFCU) only |
#         | plan_mfcuProgramIntegrityReferrals                          | text  | 12                                                             |
#         | plan_programIntegrityReferralsPerThousandBeneficiaries      | text  | 121                                                            |
#         | plan_overpaymentRecoveryReportDescription                   | text  | Report Description                                             |
#         | plan_beneficiaryCircumstanceChangeReportingFrequency        | radio | Daily                                                          |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/bss-entity-indicators" page is loaded

# Scenario: Fills out Section E: BSS Entity Indicators
#     Given I am on "/mcpar/bss-entity-indicators"

#     When I click the "Enter" button
#     And these form elements are filled:
#         | bssEntity_entityType | checkbox | State Health Insurance Assistance Program (SHIP) |
#         | bssEntity_entityRole | checkbox | Enrollment Broker/Choice Counseling              |
#     And I click the "Save & Close" button

#     Then I have completed "1" drawer reports
#     And I click the "Continue" button
#     And the "/mcpar/review-and-submit" page is loaded

# Scenario: Submits the Form
#     Given I am on "/mcpar/review-and-submit"

#     When I click the "Submit MCPAR" button
#     And I click the "Submit MCPAR" button

#     Then the "/mcpar/review-and-submit" page is loaded
#     And the page shows "Successfully Submitted"

# Scenario: Submission shows on dashboard
#     Given I am on "/mcpar/review-and-submit"

#     When I click the "Leave form" button
#     And I visit "/mcpar"

#     Then the page shows "Submitted"


# Scenario: Admin user archives the program
#     Given I am logged in as an admin user
#     And I am on "/mcpar"
#     And these form elements are filled:
#         | state | dropdown | Minnesota |

#     When I click the "Go to Report Dashboard" button
#     And I click the "Archive" button
#     Then the program is archived


