Feature: MCPAR E2E Form Submission

        Scenario: A state user can fully create a form and submit it
                Given I am logged in as a state user
                When I completely fill out a "MCPAR" form
                Then the "MCPAR" form is submittable

                When I submit the "MCPAR" form
                Then the program is submitted

        Scenario: A state user cannot submit an incomplete form.
                Given I am logged in as a state user
                When I try to submit an incomplete "MCPAR" program
                Then there is a submission alert
                And there are errors in the status
                And incomplete program cannot submit
