import { MouseEventHandler } from "react";
// Components
import {
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
import { AnyObject, CustomHtmlElement } from "types";
import { makeMediaQueryClasses, parseCustomHtml } from "utils";

export const Drawer = ({
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
          <Text sx={sx.drawerHeaderText}>{verbiage.drawerTitle}</Text>
          {verbiage.drawerInfo && (
            <Box sx={sx.infoTextBox}>
              {parseCustomHtml(verbiage.drawerInfo)}
            </Box>
          )}
          {verbiage.drawerDetails && (
            <Box sx={sx.detailBox}>
              <Heading as="h4" sx={sx.detailHeader}>
                Standard Type - {verbiage.drawerDetails.category}
              </Heading>
              <Text sx={sx.detailDescription}>
                {verbiage.drawerDetails.standardDescription}
              </Text>
              <Text sx={sx.detailCategoryHeader}>General Category</Text>
              <Text sx={sx.detailCategory}>
                {verbiage.drawerDetails.category}
              </Text>
            </Box>
          )}
          <Button
            sx={sx.drawerCloseButton}
            leftIcon={<CloseIcon />}
            variant="link"
            onClick={onClose as MouseEventHandler}
          >
            Close
          </Button>
        </DrawerHeader>
        <DrawerBody sx={sx.drawerBody}>{children}</DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  );
};

interface Props {
  verbiage: {
    drawerTitle: string;
    drawerInfo?: CustomHtmlElement[];
    drawerDetails?: AnyObject;
  };
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
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
  },
  drawerHeader: {
    padding: "1rem",
  },
  drawerHeaderText: {
    paddingRight: "4rem",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  drawerCloseButton: {
    position: "absolute",
    top: "2rem",
    right: "2rem",
    span: {
      margin: "0 .25rem",
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
    color: "palette.base",
  },
  detailHeader: {
    marginBottom: ".5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  detailCategoryHeader: {
    marginBottom: ".25rem",
    fontSize: "sm",
    fontWeight: "bold",
  },
  detailCategory: {
    fontSize: "md",
  },
  infoTextBox: {
    marginTop: "2rem",
    "p, span": {
      color: "palette.gray",
      fontSize: "16px",
    },
    a: {
      color: "palette.primary",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
  },
  drawerBody: {
    padding: "1rem",
  },
};
