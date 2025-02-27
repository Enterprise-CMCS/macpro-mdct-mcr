import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
// components
import { Box, Button, Image, Heading, useDisclosure } from "@chakra-ui/react";
import {
  ReportDrawer,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Form,
  DeleteEntityModal,
  SortableDrawerReportPageTable,
} from "components";
// constants
import { getDefaultAnalysisMethodIds } from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  ReportStatus,
  isFieldElement,
  InputChangeEvent,
  FormJson,
  entityTypes,
  DrawerReportPageShape,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  getEntriesToClear,
  getForm,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";

// assets
import addIcon from "assets/icons/icon_add_blue.png";
import { DrawerReportPageEntityRows } from "./DrawerReportEntityRows";
import addIconWhite from "assets/icons/icon_add.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedIsCustomEntity, setSelectedIsCustomEntity] =
    useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report, selectedEntity, setSelectedEntity } = useStore();

  const { entityType, verbiage, form: standardForm } = route;
  const addEntityDrawerForm = route.addEntityDrawerForm || ({} as FormJson);
  const canAddEntities =
    !!addEntityDrawerForm.id || entityType === entityTypes[8];
  const entities = report?.fieldData?.[entityType] || [];

  const existingStandards =
    entityType === entityTypes[8] && entities.length > 0;

  // check if there are ILOS and associated plans
  const isMcparReport = route.path.includes("mcpar");
  const isAnalysisMethodsPage = route.path.includes("analysis-methods");
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length;
  const plans = report?.fieldData?.["plans"];
  const hasPlans = plans?.length;
  const isReportingOnStandards =
    route.path === "/naaar/program-level-access-and-network-adequacy-standards";
  const hasProviderTypes = report?.fieldData?.["providerTypes"]?.length > 0;

  const formParams = {
    route,
    report,
    isAnalysisMethodsPage,
    isReportingOnStandards,

    ilos,
    reportingOnIlos,
  };
  const form = getForm(formParams);
  const addEntityForm = getForm({ ...formParams, isCustomEntityForm: true });

  // on load, get reporting status from store
  const reportingOnPriorAuthorization =
    report?.fieldData?.["plan_priorAuthorizationReporting"]?.[0].value;
  const reportingOnPatientAccessApi =
    report?.fieldData?.["plan_patientAccessApiReporting"]?.[0].value;
  const [priorAuthDisabled, setPriorAuthDisabled] = useState<boolean>(
    reportingOnPriorAuthorization !== "Yes"
  );
  const [patientAccessDisabled, setPatientAccessDisabled] = useState<boolean>(
    reportingOnPatientAccessApi !== "Yes"
  );

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

  useEffect(() => {
    const isCustomEntity =
      // we are on a page where custom entities can be added
      canAddEntities &&
      // and the selectedEntity id is not in the default analysis methods list (only custom entity drawer page)
      !getDefaultAnalysisMethodIds().includes(selectedEntity?.id!);
    // enable logic for custom entity manipulation
    setSelectedIsCustomEntity(isCustomEntity);
  }, [selectedEntity]);

  const onChange = (e: InputChangeEvent) => {
    if (route.path === "/mcpar/plan-level-indicators/prior-authorization") {
      setPriorAuthDisabled(e.target.value !== "Yes");
    }
    if (route.path === "/mcpar/plan-level-indicators/patient-access-api") {
      setPatientAccessDisabled(e.target.value !== "Yes");
    }
  };

  const onSubmit = async (enteredData: AnyObject) => {
    if (userIsEndUser) {
      setSubmitting(true);
      const reportKeys = {
        reportType: report?.reportType,
        state,
        id: report?.id,
      };

      const currentEntities = [...(report?.fieldData[entityType] || [])];
      let selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id == selectedEntity?.id
      );

      // if new custom entity, set index to append to array
      if (canAddEntities && selectedEntityIndex < 0) {
        selectedEntityIndex = currentEntities.length;
      }

      let referenceForm = form;
      if (selectedIsCustomEntity) {
        referenceForm = addEntityForm;
      }
      const filteredFormData = filterFormData(
        enteredData,
        referenceForm.fields.filter(isFieldElement)
      );

      const entriesToClear = getEntriesToClear(
        enteredData,
        referenceForm.fields.filter(isFieldElement)
      );

      const newEntity = {
        ...(selectedEntity || { id: uuid() }),
        ...filteredFormData,
      };

      const newEntities = currentEntities;
      newEntities[selectedEntityIndex] = newEntity;
      newEntities[selectedEntityIndex] = setClearedEntriesToDefaultValue(
        newEntities[selectedEntityIndex],
        entriesToClear
      );
      const shouldSave = entityWasUpdated(
        entities[selectedEntityIndex],
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
    onClose();
  };

  const openRowDrawer = (entity?: EntityShape) => {
    setSelectedEntity(entity);
    onOpen();
  };

  const getDrawerTitle = () => {
    let name =
      selectedEntity?.name ||
      selectedEntity?.custom_analysis_method_name ||
      "Add other";
    if (isReportingOnStandards && report) {
      name = report?.programName;
    }
    return `${verbiage.drawerTitle} ${name}`;
  };

  const displayErrorMessages = () => {
    // if there are no ILOS but there are plans added, display this message
    if (!hasIlos && entities.length > 0) {
      return (
        <Box sx={sx.missingEntity}>
          {parseCustomHtml(verbiage.missingIlosMessage || "")}
        </Box>
      );
    } else if (
      (isAnalysisMethodsPage && !hasPlans) ||
      (isReportingOnStandards && !hasProviderTypes)
    ) {
      return (
        <Box sx={sx.missingEntity}>
          {parseCustomHtml(verbiage.missingEntityMessage || "")}
        </Box>
      );
    }
    return <></>;
  };

  const entityCount = verbiage.countEntitiesInTitle
    ? ` ${entities.length}`
    : "";
  const dashTitle = `${verbiage.dashboardTitle}${entityCount}`;

  const addStandardsButton = (
    <Button
      sx={sx.addEntityButton}
      leftIcon={<Image sx={sx.buttonIcons} src={addIconWhite} alt="Add" />}
      onClick={() => openRowDrawer()}
      disabled={!hasProviderTypes}
    >
      {verbiage.addEntityButtonText}
    </Button>
  );

  return (
    <Box sx={sx.tablePage}>
      {verbiage.intro && (
        <ReportPageIntro text={verbiage.intro} hasIlos={hasIlos} />
      )}
      {displayErrorMessages()}
      {standardForm && (
        <Box sx={sx.standardForm}>
          <Form
            id={standardForm.id}
            formJson={standardForm}
            onSubmit={onSubmit}
            onChange={onChange}
            formData={report?.fieldData}
            autosave
            validateOnRender={validateOnRender || false}
            dontReset={false}
          />
        </Box>
      )}
      <Box>
        {isReportingOnStandards ? (
          <Box>
            {addStandardsButton}
            <Heading sx={sx.dashboardTitle}>{dashTitle}</Heading>
            {existingStandards && (
              <SortableDrawerReportPageTable entities={entities} />
            )}
            {entities.length > 0 && addStandardsButton}
          </Box>
        ) : (
          <Box>
            <Heading as="h3" sx={dashboardTitleStyling(canAddEntities)}>
              {parseCustomHtml(verbiage.dashboardTitle)}
            </Heading>
            {isMcparReport && reportingOnIlos && !hasPlans && !hasIlos ? (
              // if there are no plans and no ILOS added, display this message
              <Box sx={sx.missingEntityMessage}>
                {parseCustomHtml(verbiage.missingPlansAndIlosMessage || "")}
              </Box>
            ) : (isMcparReport && !reportingOnIlos && !hasPlans) ||
              !entities?.length ? (
              // if not reporting on ILOS, but missing entities, display this message
              <Box sx={sx.missingEntityMessage}>
                {parseCustomHtml(verbiage.missingEntityMessage || "")}
              </Box>
            ) : (
              <DrawerReportPageEntityRows
                route={route}
                entities={entities}
                openRowDrawer={openRowDrawer}
                openDeleteEntityModal={openDeleteEntityModal}
                priorAuthDisabled={priorAuthDisabled}
                patientAccessDisabled={patientAccessDisabled}
              />
            )}
            {canAddEntities && hasPlans && (
              <Button
                variant={"outline"}
                sx={sx.addEntityButton}
                leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
                onClick={() => openRowDrawer()}
              >
                {verbiage.addEntityButtonText}
              </Button>
            )}
          </Box>
        )}
      </Box>
      <ReportDrawer
        selectedEntity={selectedEntity!}
        verbiage={{
          drawerTitle: getDrawerTitle(),
          drawerInfo: verbiage.drawerInfo,
        }}
        form={selectedIsCustomEntity ? addEntityForm : form}
        onSubmit={onSubmit}
        submitting={submitting}
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        validateOnRender={validateOnRender}
        data-testid="report-drawer"
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
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  entities?: EntityShape[];
  validateOnRender?: boolean;
  route: DrawerReportPageShape;
}

function dashboardTitleStyling(canAddEntities: boolean) {
  return {
    paddingLeft: canAddEntities && "3rem",
    paddingBottom: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    color: "palette.gray_medium",
    fontSize: "lg",
    fontWeight: "bold",
  };
}

const sx = {
  tablePage: {
    width: "fit-content",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  buttonIcons: {
    height: "1rem",
  },
  entityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
    paddingRight: "1rem",
  },
  missingEntity: {
    fontWeight: "bold",
    marginBottom: "2rem",
    a: {
      color: "palette.primary",
      textDecoration: "underline",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
  missingEntityMessage: {
    paddingTop: "1rem",
    fontWeight: "bold",
    a: {
      color: "palette.primary",
      textDecoration: "underline",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
    ol: {
      paddingLeft: "1rem",
    },
  },
  standardForm: {
    paddingBottom: "1rem",
  },
  addEntityButton: {
    marginBottom: "0",
    marginTop: "2rem",
    "&:first-of-type": {
      marginBottom: "2rem",
      marginTop: "0",
    },
  },
};
