// components
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Modal } from "components";

export const DeleteProgramModal = ({ submitting, modalDisclosure }: Props) => {
  return (
    <Modal
      onConfirmHandler={() => {
        /* TODO: change delete to archive */
        modalDisclosure.onClose();
      }}
      modalDisclosure={modalDisclosure}
      content={{
        heading: "Delete",
        actionButtonText: submitting ? (
          <Spinner size="small" />
        ) : (
          "Yes, delete program"
        ),
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
  submitting?: boolean;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
