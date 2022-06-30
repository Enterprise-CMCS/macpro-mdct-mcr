import React, { ReactText } from "react";
import { Box, Flex, Link, Text, FlexProps } from "@chakra-ui/react";
import { ArrowIcon, CheckCircleIcon } from "@cmsgov/design-system";

interface LinkItemProps {
  name: string;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Get Started", path: "get-started" },
  { name: "A: Program Information", path: "program-information" },
  { name: "B: State-Level Indicators", path: "state-level-indicators" },
  { name: "C: Program-Level Indicators", path: "program-level-indicators" },
  { name: "D: Plan-Level Indicators", path: "plan-level-indicators" },
  { name: "E: BSS Entity Indicators", path: "bss-entity-indicators" },
  { name: "Review & Submit", path: "review-and-submit" },
];

// from https://chakra-templates.dev/navigation/sidebar
export const Sidebar = () => {
  return (
    <Box sx={sx.root}>
      <Flex sx={sx.sideNavTopFlex}>
        <Text sx={sx.sideNavHeader}>MCPAR Report Submission Form</Text>
        <CloseButton />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const CloseButton = () => {
  return (
    <Flex align="center" paddingY="0.5rem" marginLeft="1.25rem" sx={sx.temp}>
      <ArrowIcon title="title" direction="left" />
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  path: string;
  children: ReactText;
}
const NavItem = ({ path, children, ...rest }: NavItemProps) => {
  const linkPath = window.location + "/" + path;
  return (
    <Link href={linkPath} textColor="palette.gray_darkest">
      <Flex sx={sx.navItemFlex} {...rest}>
        <CheckCircleIcon viewBox="10 10 200 200" />
        {children}
      </Flex>
    </Link>
  );
};

const sx = {
  root: {
    minH: "100vh",
    bg: "palette.gray_lightest",
    maxW: "15rem",
  },
  sideNavTopFlex: {
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid",
    borderColor: "palette.gray_lighter",
    padding: "1rem 1.5rem",
  },
  sideNavHeader: {
    fontSize: "xl",
    fontWeight: "bold",
    minW: "11.5rem",
  },
  temp: {
    ".ds-c-icon--arrow-left": {
      marginBottom: "3.5rem",
      marginLeft: "0.25rem",
      borderRadius: "10px 0px 0px 10px",
      backgroundColor: "palette.gray_lightest",
      height: "16px",
      width: "10px",
    },
  },
  navItemFlex: {
    align: "center",
    paddingY: "0.5rem",
    paddingLeft: "1.25rem",
    role: "group",
    borderBottom: "1px solid",
    borderColor: "palette.gray_lighter",
    ".ds-c-icon--check-circle": {
      fill: "palette.gray_lighter",
    },
  },
};
