import { render, within, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
// utils
import { parseCustomHtml, useUser } from "utils";
import { mockReportContext, mockStateUser } from "utils/testing/setupJest";
import { ReportContext, TextField } from "components";
import { useFormContext } from "react-hook-form";

jest.mock("dompurify", () => ({
  sanitize: jest.fn((el) => el),
}));

const mockHtmlString = "<span><em>whatever</em></span>";
const testElementArray = [
  {
    type: "text",
    as: "span",
    content: "Mock text ",
  },
  {
    type: "externalLink",
    content: "with link",
    props: {
      href: "mockURL.com",
    },
  },
  {
    type: "text",
    as: "span",
    content: ".",
  },
  {
    type: "p",
    content: "Paragraph tag.",
  },
  {
    type: "html",
    content: mockHtmlString,
  },
];

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const textFieldComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <TextField
      name="testTextField"
      label="test-label"
      placeholder="test-placeholder"
      data-testid="test-text-field"
      styleAsOptional
    />
  </ReportContext.Provider>
);

const testComponent = <div>{parseCustomHtml(testElementArray)}</div>;

describe("Test parseCustomHtml", () => {
  const sanitizationSpy = jest.spyOn(DOMPurify, "sanitize");
  beforeEach(() => {
    render(testComponent);
  });

  test("Custom element renders correctly", () => {
    const link = screen.getByText("with link");
    expect(link).toBeVisible();
  });

  test("Non-custom element renders correctly", () => {
    const element = screen.getByText("Paragraph tag.");
    expect(element).toBeVisible();
  });

  test("Type 'html' is sanitized and parsed", () => {
    expect(sanitizationSpy).toHaveBeenCalled();
  });
});

describe("Test labelTextWithOptional", () => {
  test("labelTextWithOptional parses a label with added html", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    const { getByText } = render(textFieldComponent);
    const label = getByText("test-label");
    const optional = within(label).getByText("(optional)");
    expect(optional).toBeVisible();
  });
});
