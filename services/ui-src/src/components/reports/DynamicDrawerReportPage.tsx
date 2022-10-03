import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import { AddEditRecordModal, ReportContext } from "components";
// utils
import { AnyObject, DynamicDrawerReportPageShape } from "types";

export const DynamicDrawerReportPage = ({ route }: Props) => {
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
      <Box style={sx.recordTable}>
        <Heading as="h3" sx={sx.tableTitle}>
          {dashboard.title}
        </Heading>
        {records?.map((record: AnyObject) => {
          return (
            <div key={JSON.stringify(record)}>
              <span>{JSON.stringify(record)}</span>
            </div>
          );
        })}
        {/* TODO: Add cards here */}
        <Button
          sx={sx.addRecordButton}
          onClick={() => openAddEditRecordModal()}
        >
          {dashboard.addRecordButtonText}
        </Button>
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
  route: DynamicDrawerReportPageShape;
  setSubmitting: Function;
}

const sx = {
  tableTitle: {
    paddingBottom: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    color: "palette.gray_medium",
    fontSize: "lg",
    fontWeight: "bold",
  },
  recordTable: {
    marginBottom: "2rem",
  },
  addRecordButton: {
    marginTop: "2rem",
  },
};
