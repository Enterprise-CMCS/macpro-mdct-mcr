import React, { ReactChild } from "react";

// components
import {
  Button,
  Flex,
  Heading,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
import { makeMediaQueryClasses } from "utils";

export const Modal = ({
  actionFunction,
  actionId,
  children,
  content,
  modalState,
}: Props) => {
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
        <Flex sx={sx.modalCloseContainer}>
          <Button
            sx={sx.modalClose}
            leftIcon={<CloseIcon />}
            variant="link"
            onClick={modalState.onClose}
          >
            Close
          </Button>
        </Flex>
        <ModalBody sx={sx.modalBody}>{children}</ModalBody>

        <ModalFooter sx={sx.modalFooter}>
          <Button
            className={mqClasses}
            sx={sx.action}
            onClick={!actionId ? () => actionFunction() : undefined}
            form={actionId}
            type="submit"
            data-testid="modal-submit-button"
          >
            {content.actionButtonText}
          </Button>
          <Button
            className={mqClasses}
            sx={sx.close}
            variant="link"
            onClick={modalState.onClose}
          >
            {content.closeButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

interface Props {
  actionFunction: Function;
  actionId?: string;
  modalState: {
    isOpen: boolean;
    onClose: any;
  };
  children?: ReactChild | ReactChild[];
  content: {
    heading: string;
    actionButtonText: string;
    closeButtonText: string;
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
    padding: "0 4rem 0 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  modalCloseContainer: {
    alignItems: "center",
    justifycontent: "center",
    flexShrink: "0",
    position: "absolute",
    top: "2rem",
    right: "2rem",
  },
  modalClose: {
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
    justifyContent: "center",
    marginTop: "1rem",
    marginRight: "2rem",
    minWidth: "7.5rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
    "&.mobile": {
      fontSize: "sm",
    },
  },
  close: {
    justifyContent: "start",
    padding: ".5rem 1rem",
    marginTop: "1rem",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    "&.mobile": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
