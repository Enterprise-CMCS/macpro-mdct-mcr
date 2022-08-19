import { useContext, useState } from "react";
// components
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ReportContext, ReportDrawer, ReportPageFooter } from "components";
// utils
import { findRoute, hydrateFormFields } from "utils";
import { PageJson } from "types";
// form data
import { mcparRoutes } from "forms/mcpar";

export const ReportPageEntitySection = ({ pageJson, onSubmit }: Props) => {
  const { reportData } = useContext(ReportContext);
  const { path, form, drawer } = pageJson;
  const { isOpen, onClose, onOpen } = useDisclosure();

  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  // make routes
  const previousRoute = findRoute(mcparRoutes, path, "previous", "/mcpar");
  const nextRoute = findRoute(mcparRoutes, path, "next", "/mcpar");

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
  };

  if (reportData) {
    form.fields = hydrateFormFields(form.fields, reportData);
  }

  const tempEntityMap = {
    plans: ["United Healthcare", "Care 1st", "Aetna Family Care"],
  };

  return (
    <>
      <Box>
        <Heading as="h3">{drawer.dashboard.title}</Heading>
        {tempEntityMap.plans.map((entity) => {
          return (
            <Flex key={entity} sx={sx.entityRow}>
              <Heading as="h4">{entity}</Heading>
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
      </Box>
      <ReportDrawer
        drawerDisclosure={{
          isOpen,
          onClose,
        }}
        drawerTitle={`${drawer.drawerTitle} ${currentEntity}`}
        form={form}
        onSubmit={onSubmit}
      />
      <ReportPageFooter previousRoute={previousRoute} nextRoute={nextRoute} />
    </>
  );
};

interface Props {
  pageJson: PageJson;
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
    fontSize: "sm",
    fontWeight: "normal",
  },
};
