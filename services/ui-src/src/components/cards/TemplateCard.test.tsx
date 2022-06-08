import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { act } from "react-dom/test-utils";
//components
import { TemplateCard } from "components";
// data
import data from "../../data/home-view.json";

const mockAPI = require("utils/api/requestMethods/template");

const templateCardComponent = (
  <TemplateCard
    templateName="testTemplate"
    verbiage={data.cards.MCPAR}
    data-testid="template-download-card"
  />
);

describe("Test TemplateCard", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("TemplateCard is visible", () => {
    expect(screen.getByTestId("template-download-card")).toBeVisible();
  });

  test("TemplateCard download button is visible and clickable", async () => {
    const apiSpy = jest.spyOn(mockAPI, "getSignedTemplateUrl");
    const downloadButton = screen.getByTestId("template-download-button");
    expect(downloadButton).toBeVisible();
    await act(async () => {
      await userEvent.click(downloadButton);
    });
    await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(1));
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
