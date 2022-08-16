import { MouseEventHandler, useEffect, useState } from "react";
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
import { BasicPage, Form, Modal, Table } from "components";
import { cacluateDueDate } from "utils";
// data
import formJson from "forms/mcpar/dash/dashForm.json";
import formSchema from "forms/mcpar/dash/dashForm.schema";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

export const Dashboard = () => {
  const { returnLink, intro, body, addProgramModal } = verbiage;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [programs, setPrograms] = useState<Array<Array<any>>>([]);
  const [tableContent, setTableContent] = useState({
    caption: body.table.caption,
    headRow: body.table.headRow,
    bodyRows: programs,
  });

  useEffect(() => {
    setTableContent({ ...tableContent, bodyRows: programs });
  }, [programs]);

  const addProgram = async (formData: any) => {
    const newProgramData = {
      key: formJson.id,
      title: formData["dash-title"],
      startDate: formData["dash-startDate"],
      endDate: formData["dash-endDate"],
    };
    const dueDate = cacluateDueDate(newProgramData.endDate);
    setPrograms([...programs, [newProgramData.title, dueDate, "-", "-", "-"]]);
    onClose();
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
        {programs.length == 0 && (
          <Text sx={sx.emptyTableContainer}>{body.table.empty}</Text>
        )}
        <Box sx={sx.callToActionContainer}>
          <Button type="submit" onClick={onOpen as MouseEventHandler}>
            {body.callToAction}
          </Button>
        </Box>
      </Box>
      <Modal
        actionFunction={addProgram}
        actionId={formJson.id}
        modalState={{
          isOpen,
          onClose,
        }}
        content={addProgramModal.structure}
      >
        <Form
          id={formJson.id}
          formJson={formJson}
          formSchema={formSchema}
          onSubmit={addProgram}
        />
      </Modal>
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
    marginBottom: "2.5rem",
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    th: {
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
  },
  deleteProgram: {
    height: "1.75rem",
    marginLeft: "1rem",
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
  callToActionContainer: {
    marginTop: "2.5rem",
    textAlign: "center",
  },
};
