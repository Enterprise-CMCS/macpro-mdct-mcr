import { useState } from "react";
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
import { ReportDrawer } from "components";
// utils
import { FormJson, AnyObject, MappedEntityType } from "types";
import { Link as RouterLink } from "react-router-dom";

export const StaticDrawerSection = ({
  form,
  entities,
  entityType,
  drawer,
  onSubmit,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const emptyEntitiesMessage = (entityType?: MappedEntityType) => {
    const MISSING_PLANS =
      "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7.";
    const MISSING_BSS =
      "Per 42 CFR 438.66(e)(2)(ix), the Managed Care Program Annual Report must provide information on and an assessment of the operation of the managed care program including activities and performance of the beneficiary support system. Information on how BSS entities support program-level functions is on the ";
    switch (entityType) {
      case "plans":
        return (
          <Text sx={sx.emptyEntityMessage}>
            {MISSING_PLANS}{" "}
            <Link as={RouterLink} to="/mcpar/program-information/add-plans">
              Add Plans
            </Link>
          </Text>
        );
      case "bssEntities":
        return (
          <Text sx={sx.emptyEntityMessage}>
            {MISSING_BSS}{" "}
            <Link
              as={RouterLink}
              to="/mcpar/program-information/add-bss-entities"
            >
              Program-Level BSS
            </Link>{" "}
            page
          </Text>
        );
      default:
        return <span></span>;
    }
  };

  const entityRows = (entities: string[]) =>
    entities.map((entity) => (
      <Flex key={entity} sx={sx.entityRow}>
        <Heading as="h5">{entity}</Heading>
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
    <Box data-testid="static-drawer-section">
      <Heading as="h4">{drawer.dashboard.title}</Heading>
      {entities ? entityRows(entities) : emptyEntitiesMessage(entityType)}
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={`${drawer.drawerTitle} ${currentEntity}`}
        drawerInfo={drawer.drawerInfo}
        form={form}
        onSubmit={onSubmit}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  entities?: string[];
  entityType?: MappedEntityType;
  drawer: AnyObject;
  onSubmit: Function;
}

const sx = {
  entityRow: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "3.25rem",
    padding: "0.5rem",
    paddingLeft: "0.75rem",
    borderBottom: "1.5px solid var(--chakra-colors-palette-gray_lighter)",
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
