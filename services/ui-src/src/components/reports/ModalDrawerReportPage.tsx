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
  const { entityType, dashboard, modal, drawer } = route;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { report, updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  // shape entity data for hydration
  const formHydrationData = {
    fieldData: reportFieldDataEntities?.find(
      (entity: EntityShape) => entity.id === selectedEntity?.id
    ),
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
          onClick={addEditEntityModalOnOpenHandler}
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
            entityType={entityType}
            dashboard={dashboard}
            formattedEntityData={getFormattedEntityData(entity)}
            openAddEditEntityModal={openAddEditEntityModal}
            openDeleteEntityModal={openDeleteEntityModal}
            openDrawer={openDrawer}
          />
        ))}
        <AddEditEntityModal
          entityType={entityType}
          selectedEntity={selectedEntity}
          modalData={modal}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          entityType={entityType}
          selectedEntity={selectedEntity}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
          data-testid="deleteEntityModal"
        />
        <ReportDrawer
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          drawerTitle={drawer.title}
          drawerDetails={getFormattedEntityData(selectedEntity)}
          form={drawer.form}
          onSubmit={onSubmit}
          formData={formHydrationData}
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
