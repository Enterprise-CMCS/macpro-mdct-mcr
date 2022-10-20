import { ReactNode } from "react";
// components
import {
  Button,
  Flex,
  Heading,
  Image,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// assets
import closeIcon from "assets/icons/icon_close.png";

export const Modal = ({
  modalDisclosure,
  content,
  onConfirmHandler,
  submitting,
  formId,
  children,
}: Props) => {
  return (
    <ChakraModal
      isOpen={modalDisclosure.isOpen}
      onClose={modalDisclosure.onClose}
      preserveScrollBarGap={true}
    >
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
            leftIcon={<Image src={closeIcon} alt="Close" sx={sx.closeIcon} />}
            variant="link"
            onClick={modalDisclosure.onClose}
          >
            Close
          </Button>
        </Flex>
        <ModalBody sx={sx.modalBody}>{children}</ModalBody>
        <ModalFooter sx={sx.modalFooter}>
          {formId && (
            <Button
              sx={sx.action}
              form={formId}
              type="submit"
              data-testid="modal-submit-button"
            >
              {submitting ? <Spinner size="small" /> : content.actionButtonText}
            </Button>
          )}
          {onConfirmHandler && (
            <Button
              sx={sx.action}
              onClick={() => onConfirmHandler()}
              data-testid="modal-submit-button"
            >
              {submitting ? <Spinner size="small" /> : content.actionButtonText}
            </Button>
          )}
          {content.closeButtonText && (
            <Button
              sx={sx.close}
              variant="link"
              onClick={modalDisclosure.onClose}
            >
              {content.closeButtonText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  content: {
    heading: string;
    actionButtonText: string | ReactNode;
    closeButtonText?: string;
  };
  submitting?: boolean;
  onConfirmHandler?: Function;
  formId?: string;
  children?: ReactNode;
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
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
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
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
  closeIcon: {
    width: "0.75rem",
  },
};
