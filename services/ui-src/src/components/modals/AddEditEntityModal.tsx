import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, EntityShape, FormJson, ReportStatus } from "types";
import { useUser } from "utils";

export const AddEditEntityModal = ({
  entityType,
  modalForm,
  verbiage,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const writeEntity = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + modalForm.id + "]");
    submitButton?.setAttribute("disabled", "true");

    const reportKeys = {
      state: report?.state,
      id: report?.id,
    };
    let dataToWrite = {
      lastAlteredBy: full_name,
      reportStatus: ReportStatus.IN_PROGRESS,
      fieldData: {},
    };
    const currentEntities = report?.fieldData?.[entityType] || [];
    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        ...currentEntities[selectedEntityIndex],
        ...formData,
      };
      dataToWrite.fieldData = { [entityType]: updatedEntities };
    } else {
      // create new entity
      dataToWrite.fieldData = {
        [entityType]: [...currentEntities, { id: uuid(), ...formData }],
      };
    }
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-entity-modal"
      formId={modalForm.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedEntity?.id
          ? verbiage.addEditModalEditTitle
          : verbiage.addEditModalAddTitle,
        actionButtonText: submitting ? <Spinner size="small" /> : "Save",
      }}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={modalForm.id}
        formJson={modalForm}
        formData={selectedEntity}
        onSubmit={writeEntity}
      />
      <Text sx={sx.bottomModalMessage}>{verbiage.addEditModalMessage}</Text>
    </Modal>
  );
};

interface Props {
  entityType: string;
  modalForm: FormJson;
  verbiage: AnyObject;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  bottomModalMessage: {
    fontSize: "xs",
    color: "palette.primary_darker",
    marginTop: "1rem",
    marginBottom: "-1rem",
  },
};
