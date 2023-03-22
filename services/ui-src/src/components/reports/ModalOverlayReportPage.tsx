import { useContext, useState } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Table,
  Th,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import {
  EntityShape,
  ModalOverlayReportPageShape,
  ModalOverlayReportPageVerbiage,
} from "types";
// utils
import { sanitizeAndParseHtml } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";

export const ModalOverlayReportPage = ({ route }: Props) => {
  const { entityType, verbiage, modalForm } = route;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const { report } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

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
    <Box data-testid="modal-overlay-report-page">
      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          accordion={accordionVerbiage.MLR.formIntro}
        />
      )}
      <Box sx={sx.dashboardBox}>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {reportFieldDataEntities.length === 0 ? (
          <Box>{verbiage.emptyDashboardText}</Box>
        ) : (
          <Table>
            <TableHeader verbiage={verbiage} />
            {reportFieldDataEntities.map(
              (entity: EntityShape, entityIndex: number) => (
                <EntityRow
                  key={entity.id}
                  entity={entity}
                  entityIndex={entityIndex}
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

const TableHeader = ({ verbiage }: TableHeaderProps) => {
  return (
    <>
      <Th></Th>
      <Th sx={sx.header}>{sanitizeAndParseHtml(verbiage.tableHeader)}</Th>
      <Th></Th>
      <Th></Th>
      <Th></Th>
    </>
  );
};

interface TableHeaderProps {
  verbiage: ModalOverlayReportPageVerbiage;
}

const sx = {
  dashboardBox: { textAlign: "center" },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
  },
  header: {
    textTransform: "none",
    fontSize: "14px",
    color: "#71767A",
    br: {
      marginBottom: "0.25rem",
    },
    "br-last-of-type": {
      marginBottom: "0",
    },
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
