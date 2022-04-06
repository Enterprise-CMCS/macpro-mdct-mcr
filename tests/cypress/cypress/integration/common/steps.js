import { Given, When } from "cypress-cucumber-preprocessor/steps";
import Homepage from "../../../support/pages/Homepage";
import LoginPage from "../../../support/pages/LoginPage";

const homePage = new Homepage();
const loginPage = new LoginPage();

Given("user visits homepage", () => {
  homePage.launch();
});

When("user enters Cognito email and password for login", () => {
  loginPage.enterEmailwithCognitoLogin();
  loginPage.enterPasswordwithCognitoLogin();
});
