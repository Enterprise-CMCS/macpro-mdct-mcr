import { useContext } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import { AddEditEntityModal, EntityCard, ReportContext } from "components";
// utils
import { AnyObject, ModalDrawerReportPageShape } from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  const { entityType, dashboard, modal } = route;
  const { report } = useContext(ReportContext);
  const entities = report?.fieldData[entityType];

  // add/edit entity modal disclosure
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = () => {
    // use disclosure to open modal
    addEditEntityModalOnOpenHandler();
  };

  return (
    <Box data-testid="dynamic-drawer-section">
      <Box>
        <Button
          sx={sx.addEntityButton}
          onClick={() => openAddEditEntityModal()}
        >
          {dashboard.addEntityButtonText}
        </Button>
        {entities && (
          <>
            <Heading as="h4" sx={sx.dashboardTitle}>
              {dashboard.title}
            </Heading>
            {entities.map((entity: AnyObject) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                modalData={modal}
                entityType={entityType}
              />
            ))}
          </>
        )}
        <AddEditEntityModal
          entityType={entityType}
          modalData={modal}
          selectedEntity={undefined}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: addEditEntityModalOnCloseHandler,
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
  addEntityButton: {
    marginBottom: "2rem",
  },
};
