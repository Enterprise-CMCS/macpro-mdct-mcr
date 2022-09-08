import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { TemplateContext, TemplateProvider } from "./TemplateProvider";
// utils
import { mockFormTemplate } from "utils/testing/setupJest";

jest.mock("utils/api/requestMethods/formTemplate", () => ({
  getFormTemplate: jest.fn(() => {}),
  writeFormTemplate: jest.fn(() => {}),
}));

const mockFormTemplateAPI = require("utils/api/requestMethods/formTemplate");

const TestComponent = () => {
  const { ...context } = useContext(TemplateContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchFormTemplate("formTemplateId")}
        data-testid="fetch-form-template-button"
      >
        Fetch Form Template
      </button>
      <button
        onClick={() => context.saveFormTemplate(mockFormTemplate)}
        data-testid="save-form-template-button"
      >
        Save Form Template
      </button>
      {context.errorMessage && (
        <p data-testid="error-message">{context.errorMessage}</p>
      )}
    </div>
  );
};

const testComponent = (
  <TemplateProvider>
    <TestComponent />
  </TemplateProvider>
);

describe("Test fetch methods", () => {
  test("fetchFormTemplate method calls API getFormTemplate method", async () => {
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-form-template-button");
      await userEvent.click(fetchButton);
    });
    await waitFor(() =>
      expect(mockFormTemplateAPI.getFormTemplate).toHaveBeenCalledTimes(1)
    );
    jest.clearAllMocks();
  });
});

describe("Test TemplateProvider saveFormTemplate method", () => {
  test("saveFormTemplate method calls API writeFormTemplate method", async () => {
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const writeButton = screen.getByTestId("save-form-template-button");
      await userEvent.click(writeButton);
    });
    expect(mockFormTemplateAPI.writeFormTemplate).toHaveBeenCalledTimes(1);
    expect(mockFormTemplateAPI.writeFormTemplate).toHaveBeenCalledWith(
      mockFormTemplate
    );
    jest.clearAllMocks();
  });
});

describe("Test TemplateProvider error states", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Shows error if fetchFormTemplate throws error", async () => {
    mockFormTemplateAPI.getFormTemplate.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-form-template-button");
      await userEvent.click(fetchButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if saveFormTemplate throws error", async () => {
    mockFormTemplateAPI.writeFormTemplate.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const writeButton = screen.getByTestId("save-form-template-button");
      await userEvent.click(writeButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });
});
