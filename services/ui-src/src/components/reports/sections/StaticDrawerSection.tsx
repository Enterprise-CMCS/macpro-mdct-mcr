import { useContext, useState } from "react";
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
import { FormJson, AnyObject, MappedEntityType } from "types";
import { Link as RouterLink } from "react-router-dom";

export const StaticDrawerSection = ({
  form,
  entityType,
  drawer,
  onSubmit,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { reportData } = useContext(ReportContext);
  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  const entities = reportData?.fieldData[entityType];

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const emptyMessagesMap: any = {
    plans: {
      message:
        "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7.",
      link: {
        text: "Add Plans.",
        href: "/mcpar/program-information/add-plans",
      },
    },
    bssEntities: {
      message:
        "This program is missing BSS entities. You won’t be able to complete this section until you’ve added all the names of BSS entities that support enrollees in the program.",
      link: {
        text: "Add BSS entities.",
        href: "/mcpar/program-information/add-bss-entities",
      },
    },
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

  const emptyVerbiage = emptyMessagesMap[entityType];

  return (
    <Box data-testid="static-drawer-section">
      <Heading as="h4">{drawer.dashboard.title}</Heading>
      {entities ? (
        entityRows(entities)
      ) : (
        <Text sx={sx.emptyEntityMessage}>
          {emptyVerbiage.message}{" "}
          <Link as={RouterLink} to={emptyVerbiage.link.href}>
            {emptyVerbiage.link.text}
          </Link>
        </Text>
      )}
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
  entityType: MappedEntityType;
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
