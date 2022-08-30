import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form } from "components";
// types
import { AnyObject } from "types";
// form
import formJson from "forms/internal/adminDashSelector/adminDashSelector";
import formSchema from "forms/internal/adminDashSelector/adminDashSelector.schema";

export const ReadOnly = ({ verbiage }: Props) => {
  const navigate = useNavigate();

  const onSubmit = (formData: AnyObject) => {
    const selectedState = formData["ads-state"];
    localStorage.setItem("selectedState", selectedState);
    navigate("/mcpar/dashboard");
  };

  return (
    <Box sx={sx.root}>
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>
      <Form
        id={formJson.id}
        formJson={formJson}
        formSchema={formSchema}
        onSubmit={onSubmit}
      />
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
