import { useNavigate } from "react-router-dom";
// components
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
//utils
import { useUser } from "utils";
import { UserRoles } from "types";

export const Profile = () => {
  const { user } = useUser();
  const { email, given_name, family_name, userRole, state } = user ?? {};
  const navigate = useNavigate();
  return (
    <>
      <Flex sx={sx.root} data-testid="profile-view">
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
            <Text sx={sx.fieldName}>State</Text>
            <Text>{state}</Text>
          </Flex>
        )}
        {userRole === UserRoles.ADMIN && (
          <Button
            colorScheme="colorSchemes.main"
            data-testid="banner-admin-button"
            sx={sx.adminButton}
            onClick={() => navigate("/admin")}
          >
            Banner Editor
          </Button>
        )}
      </Flex>
    </>
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
  adminButton: {
    marginTop: "2rem",
  },
};
