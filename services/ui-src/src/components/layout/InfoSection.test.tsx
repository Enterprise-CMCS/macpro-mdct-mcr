import { render, screen } from "@testing-library/react";
// components
import { InfoSection } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-get-started";

const content = mcparVerbiage.body.sections[0];

const InfoSectionComponent = <InfoSection content={content} />;

describe("<InfoSection />", () => {
  test("Check that Section renders", () => {
    render(InfoSectionComponent);
    expect(screen.getByText(content.header)).toBeVisible();
  });

  test("should see that there is a section number and associated content", async () => {
    render(InfoSectionComponent);
    const sectionNumber = screen.getByText("1");
    await expect(sectionNumber).toBeVisible();
    const sectionHeader = screen.getByText(content.header);
    await expect(sectionHeader).toBeVisible();
  });

  testA11yAct(InfoSectionComponent);
});
