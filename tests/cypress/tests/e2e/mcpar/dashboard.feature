Feature: MCPAR Dashboard Page - Program Creation/Editing/Archiving

    Rule: State User Logged In
        Background: State User on MCPAR page
            Given I am logged in as a state user
            And I am on "/mcpar"

        Scenario Outline: State users can create programs
            When I click the "Add managed care program" button
            And these form elements are filled:
                | programName              | text           | <title>        |
                | reportingPeriodStartDate | text           | <startDate>    |
                | reportingPeriodEndDate   | text           | <endDate>      |
                | combinedData             | singleCheckbox | <combinedData> |
            And I click the "Save" button
            Then there is the active program with "<title>"

            Examples: #New Program Data
                | title          | startDate  | endDate    | combinedData |
                | Test Program   | 07/11/2022 | 11/07/2026 | true         |
                | Test Program 2 | 01012022   | 12212024   | false        |

        Scenario Outline: State users can Edit programs
            Given I click the "Edit Program" button
            And these form elements are prefilled:
                | programName              | text           | Test Program 2 |
                | reportingPeriodStartDate | text           | 01/01/2022     |
                | reportingPeriodEndDate   | text           | 12/21/2024     |
                | combinedData             | singleCheckbox | false          |

            When these form elements are edited:
                | programName              | text           | <title>        |
                | reportingPeriodStartDate | text           | <startDate>    |
                | reportingPeriodEndDate   | text           | <endDate>      |
                | combinedData             | singleCheckbox | <combinedData> |
            And I click the "Save" button
            Then there is the active program with "<title>"

            Examples: #Edited Data
                | title          | startDate  | endDate    | combinedData |
                | Edited Program | 06/22/2021 | 12/05/2025 | true         |


    Rule: Admin User Logged In
        Background: Admin User on homepage
            Given I am logged in as an admin user
            And I am on "/"

        Scenario: Admin users cannot create programs
            Given these form elements are filled:
                | state | dropdown | Minnesota |

            When I click the "Go to Report Dashboard" button
            Then there is no way to create a program

        Scenario: Admin users can archive programs
            Given these form elements are filled:
                | state | dropdown | Minnesota |

            When I click the "Go to Report Dashboard" button
            And I click the "Archive" button
            And I click the "Archive" button
            Then the program is archived

        Scenario: Admin users can unarchive programs
            Given these form elements are filled:
                | state | dropdown | Minnesota |

            When I click the "Go to Report Dashboard" button
            And I click the "Unarchive" button
            Then one program is archived and the other is unarchived

        Scenario: Admin users can rearchive programs
            Given these form elements are filled:
                | state | dropdown | Minnesota |

            When I click the "Go to Report Dashboard" button
            And I click the "Archive" button
            Then the program is archived

    Rule: State User Logged In
        Background: State User on MCPAR page
            Given I am logged in as a state user
            And I am on "/mcpar"

        Scenario: State users can't see archived programs
            Given I am on "/mcpar"
            Then there are no active programs



