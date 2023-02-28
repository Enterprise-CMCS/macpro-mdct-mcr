import { render, within } from "@testing-library/react";
import { mockReportContext, mockStateUser } from "utils/testing/setupJest";
import { ReportContext, TextField } from "components";
import { useUser } from "utils/auth/useUser";
import { useFormContext } from "react-hook-form";

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
