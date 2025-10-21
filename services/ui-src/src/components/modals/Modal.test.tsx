import { fireEvent, render, screen } from "@testing-library/react";
// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();
const mockConfirmationHandler = jest.fn();

const content = {
  heading: "Dialog Heading",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan diam vitae metus lacinia, eget tempor purus placerat.",
  actionButtonText: "Dialog Action",
  closeButtonText: "Cancel",
};

const modalComponent = (
  <Modal
    onConfirmHandler={mockConfirmationHandler}
    modalDisclosure={{
      isOpen: true,
      onClose: mockCloseHandler,
    }}
    content={content}
  >
    <Text>{content.body}</Text>
  </Modal>
);

describe("<Modal />", () => {
  beforeEach(() => {
    render(modalComponent);
  });

  test("Modal shows the contents", () => {
    expect(screen.getByText(content.heading)).toBeTruthy();
    expect(screen.getByText(content.body)).toBeTruthy();
  });

  test("Modals action button can be clicked", () => {
    fireEvent.click(screen.getByText(/Dialog Action/i));
    expect(mockConfirmationHandler).toHaveBeenCalledTimes(1);
  });

  test("Modals close button can be clicked", () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  testA11yAct(modalComponent);
});
