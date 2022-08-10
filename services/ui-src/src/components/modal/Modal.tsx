import React from "react";

// components
import {
  Box,
  Button,
  Heading,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
import { makeMediaQueryClasses } from "utils";

export const Modal = ({ actionFunction, content, modalState }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <ChakraModal isOpen={modalState.isOpen} onClose={modalState.onClose}>
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalHeader sx={sx.modalHeader}>
          <Heading as="h1" sx={sx.modalHeaderText}>
            {content.heading}
          </Heading>
        </ModalHeader>
        <Box sx={sx.modalCloseContainer}>
          <Button
            sx={sx.modalClose}
            leftIcon={<CloseIcon />}
            variant="link"
            onClick={modalState.onClose}
          >
            Close
          </Button>
        </Box>
        <ModalBody sx={sx.modalBody}>
          <Text>{content.body}</Text>
        </ModalBody>

        <ModalFooter sx={sx.modalFooter}>
          <Button
            className={mqClasses}
            sx={sx.action}
            onClick={() => actionFunction()}
          >
            {content.action}
          </Button>
          <Button
            className={mqClasses}
            sx={sx.close}
            variant="link"
            onClick={modalState.onClose}
          >
            {content.close}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

interface Props {
  actionFunction: Function;
  modalState: {
    isOpen: boolean;
    onClose: any;
  };
  content: {
    action: string;
    body: string;
    close: string;
    heading: string;
  };
  [key: string]: any;
}

const sx = {
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "30rem",
    marginX: "4rem",
    padding: "2rem",
  },
  modalHeader: {
    padding: "0",
  },
  modalHeaderText: {
    padding: "0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  modalCloseContainer: {
    display: "flex",
    alignItems: "center",
    justifycontent: "center",
    flexShrink: "0",
    position: "absolute",
    top: "2rem",
    right: "2rem",
  },
  modalClose: {
    color: "palette.primary",
    fontWeight: "bold",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
      color: "palette.primary_darker",
    },
    span: {
      margin: "0 .25rem",
      svg: {
        fontSize: "xs",
        width: "xs",
        height: "xs",
      },
    },
  },
  modalBody: {
    paddingX: "0",
    paddingY: "1rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "2rem",
  },
  action: {
    justifyContent: "start",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    background: "palette.primary",
    fontWeight: "bold",
    color: "palette.white",
    marginRight: "2rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
    _hover: {
      background: "palette.primary_darker",
    },
    "&.mobile": {
      fontSize: "sm",
    },
  },
  close: {
    justifyContent: "start",
    paddingY: ".5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    marginTop: "1rem",
    borderRadius: "0.25rem",
    fontWeight: "bold",
    color: "palette.primary",
    textDecoration: "underline",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    _hover: {
      textDecoration: "none",
    },
    "&.mobile": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
