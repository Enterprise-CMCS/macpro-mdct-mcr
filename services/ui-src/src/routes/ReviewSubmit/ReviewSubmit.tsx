import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { Icon, Modal, ReportContext, ReportPage, Sidebar } from "components";

// form data
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import { useUser } from "utils";
import { ReportStatus, UserRoles } from "types";

export const ReviewSubmit = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { reportData, updateReportStatus } = useContext(ReportContext);

  const { intro, modal, pageLink } = verbiage;

  // get user's state
  const { user } = useUser();
  const { userRole } = user ?? {};

  const submitForm = () => {
    if (
      reportData?.key &&
      reportData?.programName &&
      (userRole === UserRoles.STATE_USER || userRole === UserRoles.STATE_REP)
    ) {
      const reportStatus = {
        key: reportData.key,
        programName: reportData.programName,
        status: ReportStatus.COMPLETED,
      };
      updateReportStatus(reportStatus);
      navigate(pageLink.location);
    }
    onClose();
  };

  return (
    <ReportPage data-testid="review-and-submit-view">
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reviewContainer}>
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
            <Button
              type="submit"
              colorScheme="colorSchemes.primary"
              rightIcon={<Icon icon="arrowRight" />}
              onClick={onOpen}
            >
              {pageLink.text}
            </Button>
          </Flex>
          <Modal
            actionFunction={() => submitForm()}
            modalState={{
              isOpen,
              onClose,
            }}
            content={modal}
          />
        </Flex>
      </Flex>
    </ReportPage>
  );
};

const sx = {
  pageContainer: {
    width: "100%",
  },
  reviewContainer: {
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
};
