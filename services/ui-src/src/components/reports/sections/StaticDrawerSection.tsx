import { useState } from "react";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ReportDrawer } from "components";
// utils
import { FormJson, AnyObject } from "types";

export const StaticDrawerSection = ({ form, drawer, onSubmit }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const tempEntityMap = {
    plans: ["Plan A", "Plan B", "Plan C"],
  };

  return (
    <Box data-testid="static-drawer-section">
      <Heading as="h4">{drawer.dashboard.title}</Heading>
      {tempEntityMap.plans.map((entity) => {
        return (
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
        );
      })}
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
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
  },
};
