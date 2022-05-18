// components
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { RouterLink } from "../../components/index";
//utils
import { useUser } from "utils/auth";

const userDetails = () => {
  const userInfo = useUser();
  const { email, given_name, family_name } = userInfo.user.attributes;
  const { userRole } = userInfo;
  const state = userInfo.user.attributes?.["custom:cms_state"] || "";
  return { email, given_name, family_name, userRole, state };
};

export const Profile = () => {
  const { email, given_name, family_name, userRole, state } = userDetails();
  return (
    <Flex sx={sx.root} data-testid="profile">
      <Heading as="h1" size="xl" sx={sx.heading}>
        Account Info
      </Heading>
      <Flex sx={sx.variantRow}>
        <Text sx={sx.fieldName}>Email</Text>
        <Text>{email}</Text>
      </Flex>
      <Flex>
        <Text sx={sx.fieldName}>First Name</Text>
        <Text>{given_name}</Text>
      </Flex>
      <Flex sx={sx.variantRow}>
        <Text sx={sx.fieldName}>Last Name</Text>
        <Text>{family_name}</Text>
      </Flex>
      <Flex>
        <Text sx={sx.fieldName}>Role</Text>
        <Text>{userRole}</Text>
      </Flex>
      {state && (
        <Flex sx={sx.variantRow}>
          <Text sx={sx.fieldName} data-testid="statetestid">
            State
          </Text>
          <Text>{state}</Text>
        </Flex>
      )}
      {userRole?.includes("approver") && (
        <RouterLink to="/admin" alt="link to banner edit page" tabindex={0}>
          <Button
            sx={sx.bannerEditButton}
            colorScheme="colorSchemes.main"
            data-testid="banner-editor-button"
          >
            Banner editor
          </Button>
        </RouterLink>
      )}
    </Flex>
  );
};

const sx = {
  root: {
    maxW: "30rem",
    paddingY: "12",
    height: "100%",
    flexDirection: "column",
  },
  heading: {
    marginBottom: "2rem",
  },
  fieldName: {
    minWidth: "8rem",
    fontWeight: "semibold",
  },
  variantRow: {
    background: "palette.gray_lightest",
  },
  bannerEditButton: {
    marginTop: "2rem",
  },
};
