import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { BasicPage, DropdownField } from "components";
// types
import { AnyObject, InputChangeEvent } from "types";
import { States } from "../../constants";

export const ReadOnly = ({ verbiage }: Props) => {
  const navigate = useNavigate();

  // create dropdown options
  const dropdownOptions = Object.keys(States).map((value) => {
    return {
      value,
      label: States[value as keyof typeof States],
    };
  });

  const setState = (event: InputChangeEvent) => {
    localStorage.setItem("state", event.target.value);
  };

  const onSubmit = () => {
    const dashboard = "/mcpar/dashboard?state=" + localStorage.getItem("state");
    navigate(dashboard);
  };

  return (
    <BasicPage data-testid="read-only-view">
      <Box>
        <Heading as="h1" sx={sx.headerText}>
          {verbiage.header}
        </Heading>
      </Box>
      <DropdownField
        name="States"
        hint={verbiage.body}
        ariaLabel={verbiage.ariaLabel}
        options={dropdownOptions}
        onChange={setState}
      />
      <Flex sx={sx.navigationButton}>
        <Button type="submit" onClick={onSubmit}>
          {verbiage.buttonLabel}
        </Button>
      </Flex>
    </BasicPage>
  );
};

interface Props {
  verbiage: AnyObject;
}

const sx = {
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
