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
  drawerDisclosure,
  drawerTitle,
  drawerInfo,
  drawerDetails,
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
          <Text sx={sx.drawerHeaderText}>{drawerTitle}</Text>
          {drawerInfo && (
            <Box sx={sx.infoTextBox}>{parseCustomHtml(drawerInfo)}</Box>
          )}
          {drawerDetails && (
            <Box sx={sx.detailTextBox}>
              <Heading as="h4" sx={sx.drawerDetailHeader}>
                Standard Type - {drawerDetails.category}
              </Heading>
              <Text sx={sx.drawerDetailDescription}>
                {drawerDetails.standardDescription}
              </Text>
              <Text sx={sx.drawerDetailCategoryHeader}>General Category</Text>
              <Text sx={sx.drawerDetailCategory}>{drawerDetails.category}</Text>
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
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  drawerTitle: string;
  drawerInfo?: CustomHtmlElement[];
  drawerDetails?: AnyObject;
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
  drawerDetailHeader: {
    marginBottom: ".5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  drawerDetailDescription: {
    fontSize: "md",
    marginBottom: ".5rem",
    color: "palette.base",
  },
  drawerDetailCategoryHeader: {
    fontSize: "sm",
    marginBottom: ".25rem",
    color: "palette.base",
  },
  drawerDetailCategory: {
    fontSize: "md",
    color: "palette.base",
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
  drawerBody: {
    padding: "1rem",
  },
  detailTextBox: {
    marginTop: "2rem",
    fontWeight: "400",
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
};
