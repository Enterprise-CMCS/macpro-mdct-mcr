import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
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
import { Modal, ReportContext } from "components";
// types
import { ReportStatus } from "types";
// utils
import { useUser, utcDateToReadableDate } from "utils";
// verbiage
import MCPARVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import MLRVerbiage from "verbiage/pages/mlr/mlr-review-and-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";
import printIcon from "assets/icons/icon_print.png";
import { AnyObject } from "yup/lib/types";

export const McparReviewSubmitPage = () => {
  const { report, fetchReport, submitReport } = useContext(ReportContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [submitting, setSubmitting] = useState<boolean>(false);

  // get user information
  const { state, userIsStateUser, userIsStateRep } = useUser().user ?? {};

  const isPermittedToSubmit = userIsStateUser || userIsStateRep;

  // get report type, state, and id from context or storage
  const reportType =
    report?.reportType || localStorage.getItem("selectedReportType");
  const reportId = report?.id || localStorage.getItem("selectedReport");
  const reportState = state || localStorage.getItem("selectedState");

  const reviewVerbiage = reportType === "MCPAR" ? MCPARVerbiage : MLRVerbiage;

  const reportKeys = {
    reportType: reportType,
    state: reportState,
    id: reportId,
  };

  useEffect(() => {
    if (report?.id) {
      fetchReport(reportKeys);
    }
  }, []);

  const submitForm = async () => {
    setSubmitting(true);
    if (isPermittedToSubmit) {
      await submitReport(reportKeys);
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <Flex sx={sx.pageContainer} data-testid="review-submit-page">
      {report?.status === ReportStatus.SUBMITTED ? (
        <SuccessMessage
          reportType={report.reportType}
          name={report.programName ?? report.submissionName}
          date={report?.submittedOnDate}
          submittedBy={report?.submittedBy}
          reviewVerbiage={reviewVerbiage}
        />
      ) : (
        <ReadyToSubmit
          submitForm={submitForm}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          submitting={submitting}
          isPermittedToSubmit={isPermittedToSubmit}
          reviewVerbiage={reviewVerbiage}
        />
      )}
    </Flex>
  );
};

const PrintButton = ({ reviewVerbiage }: { reviewVerbiage: AnyObject }) => {
  const { print } = reviewVerbiage;
  return (
    // TODO: make the path route to the correct report type (in the future)
    <Button
      as={RouterLink}
      to="/mcpar/export"
      target="_blank"
      sx={sx.printButton}
      leftIcon={<Image src={printIcon} alt="Print Icon" height="1.25rem" />}
      variant="outline"
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
}: ReadyToSubmitProps) => {
  const { review } = reviewVerbiage;
  const { intro, modal, pageLink } = review;
  const pdfExport = useFlags()?.pdfExport;

  return (
    <Flex sx={sx.contentContainer} data-testid="ready-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Box sx={sx.infoTextBox}>
          <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
          <Text>{intro.info}</Text>
        </Box>
      </Box>
      <Flex sx={sx.submitContainer}>
        {pdfExport && <PrintButton reviewVerbiage={reviewVerbiage} />}
        <Button
          type="submit"
          onClick={onOpen as MouseEventHandler}
          isDisabled={!isPermittedToSubmit}
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
  isPermittedToSubmit?: boolean;
  reviewVerbiage: AnyObject;
}

export const SuccessMessageGenerator = (
  reportType: string,
  name: string,
  submissionDate?: number,
  submittedBy?: string
) => {
  if (submissionDate && submittedBy) {
    const readableDate = utcDateToReadableDate(submissionDate, "full");
    const submittedDate = `was submitted on ${readableDate}`;
    const submittersName = `by ${submittedBy}`;
    return `${reportType} report for ${name} ${submittedDate} ${submittersName}.`;
  }
  return `MCPAR report for ${name} was submitted.`;
};

export const SuccessMessage = ({
  reportType,
  name,
  date,
  submittedBy,
  reviewVerbiage,
}: SuccessMessageProps) => {
  const { submitted } = reviewVerbiage;
  const { intro } = submitted;
  const submissionMessage = SuccessMessageGenerator(
    reportType,
    name,
    date,
    submittedBy
  );
  const pdfExport = useFlags()?.pdfExport;

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
          <Text>{submissionMessage}</Text>
        </Box>
      </Box>
      <Box>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        <Text sx={sx.additionalInfo}>{intro.additionalInfo}</Text>
      </Box>
      {pdfExport && (
        <Box sx={sx.infoTextBox}>
          <PrintButton reviewVerbiage={reviewVerbiage} />
        </Box>
      )}
    </Flex>
  );
};

interface SuccessMessageProps {
  reportType: string;
  name: string;
  date?: number;
  submittedBy?: string;
  reviewVerbiage: AnyObject;
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
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid",
    borderColor: "palette.gray_lighter",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
  },
  infoTextBox: {
    marginTop: "2rem",
  },
  infoHeading: {
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  headerImage: {
    display: "inline-block",
    marginRight: "1rem",
    height: "27px",
  },
  additionalInfoHeader: {
    color: "palette.gray",
    fontWeight: "bold",
    marginBottom: ".5rem",
  },
  additionalInfo: {
    color: "palette.gray",
  },
  printButton: {
    width: "5rem",
    height: "1.75rem",
    fontSize: "sm",
    fontWeight: "normal",
  },
  submitContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
};
