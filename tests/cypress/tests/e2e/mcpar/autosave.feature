Feature: Autosave

    Scenario: Create Form and Autosave
        Given I am logged in as a state user
        And I am on "/mcpar"

        When I click the "Add managed care program" button
        And these form elements are filled:
            | programName              | text | Autosave Test |
            | reportingPeriodStartDate | text | 07/11/2022    |
            | reportingPeriodEndDate   | text | 11/07/2026    |
        And I click the "Save" button
        Then there is an "Autosave Test" program

        Given I click the "Enter" button

        Then the "/mcpar/program-information/point-of-contact" page is loaded
        And I wait 1000 milliseconds between inputs
        When I visit "/mcpar/program-level-indicators/program-characteristics"
        When these form elements are filled:
            | program_contractTitle                        | text     | Contract Title              |
            | program_contractDate                         | text     | 07142023                    |
            | program_contractUrl                          | text     | https://www.contracturl.com |
            | program_type                                 | radio    | Other, specify              |
            | program_type-otherText                       | text     | Generic MCP here            |
            | program_coveredSpecialBenefits               | checkbox | Dental                      |
            | program_specialBenefitsAvailabilityVariation | text     | N/A                         |
            | program_enrollment                           | text     | 1000                        |
            | program_enrollmentBenefitChanges             | text     | Changes to enrollment       |
        And the form was saved recently
        And I leave and come back
        Then these form elements are prefilled:
            | program_contractTitle                        | text     | Contract Title              |
            | program_contractDate                         | text     | 07/14/2023                  |
            | program_contractUrl                          | text     | https://www.contracturl.com |
            | program_type                                 | radio    | Other, specify              |
            | program_type-otherText                       | text     | Generic MCP here            |
            | program_coveredSpecialBenefits               | checkbox | Dental                      |
            | program_specialBenefitsAvailabilityVariation | text     | N/A                         |
            | program_enrollment                           | text     | 1,000                       |
            | program_enrollmentBenefitChanges             | text     | Changes to enrollment       |