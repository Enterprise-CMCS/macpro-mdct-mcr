import { useState } from "react";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ReportDrawer } from "components";
// utils
import { FormJson, AnyObject } from "types";

export const DynamicDrawerSection = ({
  form,
  dynamicTable,
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
    {
      title: "Access to nurse practitioners",
      formJson: {},
    },
    {
      title: "Access to Primary Care Physicians",
      formJson: {},
    },
  ]);

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  const removeEntity = (entityTitle: string) => {
    setEntities(entities.filter((entity) => entity.title !== entityTitle));
  };

  return (
    <Box data-testid="dynamic-drawer-section">
      {entities.length > 0 && (
        <Box style={sx.entityTable}>
          <Heading as="h4">{dynamicTable.tableHeading}</Heading>
          {entities.map((entity) => {
            return (
              <Flex key={entity.title} sx={sx.entityRow}>
                <Heading as="h5">{entity.title}</Heading>
                <Flex key={entity.title} sx={sx.buttonContainer}>
                  <Button
                    sx={sx.buttonStyle}
                    onClick={() => openRowDrawer(entity.title)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    sx={sx.buttonStyle}
                    onClick={() => removeEntity(entity.title)}
                    variant="outline"
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Box>
      )}
      <Button onClick={() => openRowDrawer("")} type="submit">
        {dynamicTable.addEntityText}
      </Button>
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={
          currentEntity === "" ? dynamicTable.addEntityText : currentEntity
        }
        form={form}
        onSubmit={onSubmit}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  dynamicTable: AnyObject;
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
  entityTable: {
    marginBottom: "2rem",
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
};
