import { MouseEventHandler } from "react";
// Components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Drawer, Form } from "components";
// types
import { FormJson } from "types";
// form data
import { reportSchema } from "forms/mcpar/reportSchema";

export const ReportDrawer = ({
  drawerDisclosure,
  drawerTitle,
  drawerInfo,
  form,
  onSubmit,
  ...props
}: Props) => {
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
        formSchema={reportSchema[form.id as keyof typeof reportSchema]}
        onSubmit={onSubmit}
      />
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button
            variant="outline"
            type="submit"
            onClick={drawerDisclosure.onClose as MouseEventHandler}
          >
            Cancel
          </Button>
          <Button>Save & Close</Button>
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
