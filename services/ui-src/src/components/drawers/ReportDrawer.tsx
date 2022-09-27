import { MouseEventHandler, useContext } from "react";
// Components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Drawer, Form, ReportContext } from "components";
// types
import { FormJson } from "types";

export const ReportDrawer = ({
  drawerDisclosure,
  drawerTitle,
  drawerInfo,
  form,
  onSubmit,
  ...props
}: Props) => {
  const { report } = useContext(ReportContext);
  // TODO: add spinner
  return (
    <Drawer
      drawerDisclosure={drawerDisclosure}
      drawerTitle={drawerTitle}
      drawerInfo={drawerInfo}
      {...props}
    >
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        formData={report}
      />
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button
            variant="outline"
            onClick={drawerDisclosure.onClose as MouseEventHandler}
          >
            Cancel
          </Button>
          <Button type="submit" form={form.id}>
            Save & Close
          </Button>
        </Flex>
      </Box>
    </Drawer>
  );
};

interface Props {
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  drawerTitle: string;
  drawerInfo?: any[];
  form: FormJson;
  onSubmit: Function;
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
};
