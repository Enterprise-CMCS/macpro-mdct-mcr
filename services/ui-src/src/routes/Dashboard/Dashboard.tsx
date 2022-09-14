import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  DeleteProgramModal,
  ErrorAlert,
  PageTemplate,
  ReportContext,
  Table,
} from "components";
// utils
import { AnyObject, ReportDetails, ReportShape, UserRoles } from "types";
import {
  convertDateUtcToEt,
  parseCustomHtml,
  useBreakpoint,
  useUser,
} from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
// assets
import { ArrowIcon } from "@cmsgov/design-system";
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";

export const Dashboard = () => {
  const {
    errorMessage,
    fetchReport,
    fetchReportsByState,
    reportsByState,
    setReport,
    setReportData,
  } = useContext(ReportContext);
  const navigate = useNavigate();
  const { state: userState, userRole } = useUser().user ?? {};
  const { isTablet, isMobile } = useBreakpoint();
  const { intro, body } = verbiage;
  const [selectedReportMetadata, setSelectedReportMetadata] = useState<
    AnyObject | undefined
  >(undefined);

  // get active state
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  const activeState = userState || adminSelectedState;

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
    localStorage.setItem("selectedReport", "");
  }, []);

  const enterSelectedReport = async (reportMetadata: ReportShape) => {
    // set active report to selected report
    const reportDetails: ReportDetails = {
      state: reportMetadata.state!,
      reportId: reportMetadata.reportId,
    };
    setReport(reportDetails);
    localStorage.setItem("selectedReport", reportMetadata.reportId);

    // fetch & set active report to selected report
    await fetchReport(reportDetails);
    const reportFirstPagePath = "/mcpar/program-information/point-of-contact";
    navigate(reportFirstPagePath);
  };

  const openAddEditProgramModal = (reportMetadata?: ReportShape) => {
    let formData = undefined;
    // Check and pre-fill the form if the user is editing an existing program
    if (reportMetadata) {
      formData = {
        fieldData: {
          "aep-programName": reportMetadata.programName,
          "aep-endDate": convertDateUtcToEt(
            reportMetadata.reportingPeriodEndDate
          ),
          "aep-startDate": convertDateUtcToEt(
            reportMetadata.reportingPeriodStartDate
          ),
        },
        state: reportMetadata.state,
        reportId: reportMetadata.reportId,
      };
    }
    setSelectedReportMetadata(formData);

    // use disclosure to open modal
    addEditProgramModalOnOpenHandler();
  };

  const openDeleteProgramModal = (reportMetadata?: ReportShape) => {
    setSelectedReportMetadata(reportMetadata);
    // use disclosure to open modal
    deleteProgramModalOnOpenHandler();
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditProgramModalIsOpen,
    onOpen: addEditProgramModalOnOpenHandler,
    onClose: addEditProgramModalOnCloseHandler,
  } = useDisclosure();

  // delete program modal disclosure
  const {
    isOpen: deleteProgramModalIsOpen,
    onOpen: deleteProgramModalOnOpenHandler,
    onClose: deleteProgramModalOnCloseHandler,
  } = useDisclosure();

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <ArrowIcon title="returnHome" direction="left" />
        Return Home
      </Link>
      {errorMessage && <ErrorAlert error={errorMessage} />}
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        {parseCustomHtml(intro.body)}
      </Box>
      <Box sx={sx.bodyBox}>
        {reportsByState &&
          (isTablet || isMobile ? (
            <MobileDashboardRow
              reportsByState={reportsByState}
              userRole={userRole!}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              openDeleteProgramModal={openDeleteProgramModal}
            />
          ) : (
            <DashboardTable
              reportsByState={reportsByState}
              userRole={userRole!}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              openDeleteProgramModal={openDeleteProgramModal}
              body={body}
            />
          ))}
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
        selectedReportMetadata={selectedReportMetadata!}
        modalDisclosure={{
          isOpen: addEditProgramModalIsOpen,
          onClose: addEditProgramModalOnCloseHandler,
        }}
      />
      <DeleteProgramModal
        selectedReportMetadata={selectedReportMetadata!}
        modalDisclosure={{
          isOpen: deleteProgramModalIsOpen,
          onClose: deleteProgramModalOnCloseHandler,
        }}
      />
    </PageTemplate>
  );
};

const DashboardTable = ({
  reportsByState,
  userRole,
  body,
  openAddEditProgramModal,
  enterSelectedReport,
  openDeleteProgramModal,
}: DashboardTableProps) => (
  <Table content={body.table} sxOverride={sx.table} data-testid="desktop-table">
    {reportsByState.map((report: AnyObject) => (
      <Tr key={report.reportId}>
        <Td sx={sx.editProgram}>
          {(userRole === UserRoles.STATE_REP ||
            userRole === UserRoles.STATE_USER) && (
            <button onClick={() => openAddEditProgramModal(report)}>
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
            data-testid="enter-program"
            onClick={() => enterSelectedReport(report)}
          >
            Enter
          </Button>
        </Td>
        <Td sx={sx.deleteProgramCell}>
          {userRole === UserRoles.ADMIN && (
            <button onClick={() => openDeleteProgramModal(report)}>
              <Image
                src={cancelIcon}
                data-testid="delete-program"
                alt="Delete Program"
                sx={sx.deleteProgramButtonImage}
              />
            </button>
          )}
        </Td>
      </Tr>
    ))}
  </Table>
);

interface DashboardTableProps {
  reportsByState: AnyObject[];
  userRole: string;
  body: { table: AnyObject };
  openAddEditProgramModal: Function;
  enterSelectedReport: Function;
  openDeleteProgramModal: Function;
}

export const MobileDashboardRow = ({
  reportsByState,
  userRole,
  openAddEditProgramModal,
  enterSelectedReport,
  openDeleteProgramModal,
}: MobileDashboardRowProps) => (
  <>
    {reportsByState.map((report: AnyObject) => (
      <Box data-testid="mobile-row" sx={sx.mobileTable} key={report.reportId}>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Program name</Text>
          <Flex alignContent="flex-start">
            {(userRole === UserRoles.STATE_REP ||
              userRole === UserRoles.STATE_USER) && (
              <Box sx={sx.editProgram}>
                <button onClick={() => openAddEditProgramModal(report)}>
                  <Image
                    src={editIcon}
                    data-testid="mobile-edit-program"
                    alt="Edit Program"
                  />
                </button>
              </Box>
            )}
            <Text sx={sx.programNameText}>{report.programName}</Text>
          </Flex>
        </Box>
        <Box sx={sx.labelGroup}>
          <Flex alignContent="flex-start">
            <Box sx={sx.editDate}>
              <Text sx={sx.label}>Due date</Text>
              <Text>{convertDateUtcToEt(report.dueDate)}</Text>
            </Box>
            <Box>
              <Text sx={sx.label}>Last edited</Text>
              <Text>{convertDateUtcToEt(report.lastAltered)}</Text>
            </Box>
          </Flex>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Edited by</Text>
          <Text>{report?.lastAlteredBy || "-"}</Text>
        </Box>
        <Box sx={sx.labelGroup}>
          <Text sx={sx.label}>Status</Text>
          <Text>{report?.status}</Text>
        </Box>
        <Flex alignContent="flex-start" gap={2}>
          <Box sx={sx.editReportButtonCell}>
            <Button
              variant="outline"
              onClick={() => enterSelectedReport(report)}
            >
              Enter
            </Button>
          </Box>
          <Box sx={sx.deleteProgramCell}>
            {userRole === UserRoles.ADMIN && (
              <button onClick={() => openDeleteProgramModal(report)}>
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
    ))}
  </>
);

interface MobileDashboardRowProps {
  reportsByState: any;
  userRole: any;
  openAddEditProgramModal: Function;
  enterSelectedReport: Function;
  openDeleteProgramModal: Function;
}

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    width: "8.5rem",
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
    maxWidth: "55.25rem",
    margin: "2.5rem auto",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
    ".tablet &, .mobile &": {
      fontSize: "xl",
      lineHeight: "1.75rem",
      fontWeight: "bold",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
  },
  mobileTable: {
    padding: "1rem 0",
    borderBottom: "1px solid",
    borderColor: "palette.gray_light",
  },
  labelGroup: {
    marginBottom: "0.5rem",
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
    ".tablet &, .mobile &": {
      width: "2rem",
    },
    img: {
      height: "1.5rem",
      minWidth: "21px",
      marginLeft: "0.5rem",
      ".tablet &, .mobile &": {
        marginLeft: 0,
      },
    },
  },
  programNameText: {
    fontSize: "md",
    fontWeight: "bold",
    width: "13rem",
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  deleteProgramCell: {
    width: "2.5rem",
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
