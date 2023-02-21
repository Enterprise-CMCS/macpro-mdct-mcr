import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, EntityShape, FormJson, ReportStatus } from "types";
import { filterFormData, useUser } from "utils";

export const AddEditEntityModal = ({
  entityType,
  form,
  verbiage,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const writeEntity = async (enteredData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };
    let dataToWrite = {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: {},
    };
    const currentEntities = report?.fieldData?.[entityType] || [];
    const filteredFormData = filterFormData(enteredData, form.fields);
    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };
      dataToWrite.fieldData = { [entityType]: updatedEntities };
    } else {
      // create new entity
      dataToWrite.fieldData = {
        [entityType]: [...currentEntities, { id: uuid(), ...filteredFormData }],
      };
    }
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-entity-modal"
      formId={form.id}
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
        id={form.id}
        formJson={form}
        formData={selectedEntity}
        onSubmit={writeEntity}
      />
      <Text sx={sx.bottomModalMessage}>{verbiage.addEditModalMessage}</Text>
    </Modal>
  );
};

interface Props {
  entityType: string;
  form: FormJson;
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
