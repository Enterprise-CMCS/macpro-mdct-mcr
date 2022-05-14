// components
import { Button, Flex, Text } from "@chakra-ui/react";
import { RouterLink } from "components";

export const Profile = () => (
  <>
    <Flex h="100%" justifyContent="space-around" py="12">
      <Text data-testid="profile">
        This is the profile. More to come later.
      </Text>
      <RouterLink to="/admin" alt="link to admin">
        <Button
          maxW="300px"
          colorScheme="colorSchemes.main"
          data-testid="admin-button"
        >
          Link to Admin
        </Button>
      </RouterLink>
    </Flex>
  </>
);
