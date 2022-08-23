// components
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { BasicPage } from "components";
// utils
import verbiage from "verbiage/pages/read-only";

export const ReadOnly = () => {
  const { intro, buttonLabel } = verbiage;
  return (
    <>
      <BasicPage data-testid="read-only-view">
        <Box>
          <Heading as="h1">{intro.header}</Heading>
          <Text>{intro.body}</Text>
        </Box>
        {/* <Form><DropdownField></DropdownField></Form> */}
        <Flex>
          <Button type="submit">{buttonLabel}</Button>
        </Flex>
      </BasicPage>
    </>
  );
};

// const sx = {};
