import { useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
// types
import { EntityShape, EntityType } from "types";

export const DeleteDynamicFieldRecordModal = ({
  selectedRecord,
  removeRecord,
  entityType,
  modalDisclosure,
}: Props) => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const fieldTypeMap: any = {
    plans: "Plan",
    bssEntities: "BSS Entity",
  };

  const entityName = fieldTypeMap[entityType];

  const deleteProgramHandler = async () => {
    setDeleting(true);
    removeRecord(selectedRecord);
    setDeleting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={deleting}
      content={{
        heading: `Delete ${entityName}`,
        actionButtonText: `Yes, delete ${entityName}`,
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        Are you sure you want to delete this {entityName}? Once deleted it will
        also remove any additional information related to the {entityName}{" "}
        throughout the report.
      </Text>
    </Modal>
  );
};

interface Props {
  selectedRecord?: EntityShape;
  removeRecord: Function;
  entityType: EntityType;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
