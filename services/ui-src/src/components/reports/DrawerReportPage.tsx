import { useContext, useState } from "react";
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
// types
import {
  AnyObject,
  EntityShape,
  DrawerReportPageShape,
  ReportStatus,
  FormField,
  isFieldElement,
} from "types";
// assets
import completedIcon from "assets/icons/icon_check_circle.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { updateReport } = useContext(ReportContext);

  // state management
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();

  // make state
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { entityType, verbiage, drawerForm } = route;
  const entities = report?.fieldData?.[entityType];

  const reportingOnIlos = route.path === "/mcpar/plan-level-indicators/ilos";

  // check if there are ILOS and associated plans
  const ilos = report?.fieldData?.["ilos"];
  const hasIlos = ilos?.length;
  const hasPlans = report?.fieldData?.["plans"]?.length > 0;

  // generate ILOS fields (if applicable)
  const form =
    ilos && reportingOnIlos ? generateIlosFields(drawerForm, ilos) : drawerForm;

  const openRowDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
    onOpen();
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
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );
      const filteredFormData = filterFormData(
        enteredData,
        form.fields.filter(isFieldElement)
      );
      const entriesToClear = getEntriesToClear(
        enteredData,
        form.fields.filter(isFieldElement)
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

  const entityRows = (entities: EntityShape[]) => {
    const disabled = reportingOnIlos && !hasIlos;
    return entities?.map((entity) => {
      const calculateEntityCompletion = () => {
        return form.fields
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
        <Flex key={entity.id} sx={sx.entityRow}>
          {isEntityCompleted && (
            <Image
              src={completedIcon}
              alt={"Entity is complete"}
              sx={sx.statusIcon}
            />
          )}
          <Heading as="h4" sx={sx.entityName}>
            {entity.name}
          </Heading>
          <Button
            sx={disabled ? sx.disabledButton : sx.enterButton}
            onClick={() => openRowDrawer(entity)}
            variant="outline"
            disabled={disabled}
          >
            {isEntityCompleted ? "Edit" : "Enter"}
          </Button>
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
      {!hasIlos && entities?.length ? (
        <Box sx={sx.missingIlos}>
          {parseCustomHtml(verbiage.missingIlosMessage || "")}
        </Box>
      ) : (
        <></>
      )}
      <Box>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {verbiage.dashboardTitle}
        </Heading>
        {reportingOnIlos && !hasPlans && !hasIlos ? (
          // if there are no plans and no ILOS added, display this message
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(verbiage.missingPlansAndIlosMessage || "")}
          </Box>
        ) : (!reportingOnIlos && !hasPlans) || !entities?.length ? (
          // if not reporting on ILOS, but missing entities, display this message
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(verbiage.missingEntityMessage || "")}
          </Box>
        ) : (
          entityRows(entities)
        )}
      </Box>
      <ReportDrawer
        selectedEntity={selectedEntity!}
        verbiage={{
          drawerTitle: `${verbiage.drawerTitle} ${selectedEntity?.name}`,
          drawerInfo: verbiage.drawerInfo,
        }}
        form={form}
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
};
