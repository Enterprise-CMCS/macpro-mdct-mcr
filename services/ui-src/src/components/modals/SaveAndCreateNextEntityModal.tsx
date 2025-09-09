import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Text, Spinner } from "@chakra-ui/react";
import { Form, Modal, ReportContext } from "components";
// types
import {
  AnyObject,
  EntityType,
  FormJson,
  isFieldElement,
  ReportStatus,
} from "types";
// utils
import { filterFormData, useStore } from "utils";

export const SaveAndCreateNextEntityModal = ({
  entityType,
  form,
  verbiage,
  modalDisclosure,
}: Props) => {
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();

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
    const currentEntities = [...(report?.fieldData?.[entityType] || [])];
    const filteredFormData = filterFormData(
      enteredData,
      form.fields.filter(isFieldElement)
    );
    // create new entity
    dataToWrite.fieldData = {
      [entityType]: [...currentEntities, { id: uuid(), ...filteredFormData }],
    };
    await updateReport(reportKeys, dataToWrite);
    setSubmitting(false);

    // TODO: don't close modal if user selects "Save and create next"
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="save-and-create-next-entity-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: verbiage.addEditModalAddTitle,
        subheading: verbiage.addEditModalHint
          ? verbiage.addEditModalHint
          : undefined,
        actionButtonText: submitting ? (
          <Spinner size="md" />
        ) : report?.locked ? (
          "Close"
        ) : (
          "Save"
        ),
        closeButtonText: "Cancel",
      }}
    >
      <Form
        data-testid="add-edit-entity-form"
        id={form.id}
        formJson={form}
        onSubmit={
          report?.locked || !userIsEndUser
            ? modalDisclosure.onClose
            : writeEntity
        }
        validateOnRender={false}
        dontReset={true}
      />
      <Text>{verbiage.addEditModalMessage}</Text>
    </Modal>
  );
};

interface Props {
  entityType: EntityType;
  form: FormJson;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

// TODO: sx
