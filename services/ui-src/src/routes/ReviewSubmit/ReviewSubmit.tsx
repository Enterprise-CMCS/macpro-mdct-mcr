import { MouseEventHandler, useContext, useEffect } from "react";
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
import { Modal, ReportContext, ReportPage, Sidebar } from "components";
// types
import { ReportStatus, UserRoles } from "types";
// utils
import { useUser, utcDateToReadableDate } from "utils";
// verbiage
import reviewVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
// assets
import checkIcon from "assets/icons/icon_check_circle.png";

export const ReviewSubmit = () => {
  const { report, fetchReport, updateReport } = useContext(ReportContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // get user's state
  const { user } = useUser();
  const { full_name, state, userRole } = user ?? {};

  const reportDetails = {
    state: state,
    reportId: report.reportId,
  };

  useEffect(() => {
    fetchReport(reportDetails);
  }, []);

  const submitForm = () => {
    if (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP) {
      updateReport(reportDetails, {
        status: ReportStatus.SUBMITTED,
        lastAlteredBy: full_name,
        submissionDate: Date.now(),
      });
    }
    onClose();
  };

  return (
    <ReportPage>
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        {report.status?.includes(ReportStatus.SUBMITTED) ? (
          <SuccessMessage
            programName={report.programName}
            date={report?.lastAltered}
            givenName={user?.given_name}
            familyName={user?.family_name}
          />
        ) : (
          <ReadyToSubmit
            submitForm={submitForm}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        )}
      </Flex>
    </ReportPage>
  );
};

const ReadyToSubmit = ({
  submitForm,
  isOpen,
  onOpen,
  onClose,
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
          <Text>{intro.info}</Text>
        </Box>
      </Box>
      <Flex sx={sx.submitContainer}>
        <Button type="submit" onClick={onOpen as MouseEventHandler}>
          {pageLink.text}
        </Button>
      </Flex>
      <Modal
        onConfirmHandler={submitForm}
        modalState={{
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
}

export const SuccessMessage = ({
  programName,
  date,
  givenName,
  familyName,
}: SuccessMessageProps) => {
  const { submitted } = reviewVerbiage;
  const { intro } = submitted;
  const readableDate = utcDateToReadableDate(date, "full");
  const submittedDate = `was submitted on ${readableDate}`;
  const submittersName = ` by ${givenName} ${familyName}`;
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
          <Text>{`MCPAR report for ${programName} ${submittedDate} ${submittersName}`}</Text>
        </Box>
      </Box>
      <Box>
        <Text sx={sx.additionalInfoHeader}>{intro.additionalInfoHeader}</Text>
        <Text sx={sx.additionalInfo}>{intro.additionalInfo}</Text>
      </Box>
    </Flex>
  );
};

interface SuccessMessageProps {
  programName: string;
  date: number;
  givenName?: string;
  familyName?: string;
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
    marginY: "3.5rem",
    marginLeft: "3.5rem",
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
  submitContainer: {
    justifyContent: "flex-end",
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
};
