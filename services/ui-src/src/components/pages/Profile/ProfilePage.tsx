import { useNavigate } from "react-router-dom";
// components
import { Button, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, Table } from "components";
// utils
import { createEmailLink, useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/profile";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const { email, given_name, family_name, userRole, state, userIsAdmin } =
    useStore().user ?? {};

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
    <PageTemplate sx={sx.layout}>
      <Heading as="h1" sx={sx.headerText}>
        {intro.header}
      </Heading>
      <Text>
        {intro.body}{" "}
        <Link href={createEmailLink(intro.email)} isExternal>
          {intro.email.address}
        </Link>
        .
      </Text>
      <Table content={tableContent} variant="striped" sxOverride={sx.table} />
      {userIsAdmin && (
        <Button sx={sx.adminButton} onClick={() => navigate("/admin")}>
          Banner Editor
        </Button>
      )}
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "spacer7",
      marginBottom: "5rem !important",
    },
  },
  headerText: {
    marginBottom: "spacer4",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  table: {
    marginTop: "spacer4",
    maxWidth: "100%",
    "tr td:first-of-type": {
      width: "8rem",
      fontWeight: "semibold",
    },
    td: {
      padding: "spacer1",
    },
  },
  adminButton: {
    marginTop: "spacer4",
  },
};
