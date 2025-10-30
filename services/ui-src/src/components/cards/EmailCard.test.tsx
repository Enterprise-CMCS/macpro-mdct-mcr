import { render, screen } from "@testing-library/react";
// components
import { EmailCard } from "components";
// utils
import { createEmailLink } from "utils/other/email";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/help";

const emailCardComponent = (
  <EmailCard verbiage={verbiage.cards[0]} icon="settings" />
);

describe("<EmailCard />", () => {
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

  testA11yAct(emailCardComponent);
});
