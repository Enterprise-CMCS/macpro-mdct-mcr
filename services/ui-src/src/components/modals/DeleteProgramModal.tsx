import { useContext, useState } from "react";
// components
import { Spinner, Text } from "@chakra-ui/react";
import { Modal, ReportContext } from "components";
import { AnyObject } from "types";
import theme from "styles/theme";

export const DeleteProgramModal = ({
  selectedReportMetadata,
  modalDisclosure,
}: Props) => {
  const { fetchReportsByState, removeReport } = useContext(ReportContext);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteProgramHandler = async () => {
    setLoading(true);
    const reportDetails = {
      state: selectedReportMetadata.state,
      reportId: selectedReportMetadata.reportId,
    };
    await removeReport(reportDetails);
    await fetchReportsByState(selectedReportMetadata.state);
    setLoading(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      onConfirmHandler={deleteProgramHandler}
      modalDisclosure={modalDisclosure}
      content={{
        heading: "Delete",
        actionButtonText: loading ? (
          <Spinner color={theme.colors.white} size="md" />
        ) : (
          "Yes, delete program"
        ),
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
