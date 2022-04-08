const cognitoUserEmail = "//input[@name='email']";
const cognitoUserPassword = "//input[@name='password']";
const cognitoLoginButton = "(//button[@class='chakra-button css-9n6wlp'])[2]";

export class LoginPage {
  enterEmailwithCognitoLogin() {
    cy.xpath(cognitoUserEmail).type("stateuser1@test.com");
  }

  enterPasswordwithCognitoLogin() {
    cy.xpath(cognitoUserPassword).type("p@55W0rd!");
  }

  stateUserCognitoLogin() {
    cy.xpath(cognitoUserEmail).type("stateuser1@test.com");
    cy.xpath(cognitoUserPassword).type("p@55W0rd!");
    cy.xpath(cognitoLoginButton).click();
  }

  approverCognitoLogin() {
    cy.xpath(cognitoUserEmail).type("adminuser@test.com");
    cy.xpath(cognitoUserPassword).type("p@55W0rd!");
    cy.xpath(cognitoLoginButton).click();
  }
}
export default LoginPage;
