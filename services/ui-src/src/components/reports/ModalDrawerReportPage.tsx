import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  EntityCard,
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// utils
import { useUser } from "utils";
import {
  AnyObject,
  EntityShape,
  ModalDrawerReportPageShape,
  ReportStatus,
} from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  // use state
  const [submitting, setSubmitting] = useState<boolean>(false);
  // user
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  // destructured props
  const { entityType, dashboard, modal, drawer } = route;
  // report & entity data
  const { report, updateReport } = useContext(ReportContext);
  const [selectedEntity, setSelectedEntity] = useState<AnyObject>({});
  const entities = report?.fieldData[entityType] || [];

  // hydration data
  const formData = { fieldData: entityType };

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

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || {})];
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.name === selectedEntity?.name
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
    drawerOnCloseHandler();
  };

  return (
    <>
      {route.intro && <ReportPageIntro text={route.intro} />}
      <Box data-testid="modal-drawer-report-page">
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
            <EntityCard
              key={entity.id}
              entity={entity}
              openDrawer={openDrawer}
            />
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
            submitting={submitting}
            data-testid="report-drawer"
          />
        </Box>
      </Box>
      <ReportPageFooter />
    </>
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
    marginBottom: "2rem",
  },
};
