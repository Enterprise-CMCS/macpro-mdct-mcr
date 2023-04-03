Feature: MLR E2E Form Submission

    Scenario: An admin user can unlock a completed report.
        Given I am logged in as an state user
        When I create, fill, and submit a report
        Then the report is submitted successfully
        Given I am logged in as an admin user
        Then I unlock a report
        Given I am logged in as a state user
        Then the report will have the correct content pre-filled

    Scenario: A report cannot be unlocked if it is archived.
        Given I am logged in as an state user
        When I create, fill, and submit a report
        Then the report is submitted successfully
        Given I am logged in as an admin user
        When I archive a report
        Then I cannot unlock that archived report

    Scenario: A report cannot be unlocked if it is unfinished.
        Given I am logged in as an state user
        When I create, fill but don't submit a report
        Given I am logged in as an admin user
        Then I cannot unlock that report
