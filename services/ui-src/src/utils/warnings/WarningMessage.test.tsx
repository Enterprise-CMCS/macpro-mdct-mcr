import { render, screen, within } from "@testing-library/react";
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

  test("renders a single icon for a single-line message", () => {
    render(<WarningMessage message="Test warning" id="test-warning" />);
    expect(screen.getAllByRole("presentation", { hidden: true })).toHaveLength(
      1
    );
  });

  test("renders each line of a multi-line message as its own warning with an icon", () => {
    render(
      <WarningMessage
        message={"First warning\nSecond warning"}
        id="test-warning"
      />
    );
    const warnings = within(screen.getByRole("alert")).getAllByRole(
      "paragraph"
    );
    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toHaveTextContent("First warning");
    expect(warnings[1]).toHaveTextContent("Second warning");
    expect(screen.getAllByRole("presentation", { hidden: true })).toHaveLength(
      2
    );
  });
});
