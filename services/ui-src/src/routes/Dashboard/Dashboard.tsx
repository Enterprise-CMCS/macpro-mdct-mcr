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
import { ActionTable, BasicPage, Form, Modal } from "components";
import { calculateDueDate } from "utils";
// data
import formJson from "forms/mcpar/dash/dashForm.json";
import formSchema from "forms/mcpar/dash/dashForm.schema";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const Dashboard = () => {
  // Verbiage
  const { returnLink, intro, body, addProgramModal, deleteProgramModal } =
    verbiage;

  /*
   * NEXT STEPS TO COMPLETE THE DASHBOARD
   *
   * You will want to add code for fetching the reports by a given state or, in the future, all states if the
   * user is an admin. For now we're just doing state users. The code would look something like this:
   */

  /*
   *  Get the reportsByState for state users
   * const { reportsByState, fetchReportsByState } = useContext(ReportContext);
   *
   * On page load since the user is a state user grab all the reports for that state.
   * This is where in the future you might change this code for admin users
   * useEffect(() => {
   *   const { user } = useUser();
   *   const { state } = user ?? {};
   *   fetchReportsByState(state);
   * }, []);
   *
   * Once you've grabbed the reports you can use the reportsByState from the ReportContext
   * instead the the internal programs useState below to decide what is in the table
   */

  /*
   * Table Content
   * Will want to convert this internal state list of programs over to the ReportProvider context
   */
  const [programs, setPrograms] = useState<Array<Array<any>>>([]);
  const tableContent = {
    caption: body.table.caption,
    headRow: body.table.headRow,
  };

  // Delete Modal Functions
  const {
    isOpen: deleteProgramIsOpen,
    onOpen: onOpenDeleteProgram,
    onClose: onCloseDeleteProgram,
  } = useDisclosure();

  const askToDeleteProgram = async () => {
    onOpenDeleteProgram();
  };

  const deleteProgram = async () => {};

  // Add Modal Functions
  const {
    isOpen: addProgramIsOpen,
    onOpen: onOpenAddProgram,
    onClose: onCloseAddProgram,
  } = useDisclosure();

  const addProgram = async (formData: any) => {
    const newProgramData = {
      key: formJson.id,
      title: formData["dash-program-name"],
      contractPeriod: formData["dash-contractPeriod"],
      startDate: formData["dash-startDate"],
      endDate: formData["dash-endDate"],
      check: formData["dash-check"],
    };
    const dueDate =
      newProgramData.contractPeriod !== "other"
        ? newProgramData.contractPeriod
        : calculateDueDate(newProgramData.endDate);
    setPrograms([...programs, [newProgramData.title, dueDate, "-", "-"]]);
    onCloseAddProgram();
  };

  /*
   * This function is where you'll want to navigate to the program you've selected and
   * open its mcpar form pages. You'll want to utilize McparReportPage and navigate()
   * here.
   */
  const startProgram = () => {};

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
              <button onClick={() => askToDeleteProgram()}>
                <Image
                  src={cancelIcon}
                  alt="Delete Program"
                  sx={sx.deleteProgram}
                />
              </button>
              {/* Row Cells */}
              {row.map((cell: string, index: number) => (
                <Td key={index}>{cell}</Td>
              ))}
              {/* While this works React will throw an error in the console about having a link/button
               * in a Table Row. I didn't notice this until I was wrapping up */}
              <Td>
                <Button variant={"outline"} onClick={() => startProgram()}>
                  Start report
                </Button>
              </Td>
              <Td>
                <button onClick={() => askToDeleteProgram()}>
                  <Image
                    src={cancelIcon}
                    alt="Delete Program"
                    sx={sx.deleteProgram}
                  />
                </button>
              </Td>
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

      {/* Add Program Modal */}
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

      {/* Delete Program Modal */}
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
