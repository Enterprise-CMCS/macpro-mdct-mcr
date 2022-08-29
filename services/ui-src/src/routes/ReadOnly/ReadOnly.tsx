import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { BasicPage, DropdownField } from "components";
// types
import { InputChangeEvent, States } from "types";
// utils
import verbiage from "verbiage/pages/home";

export const ReadOnly = () => {
  // const options = Object.values(States);
  const navigate = useNavigate();
  const dropdownOptions = Object.keys(States).map((value) => {
    return {
      value,
      label: States[value as keyof typeof States],
    };
  });
  const { readOnly } = verbiage;
  const labelStyle = "margin-top: 0";

  const setState = (event: InputChangeEvent) => {
    localStorage.setItem("state", event.target.value);
  };

  const onSubmit = () => {
    const dashboard = "/mcpar/dashboard?state=" + localStorage.getItem("state");
    navigate(dashboard);
  };

  return (
    <>
      <BasicPage data-testid="read-only-view">
        <Box>
          <Heading as="h1" sx={sx.headerText}>
            {readOnly.header}
          </Heading>
        </Box>
        <DropdownField
          name="States"
          label=""
          labelClassName={labelStyle}
          hint={readOnly.body}
          ariaLabel={readOnly.ariaLabel}
          options={dropdownOptions}
          onChange={setState}
        />
        <Flex sx={sx.navigationButton}>
          <Button type="submit" onClick={onSubmit}>
            {readOnly.buttonLabel}
          </Button>
        </Flex>
      </BasicPage>
    </>
  );
};

const sx = {
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
