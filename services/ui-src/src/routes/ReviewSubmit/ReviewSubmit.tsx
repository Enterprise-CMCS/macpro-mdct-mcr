import { useState } from "react";

// components
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Modal, ReportPage } from "components";
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

export const ReviewSubmit = () => {
  const [showModal, setShowModal] = useState(false);
  const { intro, modal } = verbiage;
  return (
    <ReportPage data-testid="review-and-submit-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>{intro.body}</Text>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        {showModal && (
          <Modal
            actionFunction={() => alert("What up ma homie?")}
            dismissFunction={() => setShowModal(false)}
            content={modal}
          />
        )}
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
