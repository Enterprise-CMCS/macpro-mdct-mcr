import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Form, Modal, ReportContext } from "components";
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportStatus } from "types";
import { useUser } from "utils";

export const AddEditRecordModal = ({
  dynamicType,
  modal,
  selectedRecord,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { form, addTitle, editTitle, message } = modal;

  const writeRecord = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");

    const reportKeys = {
      state: report?.state,
      id: report?.id,
    };
    const currentDynamicTypeRecords = report?.fieldData?.[dynamicType] || [];
    if (selectedRecord?.id) {
      // if existing record selected, edit
      const selectedRecordIndex = currentDynamicTypeRecords.indexOf(
        (record: AnyObject) => record.id === selectedRecord.id
      );
      const updatedDynamicTypeRecords = currentDynamicTypeRecords.splice(
        selectedRecordIndex,
        1,
        {
          id: selectedRecord.id,
          ...formData,
        }
      );
      await updateReport(reportKeys, {
        lastAlteredBy: full_name,
        reportStatus: ReportStatus.IN_PROGRESS,
        fieldData: {
          [dynamicType]: updatedDynamicTypeRecords,
        },
      });
    } else {
      // create new record
      const datatowrite = {
        lastAlteredBy: full_name,
        reportStatus: ReportStatus.IN_PROGRESS,
        fieldData: {
          [dynamicType]: [
            ...currentDynamicTypeRecords,
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
      data-testid="add-edit-record-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedRecord?.id ? editTitle : addTitle,
        actionButtonText: submitting ? <Spinner size="small" /> : "Save",
      }}
    >
      <Form
        data-testid="add-edit-record-form"
        id={form.id}
        formJson={form}
        formData={selectedRecord}
        onSubmit={writeRecord}
      />
      <Text sx={sx.bottomMessage}>{message}</Text>
    </Modal>
  );
};

interface Props {
  dynamicType: string;
  modal: AnyObject;
  selectedRecord?: AnyObject;
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
