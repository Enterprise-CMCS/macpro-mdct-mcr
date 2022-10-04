import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportStatus } from "types";
import { useUser } from "utils";

export const AddEditEntityModal = ({
  dynamicType,
  modal,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { form, addTitle, editTitle, message } = modal;

  const writeEntity = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    const reportKeys = {
      state: report?.state,
      id: report?.id,
    };
    const currentEntities = report?.fieldData?.[dynamicType] || [];
    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const selectedEntityIndex = currentEntities.indexOf(
        (entity: AnyObject) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities.splice(selectedEntityIndex, 1, {
        id: selectedEntity.id,
        ...formData,
      });
      await updateReport(reportKeys, {
        lastAlteredBy: full_name,
        reportStatus: ReportStatus.IN_PROGRESS,
        fieldData: {
          [dynamicType]: updatedEntities,
        },
      });
    } else {
      // create new entity
      const datatowrite = {
        lastAlteredBy: full_name,
        reportStatus: ReportStatus.IN_PROGRESS,
        fieldData: {
          [dynamicType]: [
            ...currentEntities,
            {
              id: uuid(),
              ...formData,
            },
          ],
        },
      };
      await updateReport(reportKeys, datatowrite);
    }
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
        formData={selectedEntity}
        onSubmit={writeEntity}
      />
      <Text sx={sx.bottomMessage}>{message}</Text>
    </Modal>
  );
};

interface Props {
  dynamicType: string;
  modal: AnyObject;
  selectedEntity?: AnyObject;
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
