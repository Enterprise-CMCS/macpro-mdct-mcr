import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";

const closeHandler = jest.fn();
const confirmationHandler = jest.fn();

const content = {
  heading: "Dialog Heading",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan diam vitae metus lacinia, eget tempor purus placerat.",
  actionButtonText: "Dialog Action",
  closeButtonText: "Cancel",
};

const modalComponent = (
  <Modal
    onConfirmHandler={confirmationHandler}
    modalDisclosure={{
      isOpen: true,
      onClose: closeHandler,
    }}
    content={content}
  >
    <Text>{content.body}</Text>
  </Modal>
);

describe("Test Modal", () => {
  beforeEach(() => {
    render(modalComponent);
  });

  test("Modal shows the contents", () => {
    expect(screen.getByText(content.heading)).toBeTruthy();
    expect(screen.getByText(content.body)).toBeTruthy();
  });

  test("Modals action button can be clicked", () => {
    fireEvent.click(screen.getByText(/Dialog Action/i));
    expect(confirmationHandler).toHaveBeenCalledTimes(1);
  });

  test("Modals close button can be clicked", () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
