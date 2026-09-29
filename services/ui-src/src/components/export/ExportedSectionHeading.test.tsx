import { render, screen } from "@testing-library/react";
// components
import { ExportedSectionHeading } from "components";
// utils
import { mockVerbiageIntro } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockSectionHeading = {
  heading: "mock-heading",
  verbiage: {
    intro: mockVerbiageIntro,
  },
};
const { heading, verbiage } = mockSectionHeading;

const exportedReportSectionHeadingComponent = (
  <ExportedSectionHeading heading={heading} verbiage={verbiage} />
);

const mockVerbiageIntroWithLink = {
  ...mockVerbiageIntro,
  info: [
    {
      type: "html",
      content:
        'mock html with a <a href="https://example.com" target="_blank">link</a> inside',
    },
  ],
};

const mockSectionHeadingWithLink = {
  heading: "mock-heading",
  verbiage: {
    intro: mockVerbiageIntroWithLink,
  },
};

const exportedReportSectionHeadingWithLinkComponent = (
  <ExportedSectionHeading
    heading={mockSectionHeadingWithLink.heading}
    verbiage={mockSectionHeadingWithLink.verbiage}
  />
);

describe("<ExportedSectionHeading />", () => {
  test("ExportedSectionHeading renders", () => {
    const { getByTestId } = render(exportedReportSectionHeadingComponent);
    const sectionHeading = getByTestId("exportedSectionHeading");
    expect(sectionHeading).toBeVisible();
  });

  test("Correct heading text is shown", () => {
    render(exportedReportSectionHeadingComponent);
    const sectionHeading = screen.getByText("mock section");
    expect(sectionHeading).toBeVisible();
  });

  test("Links in intro content are styled as links, not body text", () => {
    render(exportedReportSectionHeadingWithLinkComponent);
    const link = screen.getByRole("link", {
      name: "link (link opens in new tab)",
    });
    expect(link).toHaveStyle({ textDecoration: "underline" });
  });

  testA11yAct(exportedReportSectionHeadingComponent);
});
