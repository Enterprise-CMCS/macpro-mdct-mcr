import { useNavigate } from "react-router-dom";
// components
import { Button, Heading, Link, Text } from "@chakra-ui/react";
import { BasicPage, Table } from "components";
//utils
import { createEmailLink, useUser } from "utils";
import { UserRoles } from "types";
import verbiage from "verbiage/profile-view";

export const Profile = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { email, given_name, family_name, userRole, state } = user ?? {};
  const { intro } = verbiage;

  const tableContent = {
    caption: "Profile Account Information",
    bodyRows: [
      ["Email", email!],
      ["First Name", given_name!],
      ["Last Name", family_name!],
      ["Role", userRole!],
      ["State", state! || "N/A"],
    ],
  };

  return (
    <BasicPage sx={sx.layout} data-testid="profile-view">
      <Heading as="h1" sx={sx.headerText}>
        {intro.header}
      </Heading>
      <Text>
        {intro.body}{" "}
        <span>
          <Link
            sx={sx.emailText}
            href={createEmailLink(intro.email)}
            target="_blank"
          >
            {intro.email.address}
          </Link>
        </span>
        {"."}
      </Text>

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
  headerText: {
    marginBottom: "rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  emailText: {
    fontWeight: "bold",
  },
  table: {
    marginTop: "2rem",
    maxWidth: "100%",
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
