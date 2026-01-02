import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsMultiformOverlay, OverlayProvider } from "components";
// constants
import {
  nonCompliantLabels,
  planComplianceStandardExceptionsLabel,
} from "../../constants";
// utils
import {
  mockEntityStore,
  mockEntityDetailsMultiformOverlayJson,
  mockStateUserStore,
  RouterWrappedComponent,
  mockNaaarAnalysisMethods,
  mockNaaarStandards,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { ReportShape } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const { details } = mockEntityDetailsMultiformOverlayJson;
const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();
const mockSetSelectedEntity = jest.fn();
const mockSetEntering = jest.fn();
const mockReport = {
  fieldData: {
    analysisMethods: mockNaaarAnalysisMethods,
    standards: mockNaaarStandards,
  },
} as unknown as ReportShape;

const entityDetailsMultiformOverlayComponent = (
  disabled: boolean = false,
  submitting: boolean = false,
  childForms: any = details!.childForms,
  selectedEntity: any = mockEntityStore.selectedEntity
) => (
  <RouterWrappedComponent>
    <OverlayProvider>
      <EntityDetailsMultiformOverlay
        childForms={childForms}
        closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
        disabled={disabled}
        forms={details!.forms}
        onSubmit={mockOnSubmit}
        report={mockReport}
        selectedEntity={selectedEntity}
        setEntering={mockSetEntering}
        setSelectedEntity={mockSetSelectedEntity}
        submitting={submitting}
        validateOnRender={false}
        verbiage={details!.verbiage}
      />
    </OverlayProvider>
  </RouterWrappedComponent>
);

async function setupChildTableFormTest(
  childButtonText: string = "Enter",
  selectedEntity: any = mockEntityStore.selectedEntity
) {
  render(
    entityDetailsMultiformOverlayComponent(
      undefined,
      undefined,
      undefined,
      selectedEntity
    )
  );

  // Form
  const form = screen.getAllByRole("form")[1];
  const radioButtonNo = within(form).getByRole("radio", {
    name: nonCompliantLabels["438.206"],
  });
  await act(async () => {
    await userEvent.click(radioButtonNo);
  });

  // Table
  const updatedEntityCellsIncomplete = screen.getByRole("row", {
    name: "warning icon Mock Cell 2 Select “Enter” to complete response. Enter",
  });
  expect(updatedEntityCellsIncomplete).toBeVisible();

  // Click Enter
  const updatedEnterButton = within(updatedEntityCellsIncomplete).getByRole(
    "button",
    { name: "Enter" }
  );
  await act(async () => {
    await userEvent.click(updatedEnterButton);
  });

  // Child Table
  const childTable = screen.getByRole("table", { name: "Mock Child Table" });
  expect(childTable).toBeVisible();

  // Click Enter in Child Table
  const childTableButton = within(childTable).getByRole("button", {
    name: childButtonText,
  });
  await act(async () => {
    await userEvent.click(childTableButton);
  });
}

async function submitChildForm() {
  const submitButton = screen.getByRole("button", { name: "Save & return" });
  await act(async () => {
    await userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(mockOnSubmit).toBeCalled();
  });
}

describe("<EntityDetailsMultiformOverlay />", () => {
  test("renders form", async () => {
    render(entityDetailsMultiformOverlayComponent());

    // Verbiage
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Example Plan",
    });

    expect(h2).toBeVisible();

    // Forms
    for (const formId of ["", " 2"]) {
      const radioButtonYes = screen.getByRole("radio", {
        name: `Mock Yes${formId}`,
      });
      await act(async () => {
        await userEvent.click(radioButtonYes);
      });
      await waitFor(() => {
        const h3 = screen.getByRole("heading", {
          level: 3,
          name: `Mock Heading${formId}`,
        });
        const accordion = screen.getByText(`Mock Accordion${formId}`);
        expect(h3).toBeVisible();
        expect(accordion).toBeVisible();

        // Tables
        const entityTable = screen.getByRole("table", {
          name: `Mock Table${formId}`,
        });
        const entityHeaders = screen.getByRole("row", {
          name: `Status Mock Table Header${formId} Action`,
        });
        const entityCells = screen.getByRole("row", {
          name: `Mock Cell${formId} Enter`,
        });
        const enterButton = within(entityCells).getByRole("button", {
          name: "Enter",
        });

        expect(entityTable).toBeVisible();
        expect(entityHeaders).toBeVisible();
        expect(entityCells).toBeVisible();
        expect(enterButton).toBeDisabled();
      });
    }
    await submitChildForm();
  });

  test("renders child form", async () => {
    render(entityDetailsMultiformOverlayComponent());

    // Form
    const radioButtonNo = screen.getAllByRole("radio", {
      name: nonCompliantLabels["438.206"],
    })[0];
    await act(async () => {
      await userEvent.click(radioButtonNo);
    });

    // Table
    const updatedEntityCellsIncomplete = screen.getByRole("row", {
      name: "warning icon Mock Cell Select “Enter” to complete response. Enter",
    });
    expect(updatedEntityCellsIncomplete).toBeVisible();

    // Click Enter
    const updatedEnterButton = within(updatedEntityCellsIncomplete).getByRole(
      "button",
      {
        name: "Enter",
      }
    );
    await act(async () => {
      await userEvent.click(updatedEnterButton);
    });

    // Child Form
    const childForm = screen.getByRole("heading", {
      name: "Mock Child Form",
    });
    expect(childForm).toBeVisible();
  });

  test("renders child table", async () => {
    await setupChildTableFormTest();
    await submitChildForm();
  });

  test("renders child table - new entity", async () => {
    await setupChildTableFormTest("Enter", null);
    await submitChildForm();
  });

  test("renders child table - add exception", async () => {
    const selectedEntity = {
      ...mockEntityStore.selectedEntity,
      "planCompliance43868_standard-mockStandard-nonComplianceDescription":
        "Mock Description",
    };
    await setupChildTableFormTest("Edit", selectedEntity);

    // Child Form - add exception
    const exceptionRadioButton = screen.getByRole("radio", {
      name: planComplianceStandardExceptionsLabel,
    });

    await act(async () => {
      await userEvent.click(exceptionRadioButton);
    });

    const exceptionTextbox = screen.getByRole("textbox", {
      name: "Mock Exception Description",
    });
    await act(async () => {
      await userEvent.type(exceptionTextbox, "Test value");
    });

    await submitChildForm();
  });

  test("renders child table - add non-Compliance", async () => {
    const selectedEntity = {
      ...mockEntityStore.selectedEntity,
      "planCompliance43868_standard-mockStandard-exceptionsDescription":
        "Mock Description",
    };
    await setupChildTableFormTest("Edit", selectedEntity);

    // Child Form - add non-compliance
    const radioButtonYes = screen.getByRole("radio", {
      name: "Mock Yes",
    });

    await act(async () => {
      await userEvent.click(radioButtonYes);
    });

    const nonComplianceTextbox = screen.getByRole("textbox", {
      name: "Mock Non-Compliance Description",
    });
    await act(async () => {
      await userEvent.type(nonComplianceTextbox, "Test value");
    });

    await submitChildForm();
  });

  test("renders child table - remove exceptions and non-compliance keys", async () => {
    const selectedEntity = {
      ...mockEntityStore.selectedEntity,
      "planCompliance43868_standard-mockStandard-exceptionsDescription":
        "Mock Description",
      "planCompliance43868_standard-mockStandard-nonComplianceDescription":
        "Mock Description",
      "planCompliance43868_standard-mockStandard-mockDescription":
        "Mock Description",
    };
    await setupChildTableFormTest("Edit", selectedEntity);
    await submitChildForm();
  });

  test("renders nothing if no child form", async () => {
    render(entityDetailsMultiformOverlayComponent(undefined, undefined, []));

    // Form
    const radioButtonNo = screen.getAllByRole("radio", {
      name: nonCompliantLabels["438.206"],
    })[0];
    await act(async () => {
      await userEvent.click(radioButtonNo);
    });

    // Table
    const entityCellsIncomplete = screen.getByRole("row", {
      name: "warning icon Mock Cell Select “Enter” to complete response. Enter",
    });
    expect(entityCellsIncomplete).toBeVisible();

    // Click Enter
    const updatedEnterButton = within(entityCellsIncomplete).getByRole(
      "button",
      {
        name: "Enter",
      }
    );
    await act(async () => {
      await userEvent.click(updatedEnterButton);
    });

    // Stays on Table
    const childForm = screen.queryByRole("heading", {
      name: "Mock Child Form",
    });
    expect(childForm).toBeNull();
  });

  test("closes overlay", async () => {
    render(entityDetailsMultiformOverlayComponent());
    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button: Main",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });

  test("disables submit button", async () => {
    render(entityDetailsMultiformOverlayComponent(true, false));
    const closeButton = screen.getByRole("button", { name: "Return" });
    const submitButton = screen.queryByRole("button", {
      name: "Save & return",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
    expect(submitButton).toBeNull();
  });

  test("shows spinner when submitting", () => {
    render(entityDetailsMultiformOverlayComponent(false, true));
    const loading = screen.getByRole("button", { name: "Loading..." });
    expect(loading).toBeVisible();
  });
});
