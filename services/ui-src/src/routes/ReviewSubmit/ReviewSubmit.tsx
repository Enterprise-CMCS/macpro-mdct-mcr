// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { ReportPage } from "components";
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

export const ReviewSubmit = () => {
  const { intro } = verbiage;

  return (
    <ReportPage data-testid="review-and-submit-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>{intro.body}</Text>
      </Box>
    </ReportPage>
  );
};

const sx = {
  leadTextBox: {
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
};
