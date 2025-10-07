import { MouseEventHandler } from "react";
// components
import {
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Box,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
import { ReportDrawerDetails } from "components";
// types
import { AnyObject, CustomHtmlElement, EntityType } from "types";
// utils
import { makeMediaQueryClasses, parseCustomHtml } from "utils";

import { drawerReminderText } from "../../constants";

export const Drawer = ({
  entityType,
  verbiage,
  drawerDisclosure,
  children,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const { isOpen, onClose } = drawerDisclosure;

  return (
    <ChakraDrawer
      isOpen={isOpen}
      onClose={() => {}}
      size="full"
      placement="right"
      {...props}
    >
      <DrawerOverlay />
      <DrawerContent sx={sx.drawerContent} className={mqClasses}>
        <DrawerHeader sx={sx.drawerHeader}>
          <Button
            sx={sx.drawerCloseButton}
            leftIcon={<CloseIcon />}
            variant="link"
            onClick={onClose as MouseEventHandler}
          >
            Close
          </Button>
        </DrawerHeader>
        <DrawerBody sx={sx.drawerBody}>
          {verbiage.drawerEyebrowTitle && (
            <Text sx={sx.drawerEyebrowHeaderText}>
              {verbiage.drawerEyebrowTitle}
            </Text>
          )}
          <Text sx={sx.drawerHeaderText}>{verbiage.drawerTitle}</Text>
          {verbiage.drawerInfo && (
            <Box sx={sx.infoTextBox}>
              {parseCustomHtml(verbiage.drawerInfo)}
            </Box>
          )}
          <Text sx={sx.drawerReminderText}>{drawerReminderText}</Text>
          {verbiage.drawerDetails && entityType && (
            <ReportDrawerDetails
              drawerDetails={verbiage.drawerDetails}
              entityType={entityType}
            />
          )}
          {children}
        </DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  );
};

interface Props {
  verbiage: {
    drawerEyebrowTitle?: string;
    drawerTitle: string;
    drawerInfo?: CustomHtmlElement[];
    drawerDetails?: AnyObject;
  };
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  entityType?: EntityType;
  [key: string]: any;
}

const sx = {
  drawerContent: {
    maxWidth: "90vw",
    padding: "1rem",
    "&.tablet": {
      maxWidth: "32rem",
    },
    "&.desktop": {
      maxWidth: "36rem",
    },
    h2: {
      lineHeight: "1.3rem",
    },
  },
  drawerEyebrowHeaderText: {
    fontSize: "md",
    fontWeight: "bold",
  },
  drawerHeader: {
    position: "relative",
    padding: "1rem",
  },
  drawerHeaderText: {
    paddingRight: "4rem",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  drawerReminderText: {
    marginTop: "1rem",
    paddingRight: "4rem",
    fontSize: "md",
    fontWeight: "normal",
  },
  drawerCloseButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    paddingTop: "0.25rem",
    span: {
      margin: "0 .25rem",
      paddingTop: "0.06rem",
      svg: {
        fontSize: "xs",
        width: "xs",
        height: "xs",
      },
    },
  },
  detailBox: {
    marginTop: "2rem",
    fontWeight: "normal",
    color: "base",
  },
  detailHeader: {
    marginBottom: ".5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
  },
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  infoTextBox: {
    marginTop: "2rem",
    "p, span": {
      color: "gray",
      fontSize: "16px",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
  },
  drawerBody: {
    padding: "0 1rem 1rem 1rem",
  },
};
