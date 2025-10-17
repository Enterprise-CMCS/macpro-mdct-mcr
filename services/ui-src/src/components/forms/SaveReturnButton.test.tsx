import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockAdminUserStore,
  mockStateUserStore,
} from "utils/testing/mockZustand";
import { SaveReturnButton } from "./SaveReturnButton";
import { useStore } from "utils";

const mockDisabledOnClick = jest.fn();
const mockOnClick = jest.fn();
const disabledOnClick = jest.fn();
jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe("<SaveReturnButton />", () => {
  describe("<SaveReturnButton /> for state user", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
      });
    });
    test("renders Save & return button", async () => {
      render(<SaveReturnButton onClick={mockOnClick} />);

      const button = screen.getByRole("button", { name: "Save & return" });
      await act(async () => {
        await userEvent.click(button);
      });
      expect(mockOnClick).toBeCalled();
    });

    test("renders Return button", async () => {
      render(
        <SaveReturnButton
          disabled={true}
          disabledOnClick={mockDisabledOnClick}
        />
      );

      const button = screen.getByRole("button", { name: "Return" });
      await act(async () => {
        await userEvent.click(button);
      });
      expect(mockDisabledOnClick).toBeCalled();
    });

    test("renders Spinner", async () => {
      render(<SaveReturnButton submitting={true} />);

      const loading = screen.getByRole("button", { name: "Loading..." });
      expect(loading).toBeVisible();
    });
  });

  describe("admin view", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
      });
    });
    test("calls disabledOnClick for admin", async () => {
      render(
        <SaveReturnButton disabledOnClick={disabledOnClick} formId="form-123" />
      );

      const button = screen.getByRole("button", { name: "Return" });
      await act(async () => {
        await userEvent.click(button);
      });
      expect(disabledOnClick).toHaveBeenCalled();
    });
  });
});
