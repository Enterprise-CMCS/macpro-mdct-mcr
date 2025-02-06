import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import {
  DrawerReportPageShape,
  EntityShape,
  FormField,
  FormJson,
  isFieldElement,
} from "types";
import { AnyObject } from "yup/lib/types";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import completedIcon from "assets/icons/icon_check_circle.png";
import { getForm, isIlosCompleted, useStore } from "utils";
import { getDefaultAnalysisMethodIds } from "../../constants";

export const DrawerReportPageEntityRows = ({
  route,
  entities,
  openRowDrawer,
  openDeleteEntityModal,
  priorAuthDisabled,
  patientAccessDisabled,
}: Props) => {
  const addEntityDrawerForm = route.addEntityDrawerForm || ({} as FormJson);
  const canAddEntities = !!addEntityDrawerForm.id;
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const isAnalysisMethodsPage = route.path.includes("analysis-methods");
  const hasPlans = report?.fieldData?.["plans"]?.length > 0;
  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length;

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

  const formParams = {
    route,
    report,
    isAnalysisMethodsPage,
    ilos,
    reportingOnIlos,
  };
  const form = getForm(formParams);
  const addEntityForm = getForm({ ...formParams, isCustomEntityForm: true });

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
          <Box sx={buttonBoxStyling(canAddEntities)}>
            {enterButton(entity, isEntityCompleted)}
            {canAddEntities && !entity.isRequired && (
              <Button
                sx={sx.deleteButton}
                data-testid="delete-entity"
                onClick={() => openDeleteEntityModal(entity)}
              >
                <Image src={deleteIcon} alt="delete" boxSize="2xl" />
              </Button>
            )}
          </Box>
        </Flex>
      );
    });
  };
  return <>{entityRows(entities)}</>;
};

interface Props {
  route: DrawerReportPageShape;
  entities: EntityShape[];
  openRowDrawer: Function;
  openDeleteEntityModal: Function;
  priorAuthDisabled: Boolean;
  patientAccessDisabled: Boolean;
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

function buttonBoxStyling(canAddEntities: boolean) {
  return {
    marginRight: canAddEntities && "1.5rem",
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
    paddingRight: "1rem",
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
  deleteButton: {
    marginRight: "-2.5rem",
    padding: 0,
    background: "white",
    "&:hover, &:hover:disabled, :disabled": {
      background: "white",
    },
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
