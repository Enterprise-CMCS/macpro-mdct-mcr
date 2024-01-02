import { MouseEventHandler } from "react";
// Components
import { Box, Button, Flex, Text, Spinner } from "@chakra-ui/react";
import { Drawer, Form } from "components";
// utils
import { useStore } from "utils";
// types
import {
  AnyObject,
  CustomHtmlElement,
  FormJson,
  EntityShape,
  EntityType,
} from "types";
// constants
import { closeText, saveAndCloseText } from "../../constants";

export const ReportDrawer = ({
  entityType,
  selectedEntity,
  verbiage,
  form,
  onSubmit,
  submitting,
  drawerDisclosure,
  validateOnRender,
  ...props
}: Props) => {
  // determine if fields should be disabled (based on admin and read-only roles)
  const { userIsAdmin, userIsReadOnly } = useStore().user ?? {};
  const buttonText =
    userIsAdmin || userIsReadOnly ? closeText : saveAndCloseText;
  const formFieldsExist = form.fields.length;
  return (
    <Drawer
      verbiage={verbiage}
      drawerDisclosure={drawerDisclosure}
      entityType={entityType}
      {...props}
    >
      {formFieldsExist ? (
        <Form
          id={form.id}
          formJson={form}
          onSubmit={onSubmit}
          formData={selectedEntity}
          validateOnRender={validateOnRender || false}
          dontReset={true}
        />
      ) : (
        <Text sx={sx.noFormMessage}>{verbiage.drawerNoFormMessage}</Text>
      )}
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          {(!userIsAdmin || !userIsReadOnly) && (
            <Button
              variant="outline"
              onClick={drawerDisclosure.onClose as MouseEventHandler}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            form={form.id}
            sx={sx.saveButton}
            disabled={!formFieldsExist}
          >
            {submitting ? <Spinner size="md" /> : buttonText}
          </Button>
        </Flex>
      </Box>
    </Drawer>
  );
};

interface Props {
  selectedEntity: EntityShape;
  verbiage: {
    drawerEyebrowTitle?: string;
    drawerTitle: string;
    drawerInfo?: CustomHtmlElement[];
    drawerDetails?: AnyObject;
    drawerNoFormMessage?: string;
  };
  form: FormJson;
  onSubmit: Function;
  entityType?: EntityType;
  submitting?: boolean;
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  validateOnRender?: boolean;
}

const sx = {
  noFormMessage: {
    margin: "0.5rem auto 0.25rem",
    fontSize: "lg",
    color: "palette.error_darker",
  },
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
