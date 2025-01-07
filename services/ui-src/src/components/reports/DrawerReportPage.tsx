import { useContext, useState } from "react";
import uuid from "react-uuid";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ReportDrawer,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Form,
} from "components";
// utils
import {
  entityWasUpdated,
  filterFormData,
  generateIlosFields,
  isIlosCompleted,
  getEntriesToClear,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";
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
} from "types";
// assets
import addIcon from "assets/icons/icon_add_blue.png";
import completedIcon from "assets/icons/icon_check_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report, selectedEntity, setSelectedEntity } = useStore();

  const { entityType, verbiage, drawerForm, form: standardForm } = route;
  const { addEntityDrawerForm } = route ?? {};
  const canAddEntities = !!addEntityDrawerForm;
  const entities = report?.fieldData?.[entityType];

  // check if there are ILOS and associated plans
  const isMcparReport = route.path.includes("mcpar");
  const isAnalysisMethodsPage = route.path.includes("analysis-methods");
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length;
  const hasPlans = report?.fieldData?.["plans"]?.length > 0;

  // generate ILOS fields (if applicable)
  const form =
    ilos && reportingOnIlos ? generateIlosFields(drawerForm, ilos) : drawerForm;

  // on load, get reporting status from store
  const reportingOnPriorAuthorization =
    report?.fieldData?.["plan_priorAuthorizationReporting"]?.[0].value;
  const reportingOnPatientAccessApi =
    report?.fieldData?.["plan_patientAccessApiReporting"]?.[0].value;
  const [priorAuthDisabled, setPriorAuthDisabled] = useState<boolean>(
    reportingOnPriorAuthorization === "Yes" ? false : true
  );
  const [patientAccessDisabled, setPatientAccessDisabled] = useState<boolean>(
    reportingOnPatientAccessApi === "Yes" ? false : true
  );

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
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || {})];
      let selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      if (isAnalysisMethodsPage && selectedEntityIndex < 0) {
        selectedEntityIndex = currentEntities.length;
      }
      let referenceForm = form;
      if (
        isAnalysisMethodsPage &&
        !getDefaultAnalysisMethodIds().includes(selectedEntity?.id!)
      ) {
        referenceForm = addEntityDrawerForm!;
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
        ...selectedEntity,
        ...filteredFormData,
      };
      if (!selectedEntity?.id) {
        newEntity.id = uuid();
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

    if (
      (route.path === "/mcpar/plan-level-indicators/ilos" && !hasIlos) ||
      (route.path === "/mcpar/plan-level-indicators/prior-authorization" &&
        priorAuthDisabled) ||
      (route.path === "/mcpar/plan-level-indicators/patient-access-api" &&
        patientAccessDisabled)
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
        {isEntityCompleted ? "Edit" : "Enter"}
      </Button>
    );
  };

  const entityRows = (entities: EntityShape[]) => {
    return entities?.map((entity) => {
      const calculateEntityCompletion = () => {
        let formFields = form.fields;
        if (
          isAnalysisMethodsPage &&
          !getDefaultAnalysisMethodIds().includes(entity.id)
        ) {
          formFields = addEntityDrawerForm?.fields!;
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
        <Flex key={entity.id} sx={sx.entityRow} data-testid="report-drawer">
          {isEntityCompleted ? (
            <Image
              src={completedIcon}
              alt={"Entity is complete"}
              sx={sx.statusIcon}
            />
          ) : (
            isAnalysisMethodsPage && (
              <Image
                src={unfinishedIcon}
                alt={"Entity is incomplete"}
                sx={sx.statusIcon}
              />
            )
          )}
          <Heading as="h4" sx={sx.entityName}>
            {entity.custom_analysis_method_name ?? entity.name}
          </Heading>
          {enterButton(entity, isEntityCompleted)}
        </Flex>
      );
    });
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
        <Heading as="h3" sx={sx.dashboardTitle}>
          {verbiage.dashboardTitle}
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
        {canAddEntities && (
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
          drawerTitle: `${verbiage.drawerTitle} ${selectedEntity?.name}`,
          drawerInfo: verbiage.drawerInfo,
        }}
        form={
          isAnalysisMethodsPage &&
          !getDefaultAnalysisMethodIds().includes(selectedEntity?.id!)
            ? addEntityDrawerForm!
            : form
        }
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

const sx = {
  buttonIcons: {
    height: "1rem",
  },
  statusIcon: {
    height: "1.25rem",
    position: "absolute",
  },
  dashboardTitle: {
    paddingBottom: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    color: "palette.gray_medium",
    fontSize: "lg",
    fontWeight: "bold",
  },
  entityRow: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
  entityName: {
    fontSize: "lg",
    fontWeight: "bold",
    flexGrow: 1,
    marginLeft: "2.25rem",
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
