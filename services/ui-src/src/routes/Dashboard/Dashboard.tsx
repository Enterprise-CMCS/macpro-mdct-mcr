import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { BasicPage, Form, Modal, ReportContext, Table } from "components";
// utils
import { AnyObject, ReportDetails, ReportStatus } from "types";
import { calculateDueDate, getReportsByState, useUser } from "utils";
// data
import formJson from "forms/mcpar/dash/dashForm.json";
import formSchema from "forms/mcpar/dash/dashForm.schema";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import { reportErrors } from "verbiage/errors";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const Dashboard = () => {
  // Verbiage
  const { returnLink, intro, body, addProgramModal, deleteProgramModal } =
    verbiage;

  const { fetchReport, setReport, updateReport } = useContext(ReportContext);

  const [reports, setReports] = useState<AnyObject | undefined>(undefined);

  const { user } = useUser();
  const { full_name, state } = user ?? {};

  const fetchReportsByState = async (state: string) => {
    try {
      const result = await getReportsByState(state);
      setReports(result);
    } catch (e: any) {
      throw new Error(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };
  useEffect(() => {
    if (state) {
      fetchReportsByState(state);
    }
  }, []);

  // Add Modal Functions
  const {
    isOpen: addProgramIsOpen,
    onOpen: onOpenAddProgram,
    onClose: onCloseAddProgram,
  } = useDisclosure();

  // Delete Modal Functions
  const {
    isOpen: deleteProgramIsOpen,
    onOpen: onOpenDeleteProgram,
    onClose: onCloseDeleteProgram,
  } = useDisclosure();

  const tableContent = {
    caption: body.table.caption,
    headRow: body.table.headRow,
  };

  const deleteProgram = async () => {};

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
    updateReport(
      { state: state, reportId: newProgramData.title },
      {
        status: ReportStatus.CREATED,
        dueDate: dueDate,
        lastAlteredBy: full_name,
      }
    );
    fetchReportsByState(state!);
    onCloseAddProgram();
  };

  const navigate = useNavigate();
  const mcparFormBeginning = "../../mcpar/program-information/point-of-contact";
  const startProgram = (reportId: string) => {
    const reportDetails: ReportDetails = {
      state: state!,
      reportId: reportId,
    };
    // Set report to selected program
    setReport(reportDetails);
    // Fetch full report info in background
    fetchReport(reportDetails);
    navigate(mcparFormBeginning);
  };

  const { created, inProgress, submitted } = body.table.editReportButtonText;
  const statusTextMap: { [key in ReportStatus]: string } = {
    [ReportStatus.CREATED]: created,
    [ReportStatus.IN_PROGRESS]: inProgress,
    [ReportStatus.SUBMITTED]: submitted,
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
        <Text sx={sx.reportingYearText}>{intro.eyebrow}</Text>
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
        <Table content={tableContent} sxOverride={sx.table}>
          {reports &&
            reports.map((report: AnyObject) => (
              // Row
              <Tr key={report.reportId}>
                <Td sx={sx.editProgram}>
                  {/* TODO: Pass existing data to populate modal */}
                  <button onClick={onOpenAddProgram as MouseEventHandler}>
                    <Image src={editIcon} alt="Edit Program" />
                  </button>
                </Td>
                <Td>{report.reportId}</Td>
                <Td>{report.dueDate}</Td>
                <Td>{report.lastAltered}</Td>
                <Td>{report.lastAlteredBy}</Td>
                <Td sx={sx.editReportButtonCell}>
                  <Button
                    variant={"outline"}
                    onClick={() => startProgram(report.reportId)}
                  >
                    {statusTextMap[
                      report.status as keyof typeof statusTextMap
                    ] || created}
                  </Button>
                </Td>
                <Td>
                  <button onClick={onOpenDeleteProgram as MouseEventHandler}>
                    <Image
                      src={cancelIcon}
                      alt="Delete Program"
                      sx={sx.deleteProgram}
                    />
                  </button>
                </Td>
              </Tr>
            ))}
        </Table>
        {!reports && (
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
        formId={formJson.id}
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
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
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
  reportingYearText: {
    marginBottom: "0.25rem",
    fontWeight: "bold",
    color: "palette.gray_medium",
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
  editReportButtonCell: {
    width: "110px",
    padding: 0,
    button: {
      width: "6.875rem",
      height: "1.75rem",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontSize: "sm",
      fontWeight: "normal",
      color: "palette.primary",
    },
  },
  deleteProgram: {
    height: "1.75rem",
  },
  editProgram: {
    padding: "0",
    img: {
      height: "1.5rem",
      marginLeft: "0.5rem",
    },
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
