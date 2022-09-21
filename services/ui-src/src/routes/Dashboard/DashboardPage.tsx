import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// components
import {
  Box,
  Button,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditProgramModal,
  DeleteProgramModal,
  ErrorAlert,
  PageTemplate,
  ReportContext,
} from "components";
import { DashboardList } from "./DashboardList";
import { MobileDashboardList } from "./MobileDashboardList";
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

export const DashboardPage = () => {
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
    let submittedOnDate = undefined;
    // Check and pre-fill the form if the user is editing an existing program
    if (reportMetadata) {
      if (reportMetadata.submittedOnDate) {
        submittedOnDate = convertDateUtcToEt(reportMetadata.submittedOnDate);
      }
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
        submittedBy: reportMetadata.submittedBy,
        submitterEmail: reportMetadata.submitterEmail,
        submittedOnDate: submittedOnDate,
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
            <MobileDashboardList
              reportsByState={reportsByState}
              userRole={userRole!}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              openDeleteProgramModal={openDeleteProgramModal}
            />
          ) : (
            <DashboardList
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
