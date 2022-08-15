import { MouseEventHandler } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowIcon } from "@cmsgov/design-system";
import { BasicPage, Modal, Table } from "components";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

export const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { returnLink, intro, body, addProgramModal } = verbiage;
  const tableContent = {
    caption: body.table.caption,
    headRow: body.table.headRow,
    bodyRows: [[]],
  };

  const addProgram = () => {
    alert("Hello there");
  };

  return (
    <BasicPage sx={sx.layout}>
      <Box>
        <Link href={returnLink.location} sx={sx.returnLink}>
          <ArrowIcon title="returnHome" direction={"left"} />
          {returnLink.text}
        </Link>
      </Box>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>
          {intro.body.line1}
          <br />
          {intro.body.line2}
          <Link href={intro.link.location} isExternal sx={sx.headerLink}>
            {intro.link.text}
          </Link>
        </Text>
      </Box>

      <Box>
        <Table content={tableContent} sxOverride={sx.table} />
        <Text sx={sx.emptyTableContainer}>{body.table.empty}</Text>
        <Box sx={sx.callToActionContainer}>
          <Button type="submit" onClick={onOpen as MouseEventHandler}>
            {body.callToAction}
          </Button>
        </Box>
      </Box>
      <Modal
        actionFunction={() => addProgram()}
        modalState={{
          isOpen,
          onClose,
        }}
        content={addProgramModal.structure}
      />
    </BasicPage>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    svg: {
      marginTop: "-2px",
      marginRight: ".5rem",
      height: "22px",
      width: "22px",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
  },
  leadTextBox: {
    width: "100%",
    margin: "2.5rem 0 2.25rem 0",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  headerLink: {
    fontWeight: "bold",
  },
  table: {
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    th: {
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "2.5rem auto",
    textAlign: "center",
  },
  callToActionContainer: {
    textAlign: "center",
  },
};
