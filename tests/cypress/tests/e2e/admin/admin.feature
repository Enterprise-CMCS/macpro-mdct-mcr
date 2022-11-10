Feature: Admin Page E2E Testing

    Scenario Outline: Create a Banner and then delete it
        Given I am logged in as an admin user
        And I am on "/"

        When I navigate to the admin page
        Then the "/admin" page is loaded
        
        When these form elements are filled:
            | bannerTitle       | <title>       |
            | bannerDescription | <description> |
            | bannerStartDate   | <startDate>   |
            | bannerEndDate     | <endDate>     |
        And the form is submitted
        Then there is an active banner
        And the banner has the title "<title>"
        And the banner has the description "<description>"
        And the banner starts on "<startDate>"
        And the banner ends on "<endDate>"
        And no errors are present

        When the delete button is clicked
        Then there is no banner
        And no errors are present

        Examples:
            | title      | description      | startDate  | endDate    |
            | test-title | test-description | 07/14/2022 | 07/14/2026 |

