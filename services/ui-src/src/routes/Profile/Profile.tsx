import { useNavigate } from "react-router-dom";
// components
import { Button, Heading } from "@chakra-ui/react";
import { BasicPage, Table } from "components";
//utils
import { useUser } from "utils";
import { UserRoles } from "types";

export const Profile = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { email, given_name, family_name, userRole, state } = user ?? {};

  const tableContent = {
    caption: "Profile Account Information",
    bodyRows: [
      ["Email", email!],
      ["First Name", given_name!],
      ["Last Name", family_name!],
      ["Role", userRole!],
    ],
  };
  if (state) {
    tableContent.bodyRows.push(["State", state]);
  }

  return (
    <BasicPage sx={sx.layout} data-testid="profile-view">
      <Heading as="h1" size="xl" sx={sx.heading}>
        Account Info
      </Heading>
      <Table content={tableContent} variant="striped" sxOverride={sx.table} />
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
    </BasicPage>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  heading: {
    marginBottom: "2rem",
  },
  table: {
    maxWidth: "25rem",
    "tr td:first-of-type": {
      width: "8rem",
      fontWeight: "semibold",
    },
    td: {
      padding: "0.5rem",
    },
  },
  adminButton: {
    marginTop: "2rem",
  },
};
