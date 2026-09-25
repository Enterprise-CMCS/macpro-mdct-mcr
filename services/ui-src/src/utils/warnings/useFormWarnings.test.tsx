import { render, screen } from "@testing-library/react";
import type { Control } from "react-hook-form";
// components
import { WarningsProvider } from "components/app/WarningsContext";
// utils
import { useFormWarnings } from "./useFormWarnings";
import { validateFieldWarning } from "./warnings";

const mockValidateFieldWarning = validateFieldWarning as jest.Mock;
const mockSetWarnings = jest.fn();

jest.mock("components/app/WarningsContext", () => ({
  ...jest.requireActual("components/app/WarningsContext"),
  useWarningsContext: () => ({
    warnings: {},
    setWarnings: mockSetWarnings,
  }),
}));

const mockUseWatch = jest.fn();
jest.mock("react-hook-form", () => ({
  useWatch: (args: any) => mockUseWatch(args),
}));

jest.mock("./warnings", () => ({
  validateFieldWarning: jest.fn().mockReturnValue(null),
}));

const mockControl = {} as Control;
const mockFieldIds = ["testField"];

const TestComponent = () => {
  const warnings = useFormWarnings(mockFieldIds, mockControl);
  return <div data-testid="warnings-output">{JSON.stringify(warnings)}</div>;
};

const testComponent = (
  <WarningsProvider>
    <TestComponent />
  </WarningsProvider>
);

describe("useFormWarnings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWatch.mockReturnValue(["testValue"]);
    mockValidateFieldWarning.mockReturnValue(null);
  });

  test("returns computed warnings object on render", () => {
    render(testComponent);
    expect(screen.getByTestId("warnings-output")).toHaveTextContent(
      JSON.stringify({ testField: null })
    );
  });

  test("calls setWarnings with computed warnings on render", () => {
    render(testComponent);
    expect(mockSetWarnings).toHaveBeenCalledTimes(1);
    expect(mockSetWarnings).toHaveBeenCalledWith({ testField: null });
  });

  test("calls validateFieldWarning with correct field id and value", () => {
    render(testComponent);
    expect(mockValidateFieldWarning).toHaveBeenCalledWith(
      "testField",
      "testValue"
    );
  });

  test("returns warning message when validateFieldWarning returns a message", () => {
    mockValidateFieldWarning.mockReturnValue("This value seems low");
    render(testComponent);
    expect(mockSetWarnings).toHaveBeenCalledWith({
      testField: "This value seems low",
    });
  });
});
