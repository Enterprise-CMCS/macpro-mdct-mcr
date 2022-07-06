import React, { useState } from "react";
import { Box, Button, Flex, Link, Text, FlexProps } from "@chakra-ui/react";
import { ArrowIcon, CheckCircleIcon } from "@cmsgov/design-system";

interface LinkItemProps {
  name: string;
  path: string;
  hasSubItems?: boolean;
  parent?: string;
}

const LinkItems: LinkItemProps[] = [
  { name: "Get Started", path: "get-started" },
  {
    name: "A: Program Information",
    path: "program-information",
    hasSubItems: true,
  },
  {
    name: "Point of Contact",
    path: "point-of-contact",
    parent: "A: Program Information",
  },
  {
    name: "Reporting Period",
    path: "reporting-period",
    parent: "A: Program Information",
  },
  { name: "Add Plans", path: "add-plans", parent: "A: Program Information" },
  {
    name: "Add BSS Entities",
    path: "add-bss-entities",
    parent: "A: Program Information",
  },
  {
    name: "B: State-Level Indicators",
    path: "state-level-indicators",
    hasSubItems: true,
  },
  {
    name: "I: Program Characteristics",
    path: "program-characteristics",
    parent: "B: State-Level Indicators",
  },
  {
    name: "III: Encounter Data Report",
    path: "encounter-data-report",
    parent: "B: State-Level Indicators",
  },
  {
    name: "X: Program Integrity",
    path: "program-integrity",
    parent: "B: State-Level Indicators",
  },
  {
    name: "C: Program-Level Indicators",
    path: "program-level-indicators",
    hasSubItems: true,
  },
  {
    name: "D: Plan-Level Indicators",
    path: "plan-level-indicators",
    hasSubItems: true,
  },
  { name: "E: BSS Entity Indicators", path: "bss-entity-indicators" },
  { name: "Review & Submit", path: "review-and-submit" },
];

export const Sidebar = () => {
  const [openMenuItemList, setOpenMenuItems] = useState([""]);
  const toggleVisibility = (parentName: string) => {
    if (openMenuItemList.includes(parentName)) {
      setOpenMenuItems(openMenuItemList.filter((name) => name !== parentName));
    } else {
      setOpenMenuItems((state) => [...state, parentName]);
    }
  };
  return (
    <Box sx={sx.root}>
      <Flex sx={sx.sideNavTopFlex}>
        <Text sx={sx.sideNavHeader}>MCPAR Report Submission Form</Text>
        <CloseButton />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          path={link.path}
          hasSubItems={!!link.hasSubItems}
          name={link.name}
          hidden={!!link.parent && !openMenuItemList.includes(link.parent)}
          onClick={() => {
            toggleVisibility(link.name);
          }}
        />
      ))}
    </Box>
  );
};

const CloseButton = () => {
  return (
    <Flex align="center" paddingY="0.5rem" marginLeft="1.25rem" sx={sx.temp}>
      <ArrowIcon title="closeNavBarButton" direction="left" />
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  path: string;
  name: string;
  hasSubItems: boolean;
  itemLevel?: string;
  children?: any;
  onClick?: any;
}
const NavItem = ({
  path,
  name,
  hasSubItems,
  itemLevel,
  children,
  onClick,
  ...rest
}: NavItemProps) => {
  const linkPath = window.location.origin + "/mcpar/" + path;
  return (
    // <Link href={linkPath} textColor="palette.gray_darkest">
    <Flex sx={sx.navItemFlex} {...rest} className={itemLevel}>
      <CheckCircleIcon viewBox="10 10 200 200" />
      <Text>{name}</Text>
      <Flex direction="column">{children}</Flex>
      {hasSubItems && (
        <Button onClick={onClick}>
          <ArrowIcon title="openNavItemsArrow" direction="down" />
        </Button>
      )}
    </Flex>
    // </Link>
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
    fontSize: "0.875rem",
    ".ds-c-icon--check-circle": {
      fill: "palette.gray_lighter",
    },
    ".ds-c-icon--arrow-down": {
      backgroundColor: "palette.gray_lightest",
      color: "palette.gray",
      height: "16px",
      width: "10px",
      marginLeft: "0.5rem",
      alignSelf: "center",
    },
  },
};
