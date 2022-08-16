import { MouseEventHandler, useState } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Image,
  Link,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowIcon } from "@cmsgov/design-system";
import { BasicPage, Form, Modal } from "components";
import { cacluateDueDate } from "utils";
// data
import formJson from "forms/mcpar/dash/dashForm.json";
import formSchema from "forms/mcpar/dash/dashForm.schema";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import { ActionTable } from "components/tables/ActionTable";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const Dashboard = () => {
  const { returnLink, intro, body, addProgramModal, deleteProgramModal } =
    verbiage;
  const {
    isOpen: addProgramIsOpen,
    onOpen: onOpenAddProgram,
    onClose: onCloseAddProgram,
  } = useDisclosure();
  const {
    isOpen: deleteProgramIsOpen,
    onOpen: onOpenDeleteProgram,
    onClose: onCloseDeleteProgram,
  } = useDisclosure();
  const [programs, setPrograms] = useState<Array<Array<any>>>([]);
  const tableContent = {
    caption: body.table.caption,
    headRow: body.table.headRow,
  };

  const askToDeleteProgram = async (program: any) => {
    // eslint-disable-next-line no-console
    console.log("deleteProgram", program);
    deleteProgramModal.structure.heading += " " + program[0] + "?";
    onOpenDeleteProgram();
  };

  const deleteProgram = async () => {
    alert("Hello There");
  };

  const addProgram = async (formData: any) => {
    const newProgramData = {
      key: formJson.id,
      title: formData["dash-title"],
      contractPeriod: formData["dash-contractPeriod"],
      startDate: formData["dash-startDate"],
      endDate: formData["dash-endDate"],
      check: formData["dash-check"],
    };
    const dueDate =
      newProgramData.contractPeriod !== "other"
        ? newProgramData.contractPeriod
        : cacluateDueDate(newProgramData.endDate);
    setPrograms([...programs, [newProgramData.title, dueDate, "-", "-"]]);
    onCloseAddProgram();
  };

  const startProgram = (program: any) => {
    // eslint-disable-next-line no-console
    console.log(program);
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
        <ActionTable content={tableContent} sxOverride={sx.table}>
          {programs.map((row: string[], index: number) => (
            // Row
            <Tr key={index}>
              {/* Row Cells */}
              {row.map((cell: string, index: number) => (
                <Td key={index}>{cell}</Td>
              ))}
              <Button
                variant={"outline"}
                onClick={() => startProgram(programs[index])}
              >
                Start report
              </Button>
              <button onClick={() => askToDeleteProgram(programs[index])}>
                <Image
                  src={cancelIcon}
                  alt="Delete Program"
                  sx={sx.deleteProgram}
                />
              </button>
              ,
            </Tr>
          ))}
        </ActionTable>
        {programs.length == 0 && (
          <Text sx={sx.emptyTableContainer}>{body.table.empty}</Text>
        )}
        <Box sx={sx.callToActionContainer}>
          <Button type="submit" onClick={onOpenAddProgram as MouseEventHandler}>
            {body.callToAction}
          </Button>
        </Box>
      </Box>
      <Modal
        actionFunction={addProgram}
        actionId={formJson.id}
        modalState={{
          isOpen: addProgramIsOpen,
          onClose: onCloseAddProgram,
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

      <Modal
        actionFunction={deleteProgram}
        modalState={{
          isOpen: deleteProgramIsOpen,
          onClose: onCloseDeleteProgram,
        }}
        content={deleteProgramModal.structure}
      >
        <Text>{deleteProgramModal.body}</Text>
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
