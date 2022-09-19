import { useContext } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";
import { AnyObject } from "types";

export const DeleteProgramModal = ({
  selectedReportMetadata,
  modalDisclosure,
}: Props) => {
  const { fetchReportsByState, removeReport } = useContext(ReportContext);

  const deleteProgramHandler = async () => {
    const reportKeys = {
      state: selectedReportMetadata.state,
      reportId: selectedReportMetadata.reportId,
    };
    await removeReport(reportKeys);
    await fetchReportsByState(selectedReportMetadata.state);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      content={{
        heading: "Delete",
        actionButtonText: "Yes, delete program",
        closeButtonText: "Cancel",
      }}
    >
      <Text data-testid="delete-program-modal-text">
        You will lose all information entered for this program. Are you sure you
        want to proceed?
      </Text>
    </Modal>
  );
};

interface Props {
  selectedReportMetadata: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
