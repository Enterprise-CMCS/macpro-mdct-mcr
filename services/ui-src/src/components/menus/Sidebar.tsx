import React, { useState } from "react";
import { Box, Flex, Heading, Text, FlexProps } from "@chakra-ui/react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuItemList, setOpenMenuItems] = useState([""]);
  const toggleVisibility = (parentName: string) => {
    if (openMenuItemList.includes(parentName)) {
      setOpenMenuItems(openMenuItemList.filter((name) => name !== parentName));
    } else {
      setOpenMenuItems((state) => [...state, parentName]);
    }
  };

  return (
    <Box sx={sx.root} className={isOpen ? "closed" : "open"}>
      <Box as="button" sx={sx.closeButton} onClick={() => setIsOpen(!isOpen)}>
        <ArrowIcon title="closeNavBarButton" direction="left" />
      </Box>
      <Box sx={sx.topBox}>
        <Heading sx={sx.title}>MCPAR Report Submission Form</Heading>
      </Box>
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

interface NavItemProps extends FlexProps {
  path: string;
  name: string;
  hasSubItems: boolean;
  itemLevel?: string;
  children?: any;
  onClick?: any;
}

const NavItem = ({
  // path,
  name,
  hasSubItems,
  itemLevel,
  children,
  onClick,
  ...rest
}: NavItemProps) => {
  // const linkPath = window.location.origin + "/mcpar/" + path;
  return (
    // <Link href={linkPath} textColor="palette.gray_darkest">
    <button onClick={onClick}>
      <Flex sx={sx.navItemFlex} {...rest} className={itemLevel}>
        {/* TODO: swap out for new assets from design */}
        <CheckCircleIcon />
        <Text sx={sx.navItemTitle}>{name}</Text>
        <Flex direction="column">{children}</Flex>
        {hasSubItems && (
          // TODO: swap out for new assets from design
          <ArrowIcon title="openNavItemsArrow" direction="down" />
        )}
      </Flex>
    </button>
    // </Link>
  );
};

const sx = {
  root: {
    position: "relative",
    minH: "100vh",
    width: "20rem",
    bg: "palette.gray_lightest",
    transition: "all 0.3s ease",
    "&.open": {
      marginLeft: "-1rem",
    },
    "&.closed": {
      marginLeft: "-21rem",
    },
  },
  topBox: {
    borderBottom: "1px solid var(--chakra-colors-palette-gray_lighter)",
  },
  title: {
    fontSize: "xl",
    fontWeight: "bold",
    minW: "11.5rem",
    padding: "1rem 1.5rem",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: "-2rem",
    height: "2.5rem",
    width: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0px 10px 10px 0px",
    bg: "palette.gray_lightest",
    ".ds-c-icon--arrow-left": {
      height: "1rem",
      marginRight: "2px",
      color: "palette.gray",
    },
  },
  navItemFlex: {
    width: "20rem",
    minHeight: "2.5rem",
    position: "relative",
    align: "center",
    role: "group",
    borderBottom: "1px solid var(--chakra-colors-palette-gray_lighter)",
    fontSize: "0.875rem",
    ".ds-c-icon--check-circle": {
      position: "absolute",
      top: "13px",
      left: "0.5rem",
      color: "palette.gray_lighter",
      height: "1rem",
      width: "1rem",
    },
    ".ds-c-icon--arrow-down": {
      position: "absolute",
      top: "10px",
      right: "0.5rem",
      fontSize: "13px",
      color: "palette.gray",
    },
  },
  navItemTitle: {
    marginLeft: "2rem",
    marginRight: "2.5rem",
    fontSize: "14px",
    marginY: "10px",
    width: "100%",
    textAlign: "left",
  },
};
