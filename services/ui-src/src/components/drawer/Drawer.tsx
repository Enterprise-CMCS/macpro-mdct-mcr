import React from "react";

// Components
import {
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Text,
} from "@chakra-ui/react";
//import { Form } from "components";
import { CloseIcon } from "@cmsgov/design-system";

//import { makeMediaQueryClasses } from "utils";

export const Drawer = ({ drawerState }: Props) => {
  //   const mqClasses = makeMediaQueryClasses();
  return (
    <ChakraDrawer
      isOpen={drawerState.isOpen}
      onClose={drawerState.onClose}
      size="full"
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent sx={sx.drawerContent}>
        <Flex sx={sx.drawerCloseContainer}>
          <Button
            sx={sx.drawerClose}
            leftIcon={<CloseIcon />}
            variant="link"
            onClick={drawerState.onClose}
          >
            Close
          </Button>
        </Flex>
        <DrawerHeader sx={sx.drawerHeader}>
          <Text sx={sx.drawerHeaderText}>
            Add a quality & performance measure
          </Text>
        </DrawerHeader>
        <DrawerBody sx={sx.drawerBody}>
          {/* TODO: Get Form details somehow */}
          {/* <Form /> */}
          <form>Placeholder</form>
        </DrawerBody>
        <DrawerFooter sx={sx.drawerFooter}>
          <Button sx={sx.action}>Save</Button>
          <Button sx={sx.close} onClick={drawerState.onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  );
};

interface Props {
  drawerState: {
    isOpen: boolean;
    onClose?: any;
  };
  [key: string]: any;
}

const sx = {
  drawerContent: {
    maxWidth: "35vw",
    padding: "2rem",
    overflow: "scroll",
  },
  drawerHeader: {
    padding: "0",
  },
  drawerHeaderText: {
    padding: "0 4rem 0 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  drawerCloseContainer: {
    alignItems: "center",
    justifycontent: "center",
    flexShrink: "0",
    position: "absolute",
    top: "2rem",
    right: "2rem",
  },
  drawerClose: {
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
    paddingX: "0",
    paddingY: "1rem",
  },
  drawerFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "2rem",
  },
  action: {
    justifyContent: "start",
    marginTop: "1rem",
    marginRight: "2rem",
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
