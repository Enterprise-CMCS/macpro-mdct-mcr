import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link as RouterLink } from "react-router";
// components
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Alert, Modal, ReportContext, StatusTable } from "components";
// types
import { AlertTypes, AnyObject, ReportKeys, ReportStatus } from "types";
// utils
import {
  getReportVerbiage,
  parseCustomHtml,
  useStore,
  utcDateToReadableDate,
} from "utils";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";
import iconSearchDefault from "assets/icons/icon_search_blue.png";
import iconSearchSubmitted from "assets/icons/icon_search_white.png";

export const ReviewSubmitPage = () => {
  const { fetchReport, submitReport } = useContext(ReportContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPermittedToSubmit, setIsPermittedToSubmit] =
    useState<boolean>(false);

  // get user information
  const { userIsEndUser } = useStore().user ?? {};
  const { report } = useStore();

  // get report type, state, and id from context or storage
  const reportType =
    report?.reportType || localStorage.getItem("selectedReportType");
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = report?.state || localStorage.getItem("selectedState");

  const reportKeys = {
    reportType: reportType!,
    state: reportState!,
    id: reportId!,
  };

  const { reviewAndSubmitVerbiage } = getReportVerbiage(report?.reportType);

  const { alertBox } = reviewAndSubmitVerbiage;

  useEffect(() => {
    if (report?.id) {
      fetchReport(reportKeys);
    }
  }, []);

  useEffect(() => {
    setHasError(!!document.querySelector("img[alt='Error notification']"));
  }, [fetchReport]);

  useEffect(() => {
    setIsPermittedToSubmit(
      (userIsEndUser &&
        report?.status === ReportStatus.IN_PROGRESS &&
        !hasError) ||
        false
    );
  }, [userIsEndUser, report?.status, hasError]);

  const submitForm = async () => {
    setSubmitting(true);
    if (isPermittedToSubmit) {
      await submitReport(reportKeys);
    }
    await fetchReport(reportKeys);
    setSubmitting(false);
    // scroll to top of page
    window.scrollTo(0, 0);
    onClose();
  };

  return (
    <>
      {(hasError || report?.status === ReportStatus.NOT_STARTED) && (
        <Box sx={sx.alert}>
          <Alert
            title={alertBox.title}
            status={AlertTypes.ERROR}
            description={alertBox.description}
          />
        </Box>
      )}
      <Flex sx={sx.pageContainer} data-testid="review-submit-page">
        {report?.status === ReportStatus.SUBMITTED ? (
          <SuccessMessage
            reportType={report.reportType}
            name={report.submissionName || report.programName}
            date={report?.submittedOnDate}
            submittedBy={report?.submittedBy}
            reviewVerbiage={reviewAndSubmitVerbiage}
            stateName={report.fieldData.stateName!}
            reportKeys={reportKeys}
          />
        ) : (
          <ReadyToSubmit
            submitForm={submitForm}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            submitting={submitting}
            isPermittedToSubmit={isPermittedToSubmit}
            reviewVerbiage={reviewAndSubmitVerbiage}
            reportKeys={reportKeys}
          />
        )}
      </Flex>
    </>
  );
};

const PrintButton = ({
  reviewVerbiage,
  reportKeys,
}: {
  reviewVerbiage: AnyObject;
  reportKeys: ReportKeys;
}) => {
  const { print } = reviewVerbiage;
  const { report } = useStore();
  const isSubmitted = report?.status === "Submitted";
  const { reportType, state, id } = reportKeys;
  return (
    <Button
      as={RouterLink}
      to={`/export/${reportType}/${state}/${id}`}
      target="_blank"
      sx={!isSubmitted ? sx.printButton : sx.downloadButton}
      leftIcon={
        !isSubmitted ? (
          <Image src={iconSearchDefault} alt="Search Icon" height=".9rem" />
        ) : (
          <Image src={iconSearchSubmitted} alt="Search Icon" height=".9rem" />
        )
      }
      variant={!isSubmitted ? "outline" : "primary"}
    >
      {print.printButtonText}
    </Button>
  );
};

const ReadyToSubmit = ({
  submitForm,
  isOpen,
  onOpen,
  onClose,
  submitting,
  isPermittedToSubmit,
  reviewVerbiage,
  reportKeys,
}: ReadyToSubmitProps) => {
  const { review } = reviewVerbiage;
  const { intro, modal, pageLink } = review;

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>{parseCustomHtml(intro.info)}</Text>
        </Box>

        <Box>
          <StatusTable />
        </Box>
      </Box>
      <Flex sx={sx.submitContainer}>
        <PrintButton reviewVerbiage={reviewVerbiage} reportKeys={reportKeys} />
        <Button
          type="submit"
          onClick={onOpen as MouseEventHandler}
          isDisabled={!isPermittedToSubmit}
          sx={sx.submitButton}
        >
          {pageLink.text}
        </Button>
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        submitting={submitting}
        modalDisclosure={{
          isOpen,
          onClose,
        }}
        content={modal.structure}
      >
        <Text>{modal.body}</Text>
      </Modal>
    </Flex>
  );
};

interface ReadyToSubmitProps {
  submitForm: Function;
  isOpen: boolean;
  onOpen: Function;
  onClose: Function;
  submitting?: boolean;
  hasStarted?: boolean;
  isPermittedToSubmit?: boolean;
  reviewVerbiage: AnyObject;
  reportKeys: ReportKeys;
}

export const SuccessMessageGenerator = (
  reportType: string,
  name: string,
  submissionDate?: number,
  submittedBy?: string,
  stateName?: string
) => {
  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `${submittedBy}`;

    // prepare success message for MLR report submission
    if (reportType === "MLR" && stateName) {
      const reportTitle = (
        <b>
          {stateName} {name}
        </b>
      );
      const preSubmissionMessage = `${reportType} submission for `;
      const postSubmissionMessage = ` ${submittedDate} by ${submittersName}.`;
      return [preSubmissionMessage, reportTitle, postSubmissionMessage];
    }
    return `${reportType} report for ${name} ${submittedDate} by ${submittersName}.`;
  }
  return `${reportType} report for ${name} was submitted.`;
};

export const SuccessMessage = ({
  reportType,
  name,
  date,
  submittedBy,
  reviewVerbiage,
  stateName,
  reportKeys,
}: SuccessMessageProps) => {
  const { submitted } = reviewVerbiage;
  const { intro } = submitted;
  const submissionMessage = SuccessMessageGenerator(
    reportType,
    name,
    date,
    submittedBy,
    stateName
  );

  return (
    <Flex sx={sx.contentContainer}>
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          <span>
            <Image src={checkIcon} alt="Checkmark Icon" sx={sx.headerImage} />
          </span>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>
            {Array.isArray(submissionMessage)
              ? submissionMessage.map((part, index) => (
                  <React.Fragment key={index}>{part}</React.Fragment>
                ))
              : submissionMessage}
          </Text>
        </Box>
      </Box>
      <Box>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        <Text sx={sx.additionalInfo}>{intro.additionalInfo}</Text>
      </Box>
      <Box sx={sx.infoTextBox}>
        <PrintButton reviewVerbiage={reviewVerbiage} reportKeys={reportKeys} />
      </Box>
    </Flex>
  );
};

interface SuccessMessageProps {
  reportType: string;
  name: string;
  reviewVerbiage: AnyObject;
  date?: number;
  submittedBy?: string;
  stateName?: string;
  reportKeys: ReportKeys;
}

const sx = {
  pageContainer: {
    height: "100%",
    width: "100%",
  },
  contentContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
  },
  leadTextBox: {
    width: "100%",
    paddingBottom: ".5rem",
    marginBottom: "spacer3",
    borderBottom: "1px solid",
    borderColor: "gray_light",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  infoTextBox: {
    marginTop: "spacer4",
    a: {
      color: "primary",
      textDecoration: "underline",
    },
  },
  infoHeading: {
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  headerImage: {
    display: "inline-block",
    marginRight: "spacer2",
    height: "27px",
  },
  additionalInfoHeader: {
    color: "gray",
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  additionalInfo: {
    color: "gray",
  },
  printButton: {
    minWidth: "6rem",
    height: "2rem",
    fontSize: "md",
    fontWeight: "700",
    border: "1px solid",
  },
  downloadButton: {
    minWidth: "6rem",
    height: "2rem",
    fontSize: "md",
    fontWeight: "700",
    color: "white !important",
    textDecoration: "none !important",
    "&:hover, &:focus": {
      backgroundColor: "primary",
      color: "white",
    },
  },
  submitContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
  alert: {
    marginBottom: "spacer4",
  },
  submitButton: {
    minHeight: "3rem",
    "&:disabled": {
      opacity: 1,
      background: "gray_lighter",
      color: "gray",
      "&:hover": {
        background: "gray_lighter",
      },
    },
  },
};
