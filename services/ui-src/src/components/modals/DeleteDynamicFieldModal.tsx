// components
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Modal } from "components";
import { EntityShape, EntityType } from "types";

export const DeleteDynamicFieldModal = ({
  selectedRecord,
  removeRecord,
  entityType,
  submitting,
  modalDisclosure,
}: Props) => {
  const convertToReadableEntityName = (name: any) => {
    const fieldTypeMap = {
      plans: "Plan",
      bssEntities: "BSS Entity",
    };
    const fieldType: keyof typeof fieldTypeMap = name;
    return fieldTypeMap[fieldType];
  };

  const deleteProgramHandler = async () => {
    removeRecord(selectedRecord);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      content={{
        heading: `Delete ${convertToReadableEntityName(entityType)}`,
        actionButtonText: submitting ? (
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
  submitting?: boolean;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
