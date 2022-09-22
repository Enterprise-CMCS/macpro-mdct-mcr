// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";

export const DeleteProgramModal = ({ modalDisclosure }: Props) => {
  return (
    <Modal
      onConfirmHandler={() => {
        /* TODO: change delete to archive */
        modalDisclosure.onClose();
      }}
      modalDisclosure={modalDisclosure}
      content={{
        heading: "Delete",
        actionButtonText: "Yes, delete program",
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        You will lose all information entered for this program. Are you sure you
        want to proceed?
      </Text>
    </Modal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
