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
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";

//import { makeMediaQueryClasses } from "utils";

export const Drawer = ({ drawerState }: Props) => {
  //   const mqClasses = makeMediaQueryClasses();
  return (
    <ChakraDrawer
      isOpen={drawerState.isOpen}
      onClose={drawerState.onClose}
      placement="right"
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
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
        <DrawerHeader></DrawerHeader>
        <DrawerBody></DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  );
};

interface Props {
  drawerState: {
    isOpen: boolean;
    onClose: any;
  };
  [key: string]: any;
}

const sx = {
  //eslint-disable-next-line
  //   modalContent: {
  //     boxShadow: ".125rem .125rem .25rem",
  //     borderRadius: "0",
  //     maxWidth: "30rem",
  //     marginX: "4rem",
  //     padding: "2rem",
  //   },
  //   modalHeader: {
  //     padding: "0",
  //   },
  //   modalHeaderText: {
  //     padding: "0 4rem 0 0",
  //     fontSize: "2xl",
  //     fontWeight: "bold",
  //   },
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
  //eslint-disable-next-line
  //   modalBody: {
  //     paddingX: "0",
  //     paddingY: "1rem",
  //   },
  //   modalFooter: {
  //     justifyContent: "flex-start",
  //     padding: "0",
  //     paddingTop: "2rem",
  //   },
  //   action: {
  //     justifyContent: "start",
  //     marginTop: "1rem",
  //     marginRight: "2rem",
  //     span: {
  //       marginLeft: "0.5rem",
  //       marginRight: "-0.25rem",
  //     },
  //     "&.mobile": {
  //       fontSize: "sm",
  //     },
  //   },
  //   close: {
  //     justifyContent: "start",
  //     padding: ".5rem 1rem",
  //     marginTop: "1rem",
  //     span: {
  //       marginLeft: "0rem",
  //       marginRight: "0.5rem",
  //     },
  //     "&.mobile": {
  //       fontSize: "sm",
  //       marginRight: "0",
  //     },
  //   },
};
