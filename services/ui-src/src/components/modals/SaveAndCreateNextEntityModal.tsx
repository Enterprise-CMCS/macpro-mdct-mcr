import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import { Spinner } from "@chakra-ui/react";
import { Form, Modal, ReportContext } from "components";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  FormJson,
  isFieldElement,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

export const SaveAndCreateNextEntityModal = ({
  entityType,
  form,
  verbiage,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name } = useStore().user ?? {};
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
    if (selectedEntity?.id) {
      // if existing entity selected, edit
      const entriesToClear = getEntriesToClear(
        enteredData,
        form.fields.filter(isFieldElement)
      );
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity.id
      );
      const updatedEntities = currentEntities;

      updatedEntities[selectedEntityIndex] = {
        id: selectedEntity.id,
        ...currentEntities[selectedEntityIndex],
        ...filteredFormData,
      };

      updatedEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        updatedEntities[selectedEntityIndex],
        entriesToClear
      );

      dataToWrite.fieldData = { [entityType]: updatedEntities };
      const shouldSave = entityWasUpdated(
        report?.fieldData?.[entityType][selectedEntityIndex],
        updatedEntities[selectedEntityIndex]
      );
      if (shouldSave) await updateReport(reportKeys, dataToWrite);
    } else {
      // create new entity
      dataToWrite.fieldData = {
        [entityType]: [...currentEntities, { id: uuid(), ...filteredFormData }],
      };
      await updateReport(reportKeys, dataToWrite);
    }
    setSubmitting(false);
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
      isSaveAndCreateAnother={true}
    >
      <Form
        data-testid="add-edit-another-entity-form"
        id={form.id}
        formJson={form}
        onSubmit={writeEntity}
        validateOnRender={false}
        dontReset={true}
      />
    </Modal>
  );
};

interface Props {
  entityType: EntityType;
  form: FormJson;
  verbiage: AnyObject;
  selectedEntity?: EntityShape;
  modalDisclosure: {
    isOpen: boolean;
    onOpen: any;
    onClose: any;
  };
}
