@accessibility
Feature: Site Accessibility Audit
    Performs an accessibility audit on the various MCR pages

    Rule: Not Logged In
        Scenario: Accessibility Verification
            Given I am not logged in
            When I visit "/"
            Then the page is accessible on all device types

    Rule: Admin User
        Background: Logged in as Admin
            # Ensure session is clear prior to changing to Admin user
            Given I am not logged in
            Given I am logged in as an admin user

        Scenario Outline: Accessibility Verification
            When I visit "<URI>"
            Then the page is accessible on all device types
            # Clear session after Admin Tests
            Given I am not logged in 

            Examples:
                | URI      |
                | /admin   |
                | /profile |


    Rule: State User
        Background: Logged in as User
            Given I am logged in as a state user

        Scenario Outline: Accessibility Verification
            When I visit "<URI>"
            Then the page is accessible on all device types

            Examples:
                | URI      |
                | /        |
                | /profile |
                | /help    |
