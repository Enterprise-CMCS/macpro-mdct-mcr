import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { ReportDrawer } from "components";
import {
  mockAdminUser,
  mockDrawerForm,
  mockStateUser,
} from "utils/testing/setupJest";
// utils
import { useUser } from "utils";
// constants
import { closeText, saveAndCloseText } from "../../constants";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

const mockEntity = {
  id: "mock-id-1",
  "mock-modal-text-field": "mock input 1",
};

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const drawerComponent = (
  <ReportDrawer
    verbiage={{
      drawerTitle: "mock title",
    }}
    selectedEntity={mockEntity}
    form={mockDrawerForm}
    onSubmit={mockOnSubmit}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

describe("Test ReportDrawer rendering", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should render save text for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerComponent);
    expect(screen.getByText(saveAndCloseText)).toBeVisible();
  });

  it("Should not render save text for admin user", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    render(drawerComponent);
    expect(screen.queryByText(saveAndCloseText)).not.toBeInTheDocument();
  });
});

const drawerComponentWithoutFormFields = (
  <ReportDrawer
    verbiage={{
      drawerTitle: "mock title",
      drawerNoFormMessage: "no form fields here",
    }}
    selectedEntity={mockEntity}
    form={{ id: "mock-drawer-form-id", fields: [] }}
    onSubmit={mockOnSubmit}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

describe("Test ReportDrawerWithoutFormFields rendering", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should render save text for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerComponentWithoutFormFields);
    expect(screen.getByText("no form fields here")).toBeVisible();
  });
});

describe("Test ReportDrawer fill form and close", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerComponent);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("ReportDrawer form can be filled and saved for state user", async () => {
    const testField = screen.getByRole("textbox", {
      name: /mock drawer text field/i,
    });
    await userEvent.type(testField, "valid fill");
    const saveCloseButton = screen.getByText(saveAndCloseText);
    expect(saveCloseButton).toBeVisible();
    await userEvent.click(saveCloseButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("ReportDrawer can be closed with close button", async () => {
    const closeButton = screen.getByText(closeText);
    expect(closeButton).toBeVisible();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("ReportDrawer can be closed with cancel button", async () => {
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeVisible();
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
