import { render, screen } from "@testing-library/react";
import { WarningMessage } from "./WarningMessage";

describe("<WarningMessage />", () => {
  test("renders warning message text", () => {
    render(<WarningMessage message="Test warning message" id="test-warning" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Test warning message");
  });

  test("renders with correct id", () => {
    render(<WarningMessage message="Test warning" id="test-id" />);
    expect(screen.getByRole("alert")).toHaveAttribute("id", "test-id");
  });

  test("renders warning icon with aria-hidden", () => {
    render(<WarningMessage message="Test warning" id="test-warning" />);
    const icon = screen.getByRole("presentation", { hidden: true });
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("alt", "");
  });

  test("is visible", () => {
    render(<WarningMessage message="Test warning" id="test-warning" />);
    expect(screen.getByRole("alert")).toBeVisible();
  });
});
