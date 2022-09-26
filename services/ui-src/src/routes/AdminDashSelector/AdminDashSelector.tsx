import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form } from "components";
// types
import { AnyObject, FormJson } from "types";
// form
import formJson from "forms/adminDashSelector/adminDashSelector";
// utils
import { useUser } from "utils";

export const AdminDashSelector = ({ verbiage }: Props) => {
  const navigate = useNavigate();

  const { userIsAdmin, userIsApprover, userIsHelpDeskUser } =
    useUser().user ?? {};

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = (formData: AnyObject) => {
    if (userIsAdmin || userIsApprover || userIsHelpDeskUser) {
      const selectedState = formData["ads-state"];
      localStorage.setItem("selectedState", selectedState);
    }
    navigate("/mcpar");
  };

  return (
    <Box sx={sx.root} data-testid="read-only-view">
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>
      <Form id={form.id} formJson={form} onSubmit={onSubmit} />
      <Flex sx={sx.navigationButton}>
        <Button type="submit" form={formJson.id}>
          {verbiage.buttonLabel}
        </Button>
      </Flex>
    </Box>
  );
};

interface Props {
  verbiage: AnyObject;
}

const sx = {
  root: {
    ".ds-c-field__hint": {
      fontSize: "md",
      color: "palette.base",
    },
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
