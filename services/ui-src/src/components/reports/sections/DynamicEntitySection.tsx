import { useState } from "react";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ReportDrawer } from "components";
// utils
import { FormJson, AnyObject } from "types";

export const DynamicEntitySection = ({
  form,
  drawer,
  dynamic,
  onSubmit,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");
  const [entities, setEntities] = useState<Array<any>>([
    {
      title: "Access to hospitals",
      formJson: {},
    },
  ]);

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    setEntities([]);
    onOpen();
  };

  return (
    <Box data-testid="entity-drawer-section">
      <Heading as="h4">{drawer!.dashboard.title}</Heading>
      {entities.map((entity) => {
        return (
          <Flex key={entity.title} sx={sx.entityRow}>
            <Heading as="h5">{entity.title}</Heading>
            <Flex sx={sx.buttonContainer}>
              <Button
                sx={sx.buttonStyle}
                onClick={() => openRowDrawer(entity.title)}
                variant="outline"
              >
                Edit
              </Button>
              <Button
                sx={sx.buttonStyle}
                onClick={() => openRowDrawer(entity.title)}
                variant="outline"
              >
                Delete
              </Button>
            </Flex>
          </Flex>
        );
      })}
      <Button
        onClick={() => openRowDrawer("test")}
        type="submit"
        sx={sx.addEntityButton}
      >
        {dynamic.buttonText}
      </Button>
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={`${drawer!.drawerTitle} ${currentEntity}`}
        drawerInfo={drawer!.drawerInfo}
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
  dynamic: AnyObject;
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
  buttonContainer: {
    justifyContent: "space-between",
  },
  removeImage: {
    width: "1.25rem",
    height: "1.25rem",
  },
  buttonStyle: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    margin: "0.5rem",
  },
  addEntityButton: {
    marginTop: "2rem",
  },
};
