Feature: Admin Dashboard Page E2E Testing

    Scenario Outline: Admin User can archive a state report
        Given I am logged in as an admin user
        And I am on "/"

        When I select a state
        And these form elements are filled:
            | state | dropdown | Minnesota |

        When I click on the "Go to Report Dashboard" button
        And I click the "Archive" button
        Then the report is archived

    Scenario Outline: Admin User can unarchive a state report
        Given I am logged in as an admin user
        And I am on "/"
        And these form elements are filled:
            | state | dropdown | Minnesota |

        When I click on the "Go to Report Dashboard" button
        And I click the "Unarchive" button
        Then the report is unarchived

