import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { McparReportPage } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import sectionA_pointofcontact from "forms/mcpar/apoc.json";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const mcparReportPageComponent = (
  <RouterWrappedComponent>
    <McparReportPage pageJson={sectionA_pointofcontact} />
  </RouterWrappedComponent>
);

const testFormName = "apointofcontact";

const fillOutForm = async (form: any) => {
  // selectors for all the required fields
  const a2aInput = form.querySelector("[name='apoc-a2a']")!;
  const a2bInput = form.querySelector("[name='apoc-a2b']")!;
  const a3aInput = form.querySelector("[name='apoc-a3a']")!;
  const a3bInput = form.querySelector("[name='apoc-a3b']")!;
  // fill out form fields
  await userEvent.type(a2aInput, "mock name");
  await userEvent.type(a2bInput, "mock@mock.com");
  await userEvent.type(a3aInput, "mock name");
  await userEvent.type(a3bInput, "mock@mock.com");
};

describe("Test McparReportPage view", () => {
  beforeEach(() => {
    render(mcparReportPageComponent);
  });

  test("McparReportPage view renders", () => {
    expect(screen.getByTestId(testFormName)).toBeVisible();
  });
});

describe("Test McparReportPage next navigation", () => {
  it("Navigates to next route on successful submission", async () => {
    const result = render(mcparReportPageComponent);
    const form = result.container;
    await fillOutForm(form);
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    const expectedRoute = "/mcpar/program-information/reporting-period";
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test McparReportPage previous navigation", () => {
  it("Navigates to previous route on previous button click", async () => {
    render(mcparReportPageComponent);
    const previousButton = screen.getByText("Previous")!;
    await userEvent.click(previousButton);
    const expectedRoute = "/mcpar/program-information/reporting-period";
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test McparReportPage view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(mcparReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
