import { useContext } from "react";
// components
import { Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";

export const DeleteProgramModal = ({
  activeState,
  selectedReportId,
  modalDisclosure,
  fetchReportsByState,
}: Props) => {
  const { removeReport } = useContext(ReportContext);

  const deleteProgramHandler = async () => {
    // guard against no active state
    if (activeState) {
      const reportDetails = {
        state: activeState,
        reportId: selectedReportId,
      };
      await removeReport(reportDetails);
      await fetchReportsByState(activeState);
    }
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
      <Text>
        You will lose all information entered for this program. Are you sure you
        want to proceed?
      </Text>
    </Modal>
  );
};

interface Props {
  activeState: string | undefined;
  selectedReportId: string | undefined;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  fetchReportsByState: Function;
}
