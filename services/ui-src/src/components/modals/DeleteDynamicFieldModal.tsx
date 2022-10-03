// components
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Modal } from "components";
import { useState } from "react";
// types
import { EntityShape, EntityType } from "types";

export const DeleteDynamicFieldModal = ({
  selectedRecord,
  removeRecord,
  entityType,
  modalDisclosure,
}: Props) => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const convertToReadableEntityName = (name: any) => {
    const fieldTypeMap = {
      plans: "Plan",
      bssEntities: "BSS Entity",
    };
    const fieldType: keyof typeof fieldTypeMap = name;
    return fieldTypeMap[fieldType];
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
        heading: `Delete ${convertToReadableEntityName(entityType)}`,
        actionButtonText: deleting ? (
          <Spinner size="small" />
        ) : (
          `Yes, delete ${convertToReadableEntityName(entityType)}`
        ),
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        Are you sure you want to delete this{" "}
        {convertToReadableEntityName(entityType)}? Once deleted it will also
        remove any additional information related to the{" "}
        {convertToReadableEntityName(entityType)} throughout the report.
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
