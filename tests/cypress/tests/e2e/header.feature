Feature: Header

    Scenario: Check Various Header Options
        # Implementing as 1 test to improve execution time and prevent session invalidation issue
        Given I am logged in as a state user
        And I am on "/"

        When the element described by "[aria-label='Get Help']" is clicked
        Then the "/help" page is loaded

        When the element described by "[alt='MCR logo']" is clicked
        Then the "/" page is loaded

        When the element described by "[aria-label='my account']" is clicked
        Then the following element states are validated:
            | [data-testid='header-menu-options-list']          | be.visible |
            | [data-testid='header-menu-option-manage-account'] | be.visible |
            | [data-testid='header-menu-option-log-out']        | be.visible |

        When the element described by "[data-testid='header-menu-option-manage-account']" is clicked
        Then the "/profile" page is loaded

        When the element described by "[aria-label='my account']" is clicked
        And the element described by "[data-testid='header-menu-option-log-out']" is clicked
        And I wait 3000 ms before continuing
        And I visit "/"
        Then the "/" page is loaded
        And the following element states are validated:
            | [data-testid='cognito-login-button'] | be.visible |

        # Force clear the session to allow additional tests to login
        Given I am not logged in
        Then the "/" page is loaded

