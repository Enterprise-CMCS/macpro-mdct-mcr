import { useState } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReportDrawer } from "components";
// utils
import { FormJson, AnyObject } from "types";

export const StaticDrawerSection = ({
  form,
  entities,
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

  const emptyEntitiesMessage = (
    <Text sx={sx.emptyEntityMessage}>Please enter a plan</Text>
  );

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
      {entities ? entityRows(entities) : emptyEntitiesMessage}
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
  },
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
