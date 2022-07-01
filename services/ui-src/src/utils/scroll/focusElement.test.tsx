import { render, screen } from "@testing-library/react";
import { focusElement } from "utils/scroll/focusElement";

jest.mock("utils/scroll/focusElement", () => ({
  ...jest.requireActual("utils/scroll/focusElement"),
  checkElementPosition: jest.fn((): any => ({
    shouldScroll: true,
    scrollDistance: 100,
  })),
}));

const testComponent = (
  <div>
    <input name="testfield" data-testid="testfield" />
  </div>
);

describe("Test focusElement", () => {
  it("Scrolls the element into view if necessary", () => {
    render(testComponent);
    const field = screen.getByTestId("testfield");
    focusElement(field);
    const spy = jest.spyOn(window, "scrollBy");
    expect(spy).toHaveBeenCalledWith({ top: 100, left: 0, behavior: "smooth" });
  });

  it("Focuses the element", () => {
    render(testComponent);
    const field = screen.getByTestId("testfield");
    focusElement(field);
    expect(field).toHaveFocus();
  });
});
