import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { FaqCard } from "components";
import { createEmailLink } from "./FaqCard";
// data
import data from "../../data/faq-view.json";

const faqCardComponent = (
  <FaqCard
    verbiage={data.cards.helpdesk}
    icon="settings"
    cardprops={{ "data-testid": "faq-card" }}
  />
);

describe("Test FaqCard", () => {
  beforeEach(() => {
    render(faqCardComponent);
  });

  test("FaqCard is visible", () => {
    expect(screen.getByTestId("faq-card")).toBeVisible();
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
});

describe("Test FaqCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(faqCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
