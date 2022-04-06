const appLogo = "//img[@alt='QMR Logo']";
const headerAppLogo = 'img[alt="QMR Logo"]';
const headerLoginButton = "a#loginButton";
const footerAddress = '(//div[@class="footer-wrapper"]/div)[2]';
const footerEmail = ".footer-email";
const footerHhsLogo = "img[alt='Department of Health and Human Services logo']";
const footerMdctLogo = "//img[@alt='Mdct logo']";
const footerMedicaidLogo = "//img[@alt='Medicaid.gov logo']";
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const footerSentence = '(//div[@class="footer-fed-gov-text"])[1]';

export class Homepage {
  launch() {
    cy.visit("/");
  }

  verifyLogos() {
    cy.xpath(appLogo).should("be.visible");
    cy.xpath(footerMDCTLogo).should("be.visible");
    cy.xpath(footerMedicaidLogo).should("be.visible");
  }

  validateCoreSetReportingIcon() {
    //cy.wait(3000);
    cy.get(headerAppLogo).should("be.visible");
  }

  validateLoginButton() {
    cy.get(headerLoginButton).should("be.visible");
  }

  clickLoginButton() {
    cy.get(headerLoginButton).click();
  }

  validateSupportSenence() {
    cy.xpath(footerSentence).should("be.visible");
  }

  validateMedicaidLogo() {
    cy.get(medicaidLogo).should("be.visible");
  }

  validateEmail() {
    cy.get(footerEmail).contains("MDCT_Help@cms.hhs.gov");
  }

  validateFederalLogo() {
    cy.get(footerHhsLogo).should("be.visible");
  }

  validateAddress() {
    cy.xpath(footerAddress).contains(
      "7500 Security Boulevard Baltimore, MD 21244"
    );
  }
}
export default Homepage;
