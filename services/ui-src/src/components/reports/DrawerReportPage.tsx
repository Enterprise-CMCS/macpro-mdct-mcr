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
import {
  ReportDrawer,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
} from "components";
// utils
import { useUser } from "utils";
import {
  AnyObject,
  EntityShape,
  DrawerReportPageShape,
  ReportStatus,
} from "types";
import verbiage from "../../verbiage/pages/mcpar/mcpar-drawer-report-page";

export const DrawerReportPage = ({ route }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  // make state
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  const { entityType, dashboard, drawer } = route;
  const entities = report?.fieldData?.[entityType];
  const formData = { fieldData: selectedEntity };
  const { message, link } = verbiage[entityType as keyof typeof verbiage];

  const openRowDrawer = (entity: EntityShape) => {
    setSelectedEntity(entity);
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
      const selectedEntityIndex = report?.fieldData[entityType].findIndex(
        (entity: EntityShape) => entity.name === selectedEntity?.name
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
    <Box data-testid="drawer-report-page">
      {route.intro && <ReportPageIntro text={route.intro} />}
      <Heading as="h3" sx={sx.dashboardTitle}>
        {dashboard!.title}
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
        drawerTitle={`${drawer.title} ${selectedEntity?.name}`}
        drawerInfo={drawer.info}
        form={drawer.form}
        onSubmit={onSubmit}
        formData={formData}
        submitting={submitting}
        data-testid="report-drawer"
      />
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: DrawerReportPageShape;
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
