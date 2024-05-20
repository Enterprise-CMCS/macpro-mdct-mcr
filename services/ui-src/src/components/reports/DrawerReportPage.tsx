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
  getEntriesToClear,
  parseCustomHtml,
  setClearedEntriesToDefaultValue,
  useStore,
} from "utils";
import {
  AnyObject,
  EntityShape,
  DrawerReportPageShape,
  ReportStatus,
  FormField,
  isFieldElement,
} from "types";
import completedIcon from "assets/icons/icon_check_circle.png";

export const DrawerReportPage = ({ route, validateOnRender }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsEndUser } = useStore().user ?? {};
  // make state
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { entityType, verbiage, drawerForm } = route;
  const entities = report?.fieldData?.[entityType];

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
    return entities.map((entity) => {
      /*
       * If the entity has the same fields from drawerForms fields, it was completed
       * at somepoint.
       */
      const isEntityCompleted = drawerForm.fields
        ?.filter(isFieldElement)
        .every((field: FormField) => field.id in entity);
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
            sx={sx.enterButton}
            onClick={() => openRowDrawer(entity)}
            variant="outline"
          >
            {isEntityCompleted ? "Edit" : "Enter"}
          </Button>
        </Flex>
      );
    });
  };
  return (
    <Box>
      {verbiage.intro && <ReportPageIntro text={verbiage.intro} />}
      <Heading as="h3" sx={sx.dashboardTitle}>
        {verbiage.dashboardTitle}
      </Heading>
      <Box>
        {entities?.length ? (
          entityRows(entities)
        ) : (
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(verbiage.missingEntityMessage || "")}
          </Box>
        )}
      </Box>
      <ReportDrawer
        selectedEntity={selectedEntity!}
        verbiage={{
          drawerTitle: `${verbiage.drawerTitle} ${selectedEntity?.name}`,
          drawerInfo: verbiage.drawerInfo,
        }}
        form={drawerForm}
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
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
