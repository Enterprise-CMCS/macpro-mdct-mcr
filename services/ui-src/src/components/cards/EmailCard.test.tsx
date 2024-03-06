import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { EmailCard } from "components";
import { createEmailLink } from "utils/other/email";
import verbiage from "verbiage/pages/help";

const emailCardComponent = (
  <EmailCard verbiage={verbiage.cards[0]} icon="settings" />
);

describe("Test EmailCard", () => {
  beforeEach(() => {
    render(emailCardComponent);
  });

  test("EmailCard is visible", () => {
    expect(screen.getByText(verbiage.cards[0].email.address)).toBeVisible();
    expect(screen.getByAltText("settings icon")).toBeVisible();
  });

  test("Email links are created correctly", () => {
    const mockEmailData = {
      address: "test@test.com",
      subject: "the subject",
      body: "the body",
    };
    const expectedEmailLink = "mailto:test@test.com?the%20subject";
    expect(createEmailLink(mockEmailData)).toEqual(expectedEmailLink);
  });

  test("Email links are visible", () => {
    expect(screen.getByRole("link")).toBeVisible();
  });
});

describe("Test EmailCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(emailCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
