import { createEmailLink } from "./email";

const testEmailAddress = "test@testme.com";
const testEmailSubject = "TestSubject";
const testEmailBody = "TestBody";

describe("Test email", () => {
  test("Test only address passed", () => {
    const mailTo = createEmailLink({ address: testEmailAddress });
    expect(mailTo).toEqual("mailto:test@testme.com");
  });

  test("test all fields passed", () => {
    const mailTo = createEmailLink({
      address: testEmailAddress,
      subject: testEmailSubject,
      body: testEmailBody,
    });
    expect(mailTo).toEqual("mailto:test@testme.com?TestSubject&TestBody");
  });
});
