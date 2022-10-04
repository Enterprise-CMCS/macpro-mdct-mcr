import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditRecordModal,
  DynamicDrawerRecordCard,
  ReportContext,
} from "components";
// utils
import { AnyObject, ModalDrawerReportPageShape } from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  const { dynamicType, dashboard, modal } = route;
  const { report } = useContext(ReportContext);
  const [selectedRecord, setSelectedRecord] = useState<AnyObject>({});
  const records = report?.fieldData[dynamicType];

  // add/edit record modal disclosure
  const {
    isOpen: addEditRecordModalIsOpen,
    onOpen: addEditRecordModalOnOpenHandler,
    onClose: addEditRecordModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditRecordModal = (recordId?: string) => {
    if (report && recordId) {
      // pre-fill form if if editing an existing record
      setSelectedRecord(report.fieldData[dynamicType]);
    }
    // use disclosure to open modal
    addEditRecordModalOnOpenHandler();
  };

  return (
    <Box data-testid="dynamic-drawer-section">
      <Box>
        <Button
          sx={sx.addRecordButton}
          onClick={() => openAddEditRecordModal()}
        >
          {dashboard.addRecordButtonText}
        </Button>
        {records && (
          <Heading as="h4" sx={sx.dashboardTitle}>
            {dashboard.title}
          </Heading>
        )}
        {records?.map((record: AnyObject) => (
          <DynamicDrawerRecordCard key={record.id} record={record} />
        ))}
        <AddEditRecordModal
          dynamicType={dynamicType}
          modal={modal}
          selectedRecord={selectedRecord}
          modalDisclosure={{
            isOpen: addEditRecordModalIsOpen,
            onClose: addEditRecordModalOnCloseHandler,
          }}
        />
      </Box>
    </Box>
  );
};

interface Props {
  route: ModalDrawerReportPageShape;
  setSubmitting: Function;
}

const sx = {
  dashboardTitle: {
    marginBottom: "1.25rem",
    marginLeft: "0.75rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addRecordButton: {
    marginBottom: "2rem",
  },
};
