Feature: Creating a MCPAR Program

    Scenario: State users can create programs
        Given I am logged in as an state user
        And I am on "/mcpar"

        When I click the "Add managed care program" button
        And these form elements are filled:
            | programName               | text     | <title>           |
            | reportingPeriodStartDate  | text     | <startDate>       |
            | reportingPeriodEndDate    | text     | <endDate>         |
            | combinedData              | checkbox | <combinedData>    |
        And I click the "Save" button
        Then there is an active program

        Examples: #Form Data
            | title         | startDate  | endDate    | combinedData |
            | Test Program  | 07/11/2022 | 11/07/2026 | true         |
    
    Scenario: Admin users can not create programs
        Given I am logged in as an admin user
        And I am on "/"
        And these form elements are filled:
            | state | dropdown | <state> |

        When I click the "Go to Report Dashboard" button
        Then there is no way to create a program
        
        Examples: #Form Data
            | state     |
            | Minnesota |