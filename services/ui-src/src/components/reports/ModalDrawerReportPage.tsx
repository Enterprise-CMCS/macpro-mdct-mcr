import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityCard,
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// utils
import { getFormattedEntityData, useUser } from "utils";
import {
  AnyObject,
  EntityShape,
  ModalDrawerReportPageShape,
  ReportStatus,
} from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const { entityType, verbiage, modalForm, drawerForm } = route;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { report, updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

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

  // report drawer disclosure and methods
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpenHandler,
    onClose: drawerOnCloseHandler,
  } = useDisclosure();

  const openDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const closeDrawer = () => {
    setSelectedEntity(undefined);
    drawerOnCloseHandler();
  };

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const currentEntities = reportFieldDataEntities;
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const newEntity = {
        ...selectedEntity,
        ...formData,
      };
      let newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
        fieldData: {
          [entityType]: newEntities,
        },
      };
      await updateReport(reportKeys, dataToWrite);
      setSubmitting(false);
    }
    closeDrawer();
  };

  return (
    <Box data-testid="modal-drawer-report-page">
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        <Button
          sx={sx.addEntityButton}
          onClick={addEditEntityModalOnOpenHandler}
        >
          {verbiage.addEntityButtonText}
        </Button>
        {reportFieldDataEntities.length !== 0 && (
          <Heading as="h3" sx={sx.dashboardTitle}>
            {verbiage.dashboardTitle}
          </Heading>
        )}
        {reportFieldDataEntities.map((entity: EntityShape) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            entityType={entityType}
            verbiage={verbiage}
            formattedEntityData={getFormattedEntityData(entityType, entity)}
            openAddEditEntityModal={openAddEditEntityModal}
            openDeleteEntityModal={openDeleteEntityModal}
            openDrawer={openDrawer}
          />
        ))}
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
        <ReportDrawer
          selectedEntity={selectedEntity!}
          verbiage={{
            ...verbiage,
            drawerDetails: getFormattedEntityData(entityType, selectedEntity),
          }}
          form={drawerForm}
          onSubmit={onSubmit}
          submitting={submitting}
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          data-testid="report-drawer"
        />
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalDrawerReportPageShape;
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
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
};
