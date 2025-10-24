import { useContext, useState } from "react";
// components
import { Box, Button, Heading, Image, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityCard,
  ReportContext,
  ReportDrawer,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// types
import {
  AnyObject,
  EntityShape,
  FormField,
  isFieldElement,
  EntityType,
  ModalDrawerReportPageShape,
  ReportStatus,
} from "types";
// utils
import {
  filterFormData,
  getFormattedEntityData,
  createRepeatedFields,
  useStore,
  entityWasUpdated,
  getEntriesToClear,
  setClearedEntriesToDefaultValue,
  resetClearProp,
  parseCustomHtml,
  getAddEditDrawerText,
} from "utils";
// assets
import addIcon from "assets/icons/icon_add.png";

export const ModalDrawerReportPage = ({ route, validateOnRender }: Props) => {
  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();
  const { entityType, verbiage, modalForm, drawerForm: drawerFormJson } = route;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const formattedEntityData = getFormattedEntityData(
    entityType,
    selectedEntity,
    report?.fieldData
  );

  const { updateReport } = useContext(ReportContext);
  const reportFieldDataEntities = report?.fieldData[entityType] || [];

  // check if there is at least one (1) plan prior to being able to enter Sanctions
  const checkForPlans = () => {
    if (entityType === EntityType.SANCTIONS) {
      return report?.fieldData["plans"]?.length;
    }
    return true;
  };

  // create drawerForm from json with repeated fields
  const drawerForm = { ...drawerFormJson };
  const formContainsFieldsToRepeat = drawerFormJson.fields
    .filter(isFieldElement)
    .find((field: FormField) => field.repeat);
  if (formContainsFieldsToRepeat) {
    drawerForm.fields = createRepeatedFields(
      drawerFormJson.fields.filter(isFieldElement),
      report?.fieldData
    );
  }

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
    resetClearProp(modalForm.fields);
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

  const openOverlayOrDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    drawerOnOpenHandler();
  };

  const closeDrawer = () => {
    setSelectedEntity(undefined);
    resetClearProp(drawerForm.fields);
    drawerOnCloseHandler();
  };

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || [])];
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        drawerForm.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        drawerForm.fields.filter(isFieldElement)
      );
      const newEntity = {
        ...selectedEntity,
        ...filteredFormData,
      };
      let newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        newEntities[selectedEntityIndex],
        entriesToClear
      );
      const shouldSave = entityWasUpdated(
        reportFieldDataEntities[selectedEntityIndex],
        newEntity
      );
      if (shouldSave) {
        const dataToWrite = {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: full_name,
          },
          fieldData: {
            [entityType]: newEntities,
          },
        };
        await updateReport(reportKeys, dataToWrite);
      }
      setSubmitting(false);
    }
    closeDrawer();
  };

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Box>
        {!checkForPlans() ? (
          <Box sx={sx.missingEntityMessage} data-testid="missingEntityMessage">
            {parseCustomHtml(verbiage.missingEntityMessage || "")}
          </Box>
        ) : (
          <Box>
            <Button
              sx={sx.topAddEntityButton}
              onClick={addEditEntityModalOnOpenHandler}
            >
              {verbiage.addEntityButtonText}
            </Button>
            {reportFieldDataEntities.length > 0 && (
              <Heading as="h3" sx={sx.dashboardTitle}>
                {dashTitle}
              </Heading>
            )}
            {reportFieldDataEntities.map(
              (entity: EntityShape, entityIndex: number) => (
                <EntityCard
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
                  openDeleteEntityModal={openDeleteEntityModal}
                  openOverlayOrDrawer={openOverlayOrDrawer}
                />
              )
            )}
          </Box>
        )}
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
          entityType={entityType}
          selectedEntity={selectedEntity!}
          verbiage={{
            ...verbiage,
            drawerTitle: getAddEditDrawerText(
              entityType,
              formattedEntityData,
              verbiage
            ),
            drawerDetails: getFormattedEntityData(
              entityType,
              selectedEntity,
              report?.fieldData
            ),
          }}
          form={drawerForm}
          onSubmit={onSubmit}
          submitting={submitting}
          drawerDisclosure={{
            isOpen: drawerIsOpen,
            onClose: closeDrawer,
          }}
          validateOnRender={validateOnRender}
          data-testid="report-drawer"
        />
        {reportFieldDataEntities.length > 1 && (
          <Button
            sx={sx.bottomAddEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        )}
      </Box>
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ModalDrawerReportPageShape;
  validateOnRender?: boolean;
}

const sx = {
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
  },
  topAddEntityButton: {
    marginTop: "spacer3",
    marginBottom: "spacer4",
  },
  bottomAddEntityButton: {
    marginTop: "spacer4",
    marginBottom: "0",
  },
  missingEntityMessage: {
    paddingTop: "spacer2",
    fontWeight: "bold",
    a: {
      color: "primary",
      textDecoration: "underline",
      "&:hover": {
        color: "primary_darker",
      },
    },
    ol: {
      paddingLeft: "spacer2",
    },
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "spacer_half",
    },
    th: {
      paddingLeft: "spacer2",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      ".tablet &, .mobile &": {
        border: "none",
      },
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "260px",
      },
    },
  },
};
