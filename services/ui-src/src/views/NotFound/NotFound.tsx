// components
import { Flex, Text } from "@chakra-ui/react";

export const NotFound = () => (
  <Flex h="100%" justifyContent="center" py="12">
    <Text data-testid="not-found">Oops, page not found :( </Text>
  </Flex>
);
