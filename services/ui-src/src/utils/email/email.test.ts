import { createEmailLink } from "./email";

const testEmailAddress = "test@testme.com";
const testEmailSubject = "TestSubject";

describe("Test email", () => {
  test("Test only address passed", () => {
    const mailTo = createEmailLink({ address: testEmailAddress });
    expect(mailTo).toEqual("mailto:test@testme.com");
  });

  test("test all fields passed", () => {
    const mailTo = createEmailLink({
      address: testEmailAddress,
      subject: testEmailSubject,
    });
    expect(mailTo).toEqual("mailto:test@testme.com?TestSubject");
  });
});
