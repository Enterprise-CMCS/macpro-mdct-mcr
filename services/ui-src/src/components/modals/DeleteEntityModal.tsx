import { useContext, useState } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";
// constants
import { planComplianceStandardKey } from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  ReportStatus,
  ReportType,
} from "types";
// utils
import { useStore } from "utils";

export const DeleteEntityModal = ({
  entityType,
  selectedEntity,
  verbiage,
  modalDisclosure,
}: Props) => {
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();
  const locked = report?.locked;

  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteProgramHandler = async () => {
    setDeleting(true);
    const reportKeys = {
      reportType: report?.reportType,
      state: report?.state,
      id: report?.id,
    };
    const currentEntities = report?.fieldData?.[entityType] || [];
    const updatedEntities = currentEntities.filter(
      (entity: EntityShape) => entity.id !== selectedEntity?.id
    );

    const updatedFieldData = {
      [entityType]: updatedEntities,
    };

    // If NAAAR standard is deleted, also remove it from plans
    if (
      reportKeys.reportType === ReportType.NAAAR &&
      entityType === EntityType.STANDARDS
    ) {
      const updatedPlans = report?.fieldData.plans || [];
      const deletedStandardKey = `${planComplianceStandardKey}-${selectedEntity?.id}`;

      updatedPlans.forEach((plan: AnyObject) => {
        for (const key in plan) {
          if (key.startsWith(deletedStandardKey)) {
            delete plan[key];
          }
        }
      });

      updatedFieldData.plans = updatedPlans;
    }

    await updateReport(reportKeys, {
      metadata: {
        lastAlteredBy: full_name,
        status: ReportStatus.IN_PROGRESS,
      },
      fieldData: updatedFieldData,
    });
    setDeleting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      submitting={deleting}
      content={{
        heading: verbiage.deleteModalTitle,
        actionButtonText: verbiage.deleteModalConfirmButtonText,
        closeButtonText: "Cancel",
      }}
      submitButtonDisabled={!userIsEndUser || locked}
    >
      <Text>{verbiage.deleteModalWarning}</Text>
    </Modal>
  );
};

interface Props {
  entityType: EntityType;
  selectedEntity?: EntityShape;
  verbiage: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
