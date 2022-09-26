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
import { FormJson, PageJson } from "types";
import emptyVerbiage from "../../../verbiage/pages/mcpar/mcpar-static-drawer-section";

export const StaticDrawerSection = ({ form, page, onSubmit }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { report } = useContext(ReportContext);
  // make state
  const [currentEntity, setCurrentEntity] = useState<string>("");

  const { entityType, dashboard, drawer } = page;
  const entities = report?.fieldData?.[entityType];
  const { message, link } =
    emptyVerbiage[entityType as keyof typeof emptyVerbiage];

  const openRowDrawer = (entity: string) => {
    setCurrentEntity(entity);
    onOpen();
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
      <Heading as="h4">{dashboard.title}</Heading>
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
        drawerTitle={`${drawer.title} ${currentEntity}`}
        drawerInfo={drawer.info}
        form={form}
        onSubmit={onSubmit}
        data-testid="report-drawer"
      />
    </Box>
  );
};

interface Props {
  form: FormJson;
  page: PageJson;
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
