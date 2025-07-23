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
  ErrorAlert,
  SortableNaaarStandardsTable,
} from "components";
import { DrawerReportPageEntityRows } from "./DrawerReportEntityRows";
// constants
import {
  DEFAULT_ANALYSIS_METHODS,
  getDefaultAnalysisMethodIds,
} from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  ReportStatus,
  isFieldElement,
  InputChangeEvent,
  FormJson,
  EntityType,
  DrawerReportPageShape,
  ErrorVerbiage,
} from "types";
// utils
import {
  cleanSuppressed,
  entityWasUpdated,
  filterFormData,
  filterStandardsByUtilizedAnalysisMethods,
  getEntriesToClear,
  getForm,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  translate,
  useStore,
} from "utils";
//verbiage
import { analysisMethodError } from "verbiage/errors";
// assets
import addIcon from "assets/icons/icon_add_blue.png";
import addIconWhite from "assets/icons/icon_add.png";
import addIconSVG from "assets/icons/icon_add_gray.svg";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pageError, setPageError] = useState<ErrorVerbiage>();
  const [canAddStandards, setCanAddStandards] = useState<boolean>(false);
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
    !!addEntityDrawerForm.id || entityType === EntityType.STANDARDS;
  const entities = report?.fieldData?.[entityType] || [];

  const analysisMethods = report?.fieldData?.analysisMethods || [];
  const existingStandards =
    entityType === EntityType.STANDARDS && entities.length > 0;
  const providerTypeSelected = report?.fieldData?.providerTypes?.length > 0;

  // check if there are ILOS and associated plans
  const isMcparReport = route.path.includes("mcpar");
  const isAnalysisMethodsPage = route.path.includes("analysis-methods");
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length > 0;
  const plans = report?.fieldData?.["plans"];
  const hasPlans = plans?.length > 0;
  const isReportingOnStandards =
    route.path === "/naaar/program-level-access-and-network-adequacy-standards";

  const atLeastOneRequiredAnalysisMethodIsUtilized = analysisMethods.some(
    (analysisMethod: AnyObject) =>
      analysisMethod.analysis_applicable?.[0]?.value === "Yes"
  );

  // check if user has completed default analysis methods (NAAAR)
  const completedAnalysisMethods = () => {
    const result = analysisMethods.filter((analysisMethod: AnyObject) => {
      return analysisMethod.analysis_applicable && analysisMethod.isRequired;
    });
    return result?.length === DEFAULT_ANALYSIS_METHODS.length;
  };

  // analysis methods: error alert appears if analysis methods are completed without any utilized
  useEffect(() => {
    if (
      completedAnalysisMethods() &&
      !atLeastOneRequiredAnalysisMethodIsUtilized
    ) {
      setPageError(analysisMethodError);
    } else {
      setPageError(undefined);
    }
  }, [analysisMethods]);

  // standards: add button disabled if analysis methods are incomplete, complete without any utilized, or no provider types are selected
  useEffect(() => {
    if (
      !completedAnalysisMethods() ||
      (completedAnalysisMethods() &&
        !atLeastOneRequiredAnalysisMethodIsUtilized) ||
      !providerTypeSelected
    ) {
      setCanAddStandards(false);
    } else {
      setCanAddStandards(true);
    }
  }, [analysisMethods, providerTypeSelected]);

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

      // Check if form has suppressed fields
      cleanSuppressed(enteredData);

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

      // filter standards after changes to analysis methods
      const otherEntitiesToUpdate: { [key: string]: EntityShape[] } = {};

      if (entityType === EntityType.ANALYSIS_METHODS && selectedEntity?.id) {
        const isNotApplicable =
          newEntity.analysis_applicable?.[0]?.value.includes("No");

        if (isNotApplicable) {
          const currentStandards = report?.fieldData.standards || [];

          const filteredStandards = filterStandardsByUtilizedAnalysisMethods(
            currentStandards,
            selectedEntity.id
          );

          otherEntitiesToUpdate[EntityType.STANDARDS as string] =
            filteredStandards;
        }
      }

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
            ...otherEntitiesToUpdate,
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
    let addOrEdit = "";
    let name =
      selectedEntity?.name ||
      selectedEntity?.custom_analysis_method_name ||
      "Add other";
    if (isReportingOnStandards && report) {
      addOrEdit = selectedEntity ? "Edit" : "Add";
      name = report?.programName;
    }
    return translate(verbiage.drawerTitle, {
      action: addOrEdit,
      name,
    });
  };

  const displayErrorMessages = () => {
    // if there are no ILOS but there are plans added, display this message
    if (reportingOnIlos && !hasIlos && entities.length > 0) {
      return (
        <Box sx={sx.missingEntity}>
          {parseCustomHtml(verbiage.missingIlosMessage || "")}
        </Box>
      );
    } else if (
      (isAnalysisMethodsPage && !hasPlans) ||
      (isReportingOnStandards && !canAddStandards)
    ) {
      return (
        <Box sx={sx.missingEntity}>
          {parseCustomHtml(verbiage.missingEntityMessage || "")}
        </Box>
      );
    }
    return <></>;
  };

  const entityCount: string = verbiage.countEntitiesInTitle
    ? ` ${entities.length}`
    : "";
  const dashTitle = `${verbiage.dashboardTitle}${entityCount}`;

  const addStandardsButton = (
    <Button
      sx={sx.addStandardsButton}
      leftIcon={
        <Image
          sx={sx.buttonIcons}
          src={canAddStandards ? addIconWhite : addIconSVG}
          alt="Add"
        />
      }
      onClick={() => openRowDrawer()}
      disabled={!canAddStandards}
    >
      {verbiage.addEntityButtonText}
    </Button>
  );

  return (
    <Box sx={sx.tablePage}>
      {verbiage.intro && (
        <ReportPageIntro text={verbiage.intro} hasIlos={hasIlos} />
      )}
      {isAnalysisMethodsPage && (
        <ErrorAlert error={pageError} sxOverride={sx.pageErrorAlert} showIcon />
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
              <SortableNaaarStandardsTable
                entities={entities}
                openRowDrawer={openRowDrawer}
                openDeleteEntityModal={openDeleteEntityModal}
              />
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
    paddingLeft: canAddEntities && "3.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1.5px solid var(--mdct-colors-palette-gray_lighter)",
    color: "palette.gray_medium",
    fontSize: "lg",
    fontWeight: "bold",
  };
}

const sx = {
  tablePage: {
    width: "100%",
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
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  addStandardsButton: {
    marginBottom: "0",
    marginTop: "2rem",
    "&:first-of-type": {
      marginBottom: "2rem",
      marginTop: "0",
    },
  },
  pageErrorAlert: {
    marginBottom: "2rem",
  },
};
