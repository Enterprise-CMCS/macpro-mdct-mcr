import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
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
import { DashboardList } from "./DashboardProgramList";
import { MobileDashboardList } from "./DashboardProgramListMobile";
// utils
import { AnyObject, ReportShape } from "types";
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
    fetchReportsByState,
    reportsByState,
    clearReportSelection,
    setReportSelection,
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
  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );

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

  const enterSelectedReport = async (report: ReportShape) => {
    // set active report to selected report
    setReportSelection(report);

    const reportFirstPagePath = "/mcpar/program-information/point-of-contact";
    navigate(reportFirstPagePath);
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

  const openDeleteProgramModal = (report?: ReportShape) => {
    setSelectedReport(report);
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
        {reportsByState ? (
          isTablet || isMobile ? (
            <MobileDashboardList
              reportsByState={reportsByState}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              openDeleteProgramModal={openDeleteProgramModal}
              sxOverride={sxChildStyles}
              isStateLevelUser={userIsStateUser! || userIsStateRep!}
              isAdmin={userIsAdmin!}
            />
          ) : (
            <DashboardList
              reportsByState={reportsByState}
              openAddEditProgramModal={openAddEditProgramModal}
              enterSelectedReport={enterSelectedReport}
              openDeleteProgramModal={openDeleteProgramModal}
              body={body}
              sxOverride={sxChildStyles}
              isStateLevelUser={userIsStateUser! || userIsStateRep!}
              isAdmin={userIsAdmin!}
            />
          )
        ) : (
          <Flex alignItems="center" w="full" justifyContent="center" p="10">
            <Spinner size="lg" />
          </Flex>
        )}
        {!reportsByState?.length && (
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
        modalDisclosure={{
          isOpen: addEditProgramModalIsOpen,
          onClose: addEditProgramModalOnCloseHandler,
        }}
      />
      <DeleteProgramModal
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
  deleteProgramButtonImage: {
    height: "1.75rem",
    width: "1.75rem",
    minWidth: "28px",
  },
};
