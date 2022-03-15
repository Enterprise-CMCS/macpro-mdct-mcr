import { Given, When } from "cypress-cucumber-preprocessor/steps";
import Homepage from "../../../support/pages/Homepage";
import LoginPage from "../../../support/pages/LoginPage";

const homePage = new Homepage();
const loginPage = new LoginPage();

Given("user visits QMR home page", () => {
  homePage.launch();
});

When("user enter email and password for Cognito login", () => {
  loginPage.enterEmailwithCognitoLogin();
  loginPage.enterPasswordwithCognitoLogin();
});