import React from "react";

// components
import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { makeMediaQueryClasses } from "utils";

export const Modal = ({ actionFunction, content, modalState }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <ChakraModal isOpen={modalState.isOpen} onClose={modalState.onClose}>
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalHeader>{content.heading}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content.body}</ModalBody>

        <ModalFooter>
          <Button
            className={mqClasses}
            sx={sx.action}
            onClick={() => actionFunction()}
          >
            {content.action}
          </Button>
          <Button
            className={mqClasses}
            sx={sx.dismiss}
            variant="link"
            onClick={modalState.onClose}
          >
            {content.dismiss}
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
    dismiss: string;
    heading: string;
  };
  [key: string]: any;
}

const sx = {
  modalContent: {
    maxWidth: "500px",
    marginX: "4rem",
  },
  action: {
    justifyContent: "start",
    marginTop: "1rem",
    marginBottom: "1rem",
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
  dismiss: {
    justifyContent: "start",
    marginTop: "1rem",
    marginRight: "1rem",
    padding: "0",
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
