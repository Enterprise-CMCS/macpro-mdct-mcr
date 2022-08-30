// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
// utils
import { AnyObject } from "types";

export const DeleteProgramModal = ({ modalDisclosure }: Props) => {
  const {
    deleteProgramModalIsOpen: isOpen,
    deleteProgramOnCloseHandler: onCloseHandler,
  } = modalDisclosure;

  return (
    <Modal
      // actionFunction={() => {}}
      modalState={{
        isOpen: isOpen,
        onClose: onCloseHandler,
      }}
      content={{
        heading: "Delete",
        actionButtonText: "Yes, delete program",
        closeButtonText: "Cancel",
      }}
    >
      <Text>
        You will lose all information entered for this program. Are you sure you
        want to proceed?
      </Text>
    </Modal>
  );
};

interface Props {
  modalDisclosure: AnyObject;
}
