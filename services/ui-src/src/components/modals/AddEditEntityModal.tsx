import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, EntityShape, ReportStatus } from "types";
import { useUser } from "utils";

export const AddEditEntityModal = ({
  entityType,
  modalData,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { form, addTitle, editTitle, message } = modalData;

  // shape entity data for hydration
  const formData = { fieldData: selectedEntity };

  const writeEntity = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
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
      const updatedEntities = [...currentEntities];

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
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
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedEntity?.id ? editTitle : addTitle,
        actionButtonText: submitting ? <Spinner size="small" /> : "Save",
      }}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={form.id}
        formJson={form}
        formData={formData}
        onSubmit={writeEntity}
      />
      <Text sx={sx.bottomMessage}>{message}</Text>
    </Modal>
  );
};

interface Props {
  entityType: string;
  modalData: AnyObject;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  bottomMessage: {
    fontSize: "xs",
    color: "palette.primary_darker",
    marginTop: "1rem",
    marginBottom: "-1rem",
  },
};
