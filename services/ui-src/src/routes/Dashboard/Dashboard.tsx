import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import {
  Box,
  Button,
  Flex,
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
  ErrorAlert,
  ReportContext,
  Table,
} from "components";
// utils
import { AnyObject, ReportDetails, UserRoles } from "types";
import { convertDateUtcToEt, parseCustomHtml, useUser } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
// assets
import { ArrowIcon } from "@cmsgov/design-system";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const Dashboard = () => {
  const {
    errorMessage,
    fetchReportsByState,
    reportsByState,
    setReport,
    setReportData,
  } = useContext(ReportContext);
  const navigate = useNavigate();
  const { state: userState, userRole } = useUser().user ?? {};
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );

  // get active state
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  const activeState = userState || adminSelectedState;

  const { intro, body } = verbiage;

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
      {errorMessage && <ErrorAlert error={errorMessage} />}
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box>{parseCustomHtml(intro.body)}</Box>
      </Box>
      <Box sx={sx.bodyBox}>
        {/* Mobile Table Rows Start */}
        {reportsByState &&
          reportsByState.map((report: AnyObject) => (
            // Row
            <Box sx={sx.mobileTable}>
              <Box key={report.reportId}>
                <Box sx={sx.labelGroup}>
                  {/* Program name */}
                  <Text sx={sx.label}>Program name</Text>
                  <Flex alignContent="flex-start">
                    {/* only show edit button to state users */}
                    {(userRole === UserRoles.STATE_REP ||
                      userRole === UserRoles.STATE_USER) && (
                      <Box sx={sx.editProgram}>
                        <button
                          onClick={() =>
                            openAddEditProgramModal(report.reportId)
                          }
                        >
                          <Image src={editIcon} alt="Edit Program" />
                        </button>
                      </Box>
                    )}
                    <Box sx={sx.programNameText}>{report.programName}</Box>
                  </Flex>
                </Box>
                {/* Dates */}
                <Box sx={sx.labelGroup}>
                  <Flex alignContent="flex-start">
                    <Box sx={sx.editDate}>
                      <Text sx={sx.label}>Due date</Text>
                      {convertDateUtcToEt(report.dueDate)}
                    </Box>
                    <Box>
                      <Text sx={sx.label}>Last edited</Text>
                      {convertDateUtcToEt(report.lastAltered)}
                    </Box>
                  </Flex>
                </Box>
                {/* Edited */}
                <Box sx={sx.labelGroup}>
                  <Text sx={sx.label}>Edited by</Text>
                  <Box>{report?.lastAlteredBy || "-"}</Box>
                </Box>
                {/* Status */}
                <Box sx={sx.labelGroup}>
                  <Text sx={sx.label}>Status</Text>
                  <Box>{report?.status}</Box>
                </Box>
                {/* Enter or Erase */}
                <Flex alignContent="flex-start" gap={2}>
                  <Box sx={sx.editReportButtonCell}>
                    <Button
                      variant="outline"
                      onClick={() => enterSelectedReport(report.reportId)}
                    >
                      Enter
                    </Button>
                  </Box>
                  <Box sx={sx.deleteProgramCell}>
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
                  </Box>
                </Flex>
              </Box>
            </Box>
          ))}
        {/* Mobile Table Rows End */}
        <Table content={body.table} sxOverride={sx.table}>
          {reportsByState &&
            reportsByState.map((report: AnyObject) => (
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
                <Td sx={sx.tableCell}>{convertDateUtcToEt(report.dueDate)}</Td>
                <Td sx={sx.tableCell}>
                  {convertDateUtcToEt(report.lastAltered)}
                </Td>
                <Td sx={sx.editCell}>{report?.lastAlteredBy || "-"}</Td>
                <Td sx={sx.tableCell}>{report?.status}</Td>
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
        {!reportsByState?.length && (
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
        activeState={activeState!}
        selectedReportId={selectedReportId}
        modalDisclosure={{
          isOpen: addEditProgramModalIsOpen,
          onClose: addEditProgramModalOnCloseHandler,
        }}
      />
      <DeleteProgramModal
        activeState={activeState!}
        selectedReportId={selectedReportId!}
        modalDisclosure={{
          isOpen: deleteProgramModalIsOpen,
          onClose: deleteProgramModalOnCloseHandler,
        }}
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
    width: "100%",
    maxWidth: "884px",
    margin: "2.5rem auto",
    ".tablet &": {
      margin: "2.5rem 0 2.25rem 1rem",
    },
    ".mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  bodyBox: {
    maxWidth: "884px",
    margin: "0 auto",

    ".desktop &": {
      width: "100%",
    },

    ".tablet &": {
      margin: "0 1rem",
    },
    ".mobile &": {
      margin: "0",
    },
  },
  mobileTable: {
    ".tablet &, .desktop &": {
      display: "none",
    },
    borderBottom: "1px solid",
    borderColor: "palette.gray_light",
    padding: "1rem 0",
  },
  labelGroup: {
    marginBottom: "0.5rem",
  },
  table: {
    ".mobile &": {
      display: "none",
    },
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0 0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray_medium",
      fontWeight: "bold",
      "&.tablet": {
        padding: "0.5rem 0 0.5rem 0.8rem",
        whiteSpace: "nowrap",
      },
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
      ".tablet &": {
        padding: "0.9rem 0 0.9rem 0.75rem",
      },
    },
  },
  editCell: {
    ".tablet &": {
      width: "115px",
    },
  },
  tableCell: {
    ".tablet &": {
      width: "105px",
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
      ".tablet &": {
        width: "6rem",
      },
    },
  },
  editProgram: {
    padding: "0",
    width: "2.5rem",

    ".mobile &": {
      width: "2rem",
    },

    img: {
      height: "1.5rem",
      minWidth: "21px",
      marginLeft: "0.5rem",
      ".tablet &": {
        marginLeft: 0,
        minWidth: "18px",
        width: "18px",
        height: "auto",
      },
      ".mobile &": {
        marginLeft: 0,
      },
    },
  },
  programNameText: {
    fontSize: "md",
    fontWeight: "bold",
    width: "13rem",
    ".tablet &": {
      width: "131px",
    },
  },
  deleteProgramCell: {
    width: "2.5rem",
    ".tablet &": {
      minWidth: "2rem",
    },
    img: {
      ".tablet &": {
        marginLeft: 0,
        minWidth: "20px",
        width: "20px",
        height: "auto",
      },
    },
  },
  deleteProgramButtonImage: {
    height: "1.75rem",
    width: "1.75rem",
    minWidth: "28px",
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
  label: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  editDate: {
    marginRight: "3rem",
  },
};
