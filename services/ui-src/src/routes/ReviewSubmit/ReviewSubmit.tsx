/* eslint-disable no-console */
import { useContext, useState } from "react";

// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Error, Icon, ReportContext, ReportPage, Sidebar } from "components";

// form data
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import { Dialog } from "@cmsgov/design-system";

export const ReviewSubmit = () => {
  const { reportData, errorMessage: error } = useContext(ReportContext);
  const [showModal, setShowModal] = useState(false);
  const { intro } = verbiage;

  const submitForm = () => {
    console.log(reportData);
    console.log(reportData?.report);
  };

  return (
    <ReportPage data-testid="review-and-submit-view">
      <Flex sx={sx.pageContainer}>
        <Sidebar />
        <Flex sx={sx.reviewContainer}>
          {error && <Error />}
          <Box sx={sx.leadTextBox}>
            <Heading as="h1" sx={sx.headerText}>
              {intro.header}
            </Heading>
            <Box sx={sx.infoTextBox}>
              <Text sx={sx.infoHeading}>{intro.infoHeader}</Text>
              <Text>{intro.info}</Text>
            </Box>
          </Box>
          <Button
            type="submit"
            colorScheme="colorSchemes.primary"
            rightIcon={<Icon icon="arrowRight" />}
            onClick={() => setShowModal(true)}
          >
            Save & continue
          </Button>
        </Flex>

        {showModal && (
          <Dialog
            onExit={() => setShowModal(false)}
            getApplicationNode={() => document.getElementById("app")}
            heading="Dialog heading"
            actions={[
              <button
                className="ds-c-button ds-c-button--primary ds-u-margin-right--1"
                key="primary"
                onClick={() => submitForm()}
              >
                Dialog action
              </button>,
              <button
                className="ds-c-button ds-c-button--transparent"
                key="cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>,
            ]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            accumsan diam vitae metus lacinia, eget tempor purus placerat.
          </Dialog>
        )}
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
};
