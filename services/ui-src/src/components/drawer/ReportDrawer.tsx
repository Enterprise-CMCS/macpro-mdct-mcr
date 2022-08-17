import React from "react";
import { Form } from "components";
import { reportSchema } from "forms/mcpar/reportSchema";

// Components
import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";

export const ReportDrawer = ({ drawerState, form, onSubmit }: Props) => {
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
          <Text sx={sx.drawerHeaderText}>Example</Text>
        </DrawerHeader>
        <DrawerBody sx={sx.drawerBody}>
          <Form
            id={form.id}
            formJson={form}
            formSchema={reportSchema[form.id as keyof typeof reportSchema]}
            onSubmit={onSubmit}
          />
          <Box sx={sx.footerBox}>
            <Flex sx={sx.buttonFlex}>
              <Button variant="outline" type="submit">
                Cancel
              </Button>
              <Button>Save & Close</Button>
            </Flex>
          </Box>
        </DrawerBody>
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
    paddingX: "0.5rem",
    paddingY: "1rem",
  },
  drawerFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "2rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
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
