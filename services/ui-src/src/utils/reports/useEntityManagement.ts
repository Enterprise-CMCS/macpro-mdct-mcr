import { ReportContext } from "components";
import { useContext, useState } from "react";
import uuid from "react-uuid";
import {
  AnyObject,
  EntityShape,
  EntityType,
  FormJson,
  isFieldElement,
  ReportShape,
  ReportStatus,
} from "types";
import { useStore } from "utils";
import {
  cleanSuppressed,
  filterFormData,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
} from "utils/forms/forms";
import { entityWasUpdated } from "./entities";

export const useEntityManagement = ({
  entityType,
  report,
  form,
  addEntityForm,
  selectedEntity,
  selectedIsCustomEntity,
  canAddEntities,
  onSuccess,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { updateReport } = useContext(ReportContext);
  const { full_name, state, userIsEndUser } = useStore().user ?? {};

  const submitEntity = async (enteredData: AnyObject) => {
    if (!userIsEndUser) return;

    setSubmitting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state,
      id: report?.id,
    };

    // Check if form has suppressed fields
    cleanSuppressed(enteredData);

    const currentEntities = [...(report?.fieldData[entityType] || [])];
    let selectedEntityIndex = currentEntities.findIndex(
      (entity: EntityShape) => entity.id == selectedEntity?.id
    );

    // if new custom entity, set index to append to array
    if (canAddEntities && selectedEntityIndex < 0) {
      selectedEntityIndex = currentEntities.length;
    }

    let referenceForm = form;
    if (selectedIsCustomEntity) {
      referenceForm = addEntityForm;
    }

    const filteredFormData = filterFormData(
      enteredData,
      referenceForm.fields.filter(isFieldElement)
    );

    const entriesToClear = getEntriesToClear(
      enteredData,
      referenceForm.fields.filter(isFieldElement)
    );

    const newEntity = {
      ...(selectedEntity || { id: uuid() }),
      ...filteredFormData,
    };

    // Additional transforms can be injected here

    const newEntities = currentEntities;
    newEntities[selectedEntityIndex] = newEntity;
    newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
      newEntities[selectedEntityIndex],
      entriesToClear
    );

    const shouldSave = entityWasUpdated(
      entities[selectedEntityIndex],
      newEntity
    );

    if (shouldSave) {
      const dataToWrite = {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: full_name,
        },
        fieldData: {
          [entityType]: newEntities,
        },
      };
      await updateReport(reportKeys, dataToWrite);
    }
    setSubmitting(false);
    onSuccess?.();
  };

  const entities = report?.fieldData?.[entityType] || [];

  console.log("entities:", entities);

  return {
    submitEntity,
    entities,
    submitting,
  };
};

interface Props {
  entityType: EntityType;
  report: ReportShape;
  form: FormJson;
  addEntityForm: FormJson;
  selectedEntity?: EntityShape;
  selectedIsCustomEntity?: boolean;
  canAddEntities?: boolean;
  onSuccess?: () => void;
}
