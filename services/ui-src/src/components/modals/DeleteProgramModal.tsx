import { useContext } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";
import { AnyObject } from "types";

export const DeleteProgramModal = ({
  activeState,
  selectedReportMetadata,
  modalDisclosure,
}: Props) => {
  const { fetchReportsByState, removeReport } = useContext(ReportContext);

  const deleteProgramHandler = async () => {
    const reportDetails = {
      state: activeState,
      reportId: selectedReportMetadata?.reportId,
    };
    await removeReport(reportDetails);
    await fetchReportsByState(activeState);
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
  activeState: string;
  selectedReportMetadata: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
