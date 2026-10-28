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
  validateFieldWarning: jest.fn().mockReturnValue(null),
}));

const TestComponent = ({ name }: { name: string }) => {
  const warning = useFieldWarning(name);
  return <div data-testid="warning-output">{warning}</div>;
};

describe("useFieldWarning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockUseStore);
    mockUseWatch.mockReturnValue(undefined);
    mockValidateFieldWarning.mockReturnValue(null);
    (global as any).reconfigureJsdomLocation("http://localhost/mcpar");
  });

  test("returns null when no warning rule matches", () => {
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toHaveTextContent("");
  });

  test("calls validateFieldWarning with correct field name and value", () => {
    mockUseWatch.mockReturnValue("someValue");
    render(<TestComponent name="someField" />);
    expect(mockValidateFieldWarning).toHaveBeenCalledWith(
      "someField",
      "someValue",
      expect.objectContaining({
        selectedEntity: expect.anything(),
      })
    );
  });

  test("returns warning message when validateFieldWarning returns one", () => {
    mockValidateFieldWarning.mockReturnValue("This value seems low");
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toHaveTextContent(
      "This value seems low"
    );
  });

  test("returns null when value is undefined", () => {
    mockUseWatch.mockReturnValue(undefined);
    render(<TestComponent name="someField" />);
    expect(mockValidateFieldWarning).toHaveBeenCalledWith(
      "someField",
      undefined,
      expect.anything()
    );
  });

  test("returns null for non-MCPAR pages", () => {
    (global as any).reconfigureJsdomLocation("http://localhost/mlr");
    mockValidateFieldWarning.mockReturnValue("Some warning");
    render(<TestComponent name="someField" />);
    expect(screen.getByTestId("warning-output")).toHaveTextContent("");
  });
});
