import { render, screen } from "@testing-library/react";
import { useWatch } from "react-hook-form";
// utils
import { useStore } from "utils";
import { mockUseStore } from "utils/testing/setupJest";
import { useFieldWarning } from "./useFieldWarning";
import { validateFieldWarning } from "./warnings";

const mockValidateFieldWarning = validateFieldWarning as jest.Mock;
const mockUseWatch = useWatch as jest.Mock;

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => ({ control: {} })),
  useWatch: jest.fn().mockReturnValue(undefined),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("./warnings", () => ({
  validateFieldWarning: jest.fn().mockReturnValue([]),
}));

const TestComponent = ({ name }: { name: string }) => {
  const warnings = useFieldWarning(name);
  return <div data-testid="warning-output">{warnings.join(" | ")}</div>;
};

describe("useFieldWarning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockUseStore);
    mockUseWatch.mockReturnValue(undefined);
    mockValidateFieldWarning.mockReturnValue([]);
    (global as any).reconfigureJsdomLocation("http://localhost/mcpar");
  });

  test("returns no warnings when no warning rule matches", () => {
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toHaveTextContent("");
  });

  test("calls validateFieldWarning with correct field name and value", () => {
    mockUseWatch.mockReturnValue("someValue");
    render(<TestComponent name="someField" />);
    expect(mockValidateFieldWarning).toHaveBeenCalledWith({
      fieldName: "someField",
      value: "someValue",
      context: expect.objectContaining({
        selectedEntity: expect.anything(),
      }),
    });
  });

  test("returns every warning message when validateFieldWarning returns several", () => {
    mockValidateFieldWarning.mockReturnValue([
      "This value seems low",
      "Second warning",
    ]);
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toHaveTextContent(
      "This value seems low | Second warning"
    );
  });

  test("passes an undefined value to validateFieldWarning", () => {
    mockUseWatch.mockReturnValue(undefined);
    render(<TestComponent name="someField" />);
    expect(mockValidateFieldWarning).toHaveBeenCalledWith({
      fieldName: "someField",
      value: undefined,
      context: expect.anything(),
    });
  });

  test("returns no warnings for non-MCPAR pages", () => {
    (global as any).reconfigureJsdomLocation("http://localhost/mlr");
    mockValidateFieldWarning.mockReturnValue(["Some warning"]);
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toBeEmptyDOMElement();
    expect(mockValidateFieldWarning).not.toHaveBeenCalled();
  });
});
