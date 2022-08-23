// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { BasicPage, DropdownField } from "components";
// utils
import { States } from "types";
import verbiage from "verbiage/pages/home";

export const ReadOnly = () => {
  const dropdownOptions = Object.keys(States).map((label) => {
    return {
      label,
      value: States[label as keyof typeof States],
    };
  });
  const { readOnly } = verbiage;
  return (
    <>
      <BasicPage data-testid="read-only-view">
        <Box>
          <Heading as="h1">{readOnly.header}</Heading>
          <Text>{readOnly.body}</Text>
        </Box>
        <DropdownField
          name="States"
          label=""
          ariaLabel={readOnly.ariaLabel}
          options={dropdownOptions}
        />
        <Flex>
          <Button type="submit">{readOnly.buttonLabel}</Button>
        </Flex>
      </BasicPage>
    </>
  );
};

// const sx = {};
