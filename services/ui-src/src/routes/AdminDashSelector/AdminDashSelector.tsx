import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react";
import { Form } from "components";
// types
import { AnyObject, FormJson, UserRoles } from "types";
// form
import formJson from "forms/adminDashSelector/adminDashSelector";
// utils
import { useUser } from "utils";
import { useState } from "react";

export const AdminDashSelector = ({ verbiage }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // get current user role
  const { user } = useUser();
  const { userRole } = user ?? {};

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = (formData: AnyObject) => {
    setLoading(true);
    if (
      userRole === UserRoles.ADMIN ||
      userRole === UserRoles.APPROVER ||
      userRole === UserRoles.HELP_DESK
    ) {
      const selectedState = formData["ads-state"];
      localStorage.setItem("selectedState", selectedState);
    }
    setLoading(false);
    navigate("/mcpar");
  };

  return (
    <Box sx={sx.root} data-testid="read-only-view">
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>
      <Form id={form.id} formJson={form} onSubmit={onSubmit} />
      test
      <Flex sx={sx.navigationButton}>
        <Button type="submit" form={formJson.id}>
          {loading ? <Spinner size="md" /> : verbiage.buttonLabel}
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
