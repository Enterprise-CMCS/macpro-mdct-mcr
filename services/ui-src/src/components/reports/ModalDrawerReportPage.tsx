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
import { useUser } from "utils";
import {
  AnyObject,
  EntityShape,
  ModalDrawerReportPageShape,
  ReportStatus,
} from "types";

export const ModalDrawerReportPage = ({ route }: Props) => {
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const { report, updateReport } = useContext(ReportContext);

  const { entityType, dashboard, modal, drawer } = route;
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const hydrationData = { fieldData: entityType };

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

  // delete modal disclosure
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = () => {
    setSelectedEntity(undefined); // TODO: remove
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

  const openDeleteEntityModal = (entity: EntityShape) => {
    setSelectedEntity(entity);
    deleteEntityModalOnOpenHandler();
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
    drawerOnCloseHandler();
  };

  const getFormattedEntityData = (entity?: EntityShape) => ({
    category: entity?.accessMeasure_generalCategory[0].value,
    standardDescription: entity?.accessMeasure_standardDescription,
    standardType:
      entity?.accessMeasure_standardType[0].value !== "Other, specify"
        ? entity?.accessMeasure_standardType[0].value
        : entity?.["accessMeasure_standardType-otherText"],
    provider:
      entity?.accessMeasure_providerType?.[0].value !== "Other, specify"
        ? entity?.accessMeasure_providerType?.[0].value
        : entity?.["accessMeasure_providerType-otherText"],
    region:
      entity?.accessMeasure_applicableRegion?.[0].value !== "Other, specify"
        ? entity?.accessMeasure_applicableRegion?.[0].value
        : entity?.["accessMeasure_applicableRegion-otherText"],
    population:
      entity?.accessMeasure_population?.[0].value !== "Other, specify"
        ? entity?.accessMeasure_population?.[0].value
        : entity?.["accessMeasure_population-otherText"],
    monitoringMethods: entity?.accessMeasure_monitoringMethods?.map(
      (method: AnyObject) =>
        method.value === "Other, specify"
          ? entity?.["accessMeasure_monitoringMethods-otherText"]
          : method.value
    ),
    methodFrequency:
      entity?.accessMeasure_oversightMethodFrequency?.[0].value !==
      "Other, specify"
        ? entity?.accessMeasure_oversightMethodFrequency?.[0].value
        : entity?.["accessMeasure_oversightMethodFrequency-otherText"],
  });

  return (
    <Box data-testid="modal-drawer-report-page">
      {route.intro && <ReportPageIntro text={route.intro} />}
      <Box>
        <Button
          sx={sx.addEntityButton}
          onClick={() => openAddEditEntityModal()}
        >
          {dashboard.addEntityButtonText}
        </Button>
        {reportFieldDataEntities.length !== 0 && (
          <Heading as="h3" sx={sx.dashboardTitle}>
            {dashboard.title}
          </Heading>
        )}
        {reportFieldDataEntities.map((entity: EntityShape) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            formattedEntityData={getFormattedEntityData(entity)}
            openDrawer={openDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
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
        <DeleteEntityModal
          entityType={entityType}
          selectedEntity={selectedEntity}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: deleteEntityModalOnCloseHandler,
          }}
        />
        <ReportDrawer
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: drawerOnCloseHandler,
          }}
          drawerTitle={drawer.title}
          drawerDetails={getFormattedEntityData(selectedEntity)}
          form={drawer.form}
          onSubmit={onSubmit}
          formData={hydrationData}
          submitting={submitting}
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
    marginBottom: "2rem",
  },
};
