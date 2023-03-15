Feature: MLR E2E Form Submission

    Scenario: A state user can fully create a form and submit it
        Given I am logged in as a state user
        When I submit a new MLR program
        Then the program is submitted
