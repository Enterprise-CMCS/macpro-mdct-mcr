// components
import { Text } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Modal, ReportContext } from "components";
import { useContext, useState } from "react";
// types
import { AnyObject, ReportStatus } from "types";
import { useUser } from "utils";

export const DeleteEntityModal = ({
  entityType,
  selectedEntity,
  modalDisclosure,
}: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name } = useUser().user ?? {};
  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteProgramHandler = async () => {
    setDeleting(true);
    const reportKeys = {
      state: report?.state,
      id: report?.id,
    };
    const currentEntities = report?.fieldData?.[entityType] || [];
    const updatedEntities = currentEntities.filter(
      (entity: AnyObject) => entity != selectedEntity
    );
    await updateReport(reportKeys, {
      lastAlteredBy: full_name,
      reportStatus: ReportStatus.IN_PROGRESS,
      fieldData: {
        [entityType]: updatedEntities,
      },
    });
    setDeleting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      content={{
        heading: `Delete access measure?`,
        actionButtonText: deleting ? (
          <Spinner size="small" />
        ) : (
          `Yes, Delete Measure`
        ),
        closeButtonText: "Cancel",
      }}
    >
      <Text>
        You will lose all information entered for this measure. Are you sure you
        want to proceed
      </Text>
    </Modal>
  );
};

interface Props {
  entityType: string;
  selectedEntity: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
