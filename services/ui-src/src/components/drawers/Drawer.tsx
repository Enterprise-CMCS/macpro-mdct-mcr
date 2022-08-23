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
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
import { makeMediaQueryClasses } from "utils";

export const Drawer = ({
  drawerDisclosure,
  drawerTitle,
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
  [key: string]: any;
}

const sx = {
  drawerContent: {
    maxWidth: "90vw",
    padding: "1rem",
    overflowY: "scroll",
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
  drawerBody: {
    padding: "1rem",
    ul: {
      paddingLeft: "1rem",
    },
  },
};
