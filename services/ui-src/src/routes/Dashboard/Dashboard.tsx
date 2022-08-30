import { useContext, useEffect, useState } from "react";
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
import {
  AddEditProgramModal,
  BasicPage,
  DeleteProgramModal,
  ReportContext,
  Table,
} from "components";
// utils
import { AnyObject, ReportDetails, UserRoles } from "types";
import {
  convertDateUtcToEt,
  getReportsByState,
  parseCustomHtml,
  useUser,
} from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import { reportErrors } from "verbiage/errors";
// assets
import { ArrowIcon } from "@cmsgov/design-system";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const Dashboard = () => {
  const { setReport, setReportData } = useContext(ReportContext);
  const navigate = useNavigate();
  const { state: userState, userRole } = useUser().user ?? {};
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const [reports, setReports] = useState<AnyObject | undefined>(undefined);

  // get active state
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  const activeState = userState || adminSelectedState;

  const { intro, body } = verbiage;

  const fetchReportsByState = async (state: string) => {
    try {
      const result = await getReportsByState(state);
      setReports(result);
    } catch (e: any) {
      throw new Error(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  useEffect(() => {
    // fetch reports on load
    if (activeState) {
      fetchReportsByState(activeState);
    } else {
      // if no activeState, go to homepage
      navigate("/");
    }
    // unset active report & reportData
    setReport(undefined);
    setReportData(undefined);
  }, []);

  const enterSelectedReport = (reportId: string) => {
    // set active report to selected report
    const reportDetails: ReportDetails = {
      state: activeState!,
      reportId: reportId,
    };
    setReport(reportDetails);
    const reportFirstPage = "../../mcpar/program-information/point-of-contact";
    navigate(reportFirstPage);
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditProgramModalIsOpen,
    onOpen: addEditProgramModalOnOpenHandler,
    onClose: addEditProgramModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditProgramModal = (reportId?: string) => {
    // if reportId provided, set as selected program
    setSelectedReportId(reportId);
    // use disclosure to open modal
    addEditProgramModalOnOpenHandler();
  };

  // delete program modal disclosure
  const {
    isOpen: deleteProgramModalIsOpen,
    onOpen: deleteProgramModalOnOpenHandler,
    onClose: deleteProgramModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteProgramModal = (reportId?: string) => {
    setSelectedReportId(reportId);
    // use disclosure to open modal
    deleteProgramModalOnOpenHandler();
  };

  return (
    <BasicPage sx={sx.layout}>
      <Box>
        <Link href="/" sx={sx.returnLink}>
          <ArrowIcon title="returnHome" direction="left" />
          Return Home
        </Link>
      </Box>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box>{parseCustomHtml(intro.body)}</Box>
      </Box>
      <Box sx={sx.bodyBox}>
        <Table content={body.table} sxOverride={sx.table}>
          {reports &&
            reports.map((report: AnyObject) => (
              // Row
              <Tr key={report.reportId}>
                <Td sx={sx.editProgram}>
                  {/* only show edit button to state users */}
                  {(userRole === UserRoles.STATE_REP ||
                    userRole === UserRoles.STATE_USER) && (
                    <button
                      onClick={() => openAddEditProgramModal(report.reportId)}
                    >
                      <Image src={editIcon} alt="Edit Program" />
                    </button>
                  )}
                </Td>
                <Td sx={sx.programNameText}>{report.programName}</Td>
                <Td>{convertDateUtcToEt(report.dueDate)}</Td>
                <Td>{convertDateUtcToEt(report.lastAltered)}</Td>
                <Td>{report?.lastAlteredBy || "-"}</Td>
                <Td>{report?.status}</Td>
                <Td sx={sx.editReportButtonCell}>
                  <Button
                    variant="outline"
                    onClick={() => enterSelectedReport(report.reportId)}
                  >
                    Enter
                  </Button>
                </Td>
                <Td sx={sx.deleteProgramCell}>
                  {/* only show delete button if non-state user */}
                  {(userRole === UserRoles.ADMIN ||
                    userRole === UserRoles.APPROVER ||
                    userRole === UserRoles.HELP_DESK) && (
                    <button
                      onClick={() => openDeleteProgramModal(report.reportId)}
                    >
                      <Image
                        src={cancelIcon}
                        alt="Delete Program"
                        sx={sx.deleteProgramButtonImage}
                      />
                    </button>
                  )}
                </Td>
              </Tr>
            ))}
        </Table>
        {!reports?.length && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        {/* only show add program button to state users */}
        {(userRole === UserRoles.STATE_REP ||
          userRole === UserRoles.STATE_USER) && (
          <Box sx={sx.callToActionContainer}>
            <Button type="submit" onClick={() => openAddEditProgramModal()}>
              {body.callToAction}
            </Button>
          </Box>
        )}
      </Box>
      <AddEditProgramModal
        activeState={activeState}
        selectedReportId={selectedReportId}
        modalDisclosure={{
          isOpen: addEditProgramModalIsOpen,
          onClose: addEditProgramModalOnCloseHandler,
        }}
        fetchReportsByState={fetchReportsByState}
      />
      <DeleteProgramModal
        activeState={activeState}
        selectedReportId={selectedReportId}
        modalDisclosure={{
          isOpen: deleteProgramModalIsOpen,
          onClose: deleteProgramModalOnCloseHandler,
        }}
        fetchReportsByState={fetchReportsByState}
      />
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
    margin: "2.5rem 0 2.25rem 2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  bodyBox: {
    margin: "0 2.25rem",
  },
  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0 0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    td: {
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
    },
  },
  editReportButtonCell: {
    width: "6.875rem",
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
  editProgram: {
    padding: "0",
    width: "2.5rem",
    img: {
      height: "1.5rem",
      marginLeft: "0.5rem",
    },
  },
  programNameText: {
    fontSize: "md",
    fontWeight: "bold",
  },
  deleteProgramCell: {
    width: "2.5rem",
  },
  deleteProgramButtonImage: {
    height: "1.75rem",
    width: "1.75rem",
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
