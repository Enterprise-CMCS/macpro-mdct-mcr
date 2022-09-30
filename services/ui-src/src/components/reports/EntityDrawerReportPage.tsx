import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReportDrawer, ReportContext } from "components";
// utils
import { useUser } from "utils";
import {
  AnyObject,
  EntityShape,
  ReportRouteWithForm,
  ReportStatus,
} from "types";
import emptyVerbiage from "../../verbiage/pages/mcpar/mcpar-entity-drawer";

export const EntityDrawerReportPage = ({ route, submittingState }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  // make state
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { submitting, setSubmitting } = submittingState;
  const { entityType, dashboard, drawer } = route;
  const entities = report?.fieldData?.[entityType];
  const { message, link } =
    emptyVerbiage[entityType as keyof typeof emptyVerbiage];

  // shape entity data for hydration
  const formData = { fieldData: currentEntity };

  const openRowDrawer = (entity: EntityShape) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const currentEntities = [...(report?.fieldData[entityType] || {})];
      const currentEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.name === currentEntity?.name
      );
      const newEntity = {
        ...currentEntity,
        ...formData,
      };
      let newEntities = currentEntities;
      newEntities[currentEntityIndex] = newEntity;
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
    onClose();
  };

  const entityRows = (entities: EntityShape[]) =>
    entities.map((entity) => (
      <Flex key={entity.id} sx={sx.entityRow}>
        <Heading as="h4" sx={sx.entityName}>
          {entity.name}
        </Heading>
        <Button
          sx={sx.enterButton}
          onClick={() => openRowDrawer(entity)}
          variant="outline"
        >
          Enter
        </Button>
      </Flex>
    ));
  return (
    <Box data-testid="entity-drawer">
      <Heading as="h3" sx={sx.dashboardTitle}>
        {dashboard.title}
      </Heading>
      {entities ? (
        entityRows(entities)
      ) : (
        <Text sx={sx.emptyEntityMessage}>
          {message}{" "}
          <Link as={RouterLink} to={link.href}>
            {link.text}
          </Link>
        </Text>
      )}
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={`${drawer.title} ${currentEntity?.name}`}
        drawerInfo={drawer.info}
        form={route.form}
        onSubmit={onSubmit}
        formData={formData}
        submitting={submitting}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  route: ReportRouteWithForm;
  submittingState: {
    submitting: boolean;
    setSubmitting: Function;
  };
}

const sx = {
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
  },
  emptyEntityMessage: {
    paddingTop: "1rem",
    fontWeight: "bold",
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
