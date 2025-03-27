import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaveReturnButton } from "./SaveReturnButton";

const mockDisabledOnClick = jest.fn();
const mockOnClick = jest.fn();

describe("<SaveReturnButton />", () => {
  test("renders Save & return button", async () => {
    render(<SaveReturnButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(button);
    expect(mockOnClick).toBeCalled();
  });

  test("renders Return button", async () => {
    render(
      <SaveReturnButton disabled={true} disabledOnClick={mockDisabledOnClick} />
    );

    const button = screen.getByRole("button", { name: "Return" });
    await userEvent.click(button);
    expect(mockDisabledOnClick).toBeCalled();
  });

  test("renders Spinner", async () => {
    render(<SaveReturnButton submitting={true} />);

    const loading = screen.getByRole("button", { name: "Loading..." });
    expect(loading).toBeVisible();
  });
});
