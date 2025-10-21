import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackButton } from "./BackButton";

const mockOnClick = jest.fn();

describe("<BackButton />", () => {
  test("renders button", async () => {
    render(<BackButton onClick={mockOnClick} text={"Mock Back Button"} />);

    const button = screen.getByRole("button", { name: "Mock Back Button" });
    await act(async () => {
      await userEvent.click(button);
    });
    expect(mockOnClick).toBeCalled();
  });
});
