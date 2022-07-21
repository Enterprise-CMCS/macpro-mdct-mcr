// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { ReportPage } from "components";
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

export const Dashboard = () => {
  const { intro } = verbiage;
  return (
    <ReportPage data-testid="dashboard-view">
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
