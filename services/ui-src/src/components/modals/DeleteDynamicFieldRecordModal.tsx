import { useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
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
  const fieldTypeMap = {
    plans: "Plan",
    bssEntities: "BSS Entity",
  };

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
      content={{
        heading: `Delete ${fieldTypeMap[entityType]}`,
        actionButtonText: deleting ? (
          <Spinner size="small" />
        ) : (
          `Yes, delete ${fieldTypeMap[entityType]}`
        ),
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        Are you sure you want to delete this {fieldTypeMap[entityType]}? Once
        deleted it will also remove any additional information related to the{" "}
        {fieldTypeMap[entityType]} throughout the report.
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
