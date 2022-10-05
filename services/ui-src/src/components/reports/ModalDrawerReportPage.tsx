import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  EntityCard,
  ReportContext,
  ReportDrawer,
} from "components";
// utils
import { AnyObject, EntityShape, ModalDrawerReportPageShape } from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  const { entityType, dashboard, modal, drawer } = route;
  const { report } = useContext(ReportContext);
  const [selectedEntity, setSelectedEntity] = useState<AnyObject>({});
  const entities = report?.fieldData[entityType] || [];
  const formData = { fieldData: entityType };
  console.log("formData", formData);

  // add/edit entity modal disclosure
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  // drawer disclosure
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpenHandler,
    onClose: drawerOnCloseHandler,
  } = useDisclosure();

  const openDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const openAddEditEntityModal = () => {
    setSelectedEntity({});
    /*
     * TODO: setSelectedEntity if editing an existing entity
     * if (report && entityId) {
     *   // pre-fill form if editing an existing entity
     *   setSelectedEntity(report.fieldData[entityType]);
     * }
     */
    // use disclosure to open modal
    addEditEntityModalOnOpenHandler();
  };

  const onSubmit = async () => {
    // if (userIsStateUser || userIsStateRep) {
    //   setSubmitting(true);
    //   const reportKeys = {
    //     state: state,
    //     id: report?.id,
    //   };
    //   const currentEntities = [...(report?.fieldData[entityType] || {})];
    //   const currentEntityIndex = report?.fieldData[entityType].findIndex(
    //     (entity: EntityShape) => entity.name === currentEntity?.name
    //   );
    //   const newEntity = {
    //     ...currentEntity,
    //     ...formData,
    //   };
    //   let newEntities = currentEntities;
    //   newEntities[currentEntityIndex] = newEntity;
    //   const dataToWrite = {
    //     status: ReportStatus.IN_PROGRESS,
    //     lastAlteredBy: full_name,
    //     fieldData: {
    //       [entityType]: newEntities,
    //     },
    //   };
    //   await updateReport(reportKeys, dataToWrite);
    //   setSubmitting(false);
    // }
    // onClose();
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
        {entities.length !== 0 && (
          <Heading as="h3" sx={sx.dashboardTitle}>
            {dashboard.title}
          </Heading>
        )}
        {entities.map((entity: AnyObject) => (
          <EntityCard key={entity.id} entity={entity} openDrawer={openDrawer} />
        ))}
        <AddEditEntityModal
          entityType={entityType}
          modalData={modal}
          selectedEntity={selectedEntity}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: addEditEntityModalOnCloseHandler,
          }}
        />
        <ReportDrawer
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: drawerOnCloseHandler,
          }}
          drawerTitle={drawer.title}
          drawerInfo={drawer.info}
          form={drawer.form}
          onSubmit={onSubmit}
          formData={formData}
          // submitting={submitting}
          data-testid="report-drawer"
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
