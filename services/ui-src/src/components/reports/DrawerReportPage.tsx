import { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import {
  ReportDrawer,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Form,
} from "components";
// constants
import { getDefaultAnalysisMethodIds } from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  DrawerReportPageShape,
  ReportStatus,
  FormField,
  isFieldElement,
  InputChangeEvent,
  ReportType,
  FormJson,
} from "types";
// utils
import {
  entityWasUpdated,
  filterFormData,
  isIlosCompleted,
  getEntriesToClear,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";
import {
  generateAddEntityDrawerItemFields,
  generateDrawerItemFields,
} from "utils/forms/dynamicItemFields";
// assets
import addIcon from "assets/icons/icon_add_blue.png";
import completedIcon from "assets/icons/icon_check_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedIsCustomEntity, setSelectedIsCustomEntity] =
    useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report, selectedEntity, setSelectedEntity } = useStore();

  const { entityType, verbiage, drawerForm, form: standardForm } = route;
  const addEntityDrawerForm = route.addEntityDrawerForm || ({} as FormJson);
  const canAddEntities = !!addEntityDrawerForm.id;
  const entities = report?.fieldData?.[entityType];

  // check if there are ILOS and associated plans
  const isMcparReport = route.path.includes("mcpar");
  const isAnalysisMethodsPage = route.path.includes("analysis-methods");
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length;
  const hasPlans = report?.fieldData?.["plans"]?.length > 0;
  const plans = report?.fieldData?.plans?.map((plan: { name: string }) => plan);

  const getForm = (
    reportType?: string,
    isCustomEntityForm: boolean = false
  ) => {
    let modifiedForm = drawerForm;
    switch (reportType) {
      case ReportType.NAAAR:
        if (isAnalysisMethodsPage && hasPlans) {
          modifiedForm = isCustomEntityForm
            ? generateAddEntityDrawerItemFields(
                addEntityDrawerForm,
                plans,
                "plan"
              )
            : generateDrawerItemFields(drawerForm, plans, "plan");
        }
        break;
      case ReportType.MCPAR:
        if (ilos && reportingOnIlos) {
          modifiedForm = generateDrawerItemFields(drawerForm, ilos, "ilos");
        }
        break;
      default:
    }
    return modifiedForm;
  };

  const form = getForm(report?.reportType);
  const addEntityForm = getForm(report?.reportType, true);

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
      const currentEntities = [...(report?.fieldData[entityType] || {})];
      let selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
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

  const enterButton = (entity: EntityShape, isEntityCompleted: boolean) => {
    let disabled = false;
    let style = sx.enterButton;
    const buttonText = userIsEndUser
      ? isEntityCompleted
        ? "Edit"
        : "Enter"
      : "View";

    if (
      (route.path === "/mcpar/plan-level-indicators/ilos" && !hasIlos) ||
      (route.path === "/mcpar/plan-level-indicators/prior-authorization" &&
        priorAuthDisabled) ||
      (route.path === "/mcpar/plan-level-indicators/patient-access-api" &&
        patientAccessDisabled) ||
      (isAnalysisMethodsPage && !hasPlans)
    ) {
      style = sx.disabledButton;
      disabled = true;
    }

    return (
      <Button
        sx={style}
        onClick={() => openRowDrawer(entity)}
        variant="outline"
        disabled={disabled}
      >
        {buttonText}
      </Button>
    );
  };

  const entityRows = (entities: EntityShape[]) => {
    return entities?.map((entity) => {
      const isCustomEntity =
        canAddEntities && !getDefaultAnalysisMethodIds().includes(entity.id);
      const calculateEntityCompletion = () => {
        let formFields = form.fields;
        if (isCustomEntity) {
          formFields = addEntityForm.fields;
        }
        return formFields
          ?.filter(isFieldElement)
          .every((field: FormField) => field.id in entity);
      };

      /*
       * If the entity has the same fields from drawerForms fields, it was completed
       * at somepoint.
       */
      const isEntityCompleted = reportingOnIlos
        ? calculateEntityCompletion() &&
          isIlosCompleted(reportingOnIlos, entity)
        : calculateEntityCompletion();

      return (
        <Flex
          key={entity.id}
          sx={entityRowStyling(canAddEntities)}
          data-testid="report-drawer"
        >
          {isEntityCompleted ? (
            <Image
              src={completedIcon}
              alt={"Entity is complete"}
              sx={sx.statusIcon}
            />
          ) : (
            canAddEntities && (
              <Image
                src={unfinishedIcon}
                alt={"Entity is incomplete"}
                sx={sx.statusIcon}
              />
            )
          )}
          {isCustomEntity ? (
            <Flex direction={"column"} sx={sx.customEntityRow}>
              <Heading as="h4" sx={sx.customEntityName}>
                {entity.custom_analysis_method_name}
              </Heading>
              {entity.custom_analysis_method_description && (
                <Text>{entity.custom_analysis_method_description}</Text>
              )}
              {entity.analysis_method_frequency &&
                entity.analysis_method_applicable_plans && (
                  <Text>
                    {entity.analysis_method_frequency[0].value}:&nbsp;
                    {entity.analysis_method_applicable_plans
                      .map((entity: AnyObject) => entity.value)
                      .join(", ")}
                  </Text>
                )}
            </Flex>
          ) : (
            <Heading as="h4" sx={sx.entityName}>
              {entity.name}
            </Heading>
          )}
          {enterButton(entity, isEntityCompleted)}
        </Flex>
      );
    });
  };
  const getDrawerTitle = () => {
    let name = "Add other";
    if (selectedEntity?.name) {
      name = selectedEntity.name;
    } else if (selectedEntity?.custom_analysis_method_name) {
      name = selectedEntity.custom_analysis_method_name;
    }
    return `${verbiage.drawerTitle} ${name}`;
  };

  return (
    <Box>
      {verbiage.intro && (
        <ReportPageIntro text={verbiage.intro} hasIlos={hasIlos} />
      )}
      {/* if there are no ILOS but there are plans added, display this message */}
      {!hasIlos && entities?.length && (
        <Box sx={sx.missingIlos}>
          {parseCustomHtml(verbiage.missingIlosMessage || "")}
        </Box>
      )}
      {isAnalysisMethodsPage && !hasPlans && (
        <Box sx={sx.missingIlos}>
          {parseCustomHtml(verbiage.missingEntityMessage || "")}
        </Box>
      )}
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
          entityRows(entities)
        )}
        {canAddEntities && hasPlans && (
          <Button
            variant={"outline"}
            sx={sx.bottomAddEntityButton}
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
            onClick={() => openRowDrawer()}
          >
            {verbiage.addEntityButtonText}
          </Button>
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
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: DrawerReportPageShape;
  validateOnRender?: boolean;
}

function entityRowStyling(canAddEntities: boolean) {
  return {
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    "&:last-of-type": {
      borderBottom: canAddEntities ?? "none",
    },
  };
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
  buttonIcons: {
    height: "1rem",
  },
  statusIcon: {
    height: "1.25rem",
    position: "absolute",
  },
  customEntityRow: {
    paddingLeft: "2.25rem",
    maxWidth: "32rem",
    gap: "4px",
  },
  entityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
  },
  customEntityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
  },
  missingIlos: {
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
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
  disabledButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_lighter",
    borderColor: "palette.gray_lighter",
    "&:hover": {
      color: "palette.gray_lighter",
      borderColor: "palette.gray_lighter",
    },
  },
  standardForm: {
    paddingBottom: "1rem",
  },
  bottomAddEntityButton: {
    marginTop: "2rem",
    marginBottom: "0",
  },
};
