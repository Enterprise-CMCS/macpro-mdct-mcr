// Components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
import { Drawer, Form } from "components";
// utils
import { useUser } from "utils";
// types
import { AnyObject, CustomHtmlElement, FormJson, EntityShape } from "types";
// constants
import { closeText, saveAndCloseText } from "../../constants";

export const ReportDrawer = ({
  drawerDisclosure,
  drawerTitle,
  drawerInfo,
  drawerDetails,
  form,
  selectedEntity,
  onSubmit,
  submitting,
  ...props
}: Props) => {
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
        formData={selectedEntity}
      />
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          {!isAdminTypeUser && (
            <Button variant="outline" onClick={() => drawerDisclosure.onClose}>
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
  selectedEntity: EntityShape;
  onSubmit: Function;
  submitting?: boolean;
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
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
