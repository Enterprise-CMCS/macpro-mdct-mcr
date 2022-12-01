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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditProgramModal,
  ErrorAlert,
  PageTemplate,
  ReportContext,
} from "components";
import { DashboardList } from "./DashboardProgramList";
import { MobileDashboardList } from "./DashboardProgramListMobile";
import { Spinner } from "@cmsgov/design-system";
// forms
import { mcparReportJson } from "forms/mcpar";
// utils
import { AnyObject, ReportMetadataShape, ReportKeys, ReportShape } from "types";
import {
  convertDateUtcToEt,
  parseCustomHtml,
  useBreakpoint,
  useUser,
} from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";
// assets
import arrowLeftIcon from "assets/icons/icon_arrow_left_blue.png";

export const DashboardPage = ({ reportType }: Props) => {
  const {
    errorMessage,
    fetchReportsByState,
    fetchReport,
    reportsByState,
    clearReportSelection,
    setReportSelection,
    updateReport,
  } = useContext(ReportContext);
  const navigate = useNavigate();
  const {
    state: userState,
    userIsStateUser,
    userIsStateRep,
    userIsAdmin,
  } = useUser().user ?? {};
  const { isTablet, isMobile } = useBreakpoint();
  const { intro, body } = verbiage;
  const [reportsToDisplay, setReportsToDisplay] = useState<
    ReportMetadataShape[] | undefined
  >(undefined);
  const [archiving, setArchiving] = useState<boolean>(false);
  const [archivingReportId, setArchivingReportId] = useState<
    string | undefined
  >(undefined);
  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );

  const genericReportJsonMap: any = {
    MCPAR: mcparReportJson,
  };
  const genericReportJson = genericReportJsonMap[reportType]!;

  // get active state
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  const activeState = userState || adminSelectedState;

  useEffect(() => {
    // if no activeState, go to homepage
    if (!activeState) {
      navigate("/");
    }
    fetchReportsByState(activeState);
    clearReportSelection();
  }, []);

  useEffect(() => {
    let newReportsToDisplay = reportsByState;
    if (!userIsAdmin) {
      newReportsToDisplay = reportsByState?.filter(
        (report: ReportMetadataShape) => !report?.archived
      );
    }
    setReportsToDisplay(newReportsToDisplay);
  }, [reportsByState]);

  const enterSelectedReport = async (report: ReportMetadataShape) => {
    const reportKeys: ReportKeys = {
      state: report.state,
      id: report.id,
    };
    const selectedReport: ReportShape = await fetchReport(reportKeys);
    // set active report to selected report
    setReportSelection(selectedReport);
    const firstReportPagePath = selectedReport.formTemplate.flatRoutes![0].path;
    navigate(firstReportPagePath);
  };

  const openAddEditProgramModal = (report?: ReportShape) => {
    let formData = undefined;
    let submittedOnDate = undefined;
    // Check and pre-fill the form if the user is editing an existing program
    if (report) {
      if (report.submittedOnDate) {
        submittedOnDate = convertDateUtcToEt(report.submittedOnDate);
      }
      formData = {
        fieldData: {
          programName: report.programName,
          reportingPeriodEndDate: convertDateUtcToEt(
            report.reportingPeriodEndDate
          ),
          reportingPeriodStartDate: convertDateUtcToEt(
            report.reportingPeriodStartDate
          ),
          combinedData: report.combinedData,
        },
        state: report.state,
        id: report.id,
        submittedBy: report.submittedBy,
        submitterEmail: report.submitterEmail,
        submittedOnDate: submittedOnDate,
      };
    }
    setSelectedReport(formData);

    // use disclosure to open modal
    addEditProgramModalOnOpenHandler();
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditProgramModalIsOpen,
    onOpen: addEditProgramModalOnOpenHandler,
    onClose: addEditProgramModalOnCloseHandler,
  } = useDisclosure();

  const toggleReportArchiveStatus = async (report: ReportShape) => {
    if (userIsAdmin) {
      setArchivingReportId(report.id);
      setArchiving(true);
      const reportKeys = {
        state: adminSelectedState,
        id: report.id,
      };
      await updateReport(reportKeys, {});
      await fetchReportsByState(activeState);
      setArchivingReportId(undefined);
      setArchiving(false);
    }
  };

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
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
        {reportsToDisplay ? (
          isTablet || isMobile ? (
            <MobileDashboardList
              reportsByState={reportsToDisplay}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              archivingReportId={archivingReportId}
              sxOverride={sxChildStyles}
              isStateLevelUser={userIsStateUser! || userIsStateRep!}
              isAdmin={userIsAdmin!}
            />
          ) : (
            <DashboardList
              reportsByState={reportsToDisplay}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              archivingReportId={archivingReportId}
              body={body}
              sxOverride={sxChildStyles}
              isStateLevelUser={userIsStateUser! || userIsStateRep!}
              isAdmin={userIsAdmin!}
            />
          )
        ) : (
          !errorMessage && (
            <Flex sx={sx.spinnerContainer}>
              <Spinner size="big" />
            </Flex>
          )
        )}
        {!reportsToDisplay?.length && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        {/* only show add program button to state users */}
        {(userIsStateUser || userIsStateRep) && (
          <Box sx={sx.callToActionContainer}>
            <Button type="submit" onClick={() => openAddEditProgramModal()}>
              {body.callToAction}
            </Button>
          </Box>
        )}
      </Box>
      <AddEditProgramModal
        activeState={activeState!}
        selectedReport={selectedReport!}
        newReportData={{
          reportType: reportType,
          formTemplate: genericReportJson,
        }}
        modalDisclosure={{
          isOpen: addEditProgramModalIsOpen,
          onClose: addEditProgramModalOnCloseHandler,
        }}
      />
    </PageTemplate>
  );
};

interface Props {
  reportType: string;
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
    display: "flex",
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
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "0.25rem",
      marginRight: "0.5rem",
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
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
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
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
};

const sxChildStyles = {
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
  archiveReportButton: {
    minWidth: "4.5rem",
    fontSize: "sm",
    fontWeight: "normal",
  },
};
