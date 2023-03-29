import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityRow,
  MobileEntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import { EntityShape, ModalOverlayReportPageShape } from "types";
// utils
import { useBreakpoint } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";

export const ModalOverlayReportPage = ({ route }: Props) => {
  const { isTablet, isMobile } = useBreakpoint();

  const { entityType, verbiage, modalForm } = route;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const { report } = useContext(ReportContext);
  const reportType = report?.reportType;
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: [""] };
    return { headRow: ["", verbiage.tableHeader, ""] };
  };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity: EntityShape) => {
    setSelectedEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  return (
    <Box sx={sx.content} data-testid="modal-overlay-report-page">
      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          accordion={
            accordionVerbiage[reportType as keyof typeof accordionVerbiage]
              ?.formIntro
          }
        />
      )}
      <Box sx={sx.dashboardBox}>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {reportFieldDataEntities.length === 0 ? (
          <>
            <hr />
            <Box sx={sx.emptyDashboard}>{verbiage.emptyDashboardText}</Box>
          </>
        ) : (
          <Table sx={sx.header} content={tableHeaders()}>
            {reportFieldDataEntities.map(
              (entity: EntityShape, entityIndex: number) =>
                isMobile || isTablet ? (
                  <MobileEntityRow
                    key={entityIndex}
                    entity={entity}
                    verbiage={verbiage}
                    openAddEditEntityModal={openAddEditEntityModal}
                    openDeleteEntityModal={openDeleteEntityModal}
                  />
                ) : (
                  <EntityRow
                    key={entity.id}
                    entity={entity}
                    verbiage={verbiage}
                    openAddEditEntityModal={openAddEditEntityModal}
                    openDeleteEntityModal={openDeleteEntityModal}
                  />
                )
            )}
          </Table>
        )}
        <Button
          sx={sx.addEntityButton}
          onClick={() => openAddEditEntityModal()}
        >
          {verbiage.addEntityButtonText}
        </Button>
      </Box>
      <ReportPageFooter />
      {report && (
        <>
          <AddEditEntityModal
            entityType={entityType}
            selectedEntity={selectedEntity}
            verbiage={verbiage}
            form={modalForm}
            modalDisclosure={{
              isOpen: addEditEntityModalIsOpen,
              onClose: closeAddEditEntityModal,
            }}
          />
          <DeleteEntityModal
            entityType={entityType}
            selectedEntity={selectedEntity}
            verbiage={verbiage}
            modalDisclosure={{
              isOpen: deleteEntityModalIsOpen,
              onClose: closeDeleteEntityModal,
            }}
          />
        </>
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardBox: {
    textAlign: "center",
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  header: {
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      paddingLeft: "1rem",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      ".tablet &, .mobile &": {
        border: "none",
      },
    },
  },
  emptyDashboard: {
    paddingTop: "2rem",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
};
