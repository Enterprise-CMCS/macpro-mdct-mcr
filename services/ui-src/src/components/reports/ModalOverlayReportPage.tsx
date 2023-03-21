import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import { EntityShape, ModalOverlayReportPageShape } from "types";
// utils
import { getFormattedEntityData } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/mlr/mlr-accordions";

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

  return (
    <Box data-testid="modal-overlay-report-page">
      {verbiage.intro && (
        <ReportPageIntro
          text={verbiage.intro}
          accordion={accordionVerbiage.formIntro}
        />
      )}
      <Box sx={sx.dashboardBox}>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
        {reportFieldDataEntities.length === 0 && (
          <Box>{verbiage.emptyDashboardText}</Box>
        )}
        <Button
          sx={sx.addEntityButton}
          onClick={() => openAddEditEntityModal()}
        >
          {verbiage.addEntityButtonText}
        </Button>
      </Box>
      <ReportPageFooter />
      {reportFieldDataEntities.map(
        (entity: EntityShape, entityIndex: number) => (
          <EntityRow
            key={entity.id}
            entity={entity}
            entityIndex={entityIndex}
            entityType={entityType}
            verbiage={verbiage}
            formattedEntityData={getFormattedEntityData(
              entityType,
              entity,
              report?.fieldData
            )}
            openAddEditEntityModal={openAddEditEntityModal}
          />
        )
      )}
      {report && (
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
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
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

  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
