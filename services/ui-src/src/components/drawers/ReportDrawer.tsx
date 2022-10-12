import { MouseEventHandler, useContext } from "react";
// Components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Drawer, Form, ReportContext } from "components";
// utils
import { useUser } from "utils";
// types
import { AnyObject, CustomHtmlElement, FormJson } from "types";
// constants
import { closeText, saveAndCloseText } from "../../constants";

export const ReportDrawer = ({
  drawerDisclosure,
  drawerTitle,
  drawerInfo,
  drawerDetails,
  form,
  onSubmit,
  formData,
  submitting,
  ...props
}: Props) => {
  const { report } = useContext(ReportContext);

  // determine if fields should be disabled (based on admin roles)
  const { userIsAdmin, userIsApprover, userIsHelpDeskUser } =
    useUser().user ?? {};
  const isAdminTypeUser = userIsAdmin || userIsApprover || userIsHelpDeskUser;
  const buttonText = isAdminTypeUser ? closeText : saveAndCloseText;

  return (
    <Drawer
      drawerDisclosure={drawerDisclosure}
      drawerTitle={drawerTitle}
      drawerInfo={drawerInfo}
      drawerDetails={drawerDetails}
      {...props}
    >
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        formData={formData ?? report?.fieldData}
      />
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          {!isAdminTypeUser && (
            <Button
              variant="outline"
              onClick={drawerDisclosure.onClose as MouseEventHandler}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" form={form.id} sx={sx.saveButton}>
            {submitting ? <Spinner size="small" /> : buttonText}
          </Button>
        </Flex>
      </Box>
    </Drawer>
  );
};

interface Props {
  drawerTitle: string;
  drawerInfo?: CustomHtmlElement[];
  drawerDetails?: AnyObject;
  form: FormJson;
  formData?: AnyObject;
  onSubmit: Function;
  submitting?: boolean;
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
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
  saveButton: {
    width: "8.25rem",
  },
};
