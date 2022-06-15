// components
import { Flex, Text } from "@chakra-ui/react";

export const Error = () => (
  <Flex h="100%" justifyContent="center" py="12">
    <Text data-testid="error-view">Oops there was an error </Text>
  </Flex>
);
