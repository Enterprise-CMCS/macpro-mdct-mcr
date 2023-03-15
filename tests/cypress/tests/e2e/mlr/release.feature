Feature: MLR E2E Form Submission

    Scenario: An admin user can release a completed report.
        Given I am logged in as an state user
        When I create, fill, and submit a report
        Then the report is submitted successfully
        Given I am logged in as an admin user
        When I release a report
        Then the report will have the correct content pre-filled

    Scenario: A report cannot be released if it is archived.
        Given I am logged in as an state user
        When I create, fill, and submit a report
        Then the report is submitted successfully
        Given I am logged in as an admin user
        When I archive a report
        Then I cannot release that archived report

    Scenario: A report cannot be released if it is unfinished.
        Given I am logged in as an state user
        When I create, fill but don't submit a report
        Given I am logged in as an admin user
        Then I cannot release that report