// components
import { Box, Button, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { Modal, ReportPage } from "components";
import verbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

export const ReviewSubmit = () => {
  const { intro, modal } = verbiage;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ReportPage data-testid="review-and-submit-view">
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        <Text>{intro.body}</Text>
        <Button onClick={onOpen}>Open Modal</Button>
        <Modal
          actionFunction={() => alert("Hello there!. General Kenobi...")}
          modalState={{
            isOpen,
            onClose,
          }}
          content={modal}
        />
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
