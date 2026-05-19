import { useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
// types
import { EntityType, EntityShape } from "types";

export const DeleteDynamicFieldRecordModal = ({
  selectedRecord,
  deleteRecord,
  entityType,
  modalDisclosure,
}: Props) => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const fieldTypeMap: any = {
    plans: "plan",
    bssEntities: "BSS entity",
    ilos: "In Lieu of Services",
    measure_rates: "performance rate name",
  };

  const isIlos = entityType === EntityType.ILOS;
  const entityName = fieldTypeMap[entityType];

  const deleteProgramHandler = async () => {
    setDeleting(true);
    await deleteRecord(selectedRecord);
    setDeleting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={deleting}
      content={{
        heading: `Delete ${entityName}?`,
        actionButtonText: `Yes, delete ${isIlos ? "ILOS" : entityName}`,
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        {isIlos
          ? "You will lose all information entered for this ILOS throughout the report. Are you sure you want to proceed?"
          : `Are you sure you want to delete this ${entityName}? Once deleted it will also remove any additional information related to the ${entityName} throughout the report.`}
      </Text>
    </Modal>
  );
};

interface Props {
  selectedRecord?: EntityShape;
  deleteRecord: Function;
  entityType: EntityType;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
