import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { EmailCard } from "components";
import { createEmailLink } from "./EmailCard";
// data
import data from "../../data/help-view.json";

const emailCardComponent = (
  <EmailCard
    verbiage={data.cards.helpdesk}
    icon="settings"
    cardprops={{ "data-testid": "email-card" }}
  />
);

describe("Test EmailCard", () => {
  beforeEach(() => {
    render(emailCardComponent);
  });

  test("EmailCard is visible", () => {
    expect(screen.getByTestId("email-card")).toBeVisible();
  });

  test("Email links are created correctly", () => {
    const mockEmailData = {
      address: "test@test.com",
      subject: "the subject",
      body: "the body",
    };
    const expectedEmailLink = "mailto:test@test.com?the%20subject&the%20body";
    expect(createEmailLink(mockEmailData)).toEqual(expectedEmailLink);
  });

  test("Email links are visible", () => {
    expect(screen.getByTestId("email-link")).toBeVisible();
  });
});

describe("Test EmailCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(emailCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
