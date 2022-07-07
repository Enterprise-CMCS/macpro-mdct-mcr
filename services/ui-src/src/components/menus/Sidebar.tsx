import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Collapse, Flex, Heading, Link, Text } from "@chakra-ui/react";
// TODO: swap out for new assets from design
import { ArrowIcon, CheckCircleIcon } from "@cmsgov/design-system";

interface LinkItemProps {
  name: string;
  path: string;
  children?: LinkItemProps[] | null;
}

const LinkItems: LinkItemProps[] = [
  {
    name: "Get Started",
    path: "/get-started",
  },
  {
    name: "A: Program Information",
    path: "/program-information",
    children: [
      {
        name: "Point of Contact",
        path: "/point-of-contact",
        children: [
          {
            name: "fake sub 1",
            path: "/fake-sub-1",
          },
          {
            name: "fake sub 2",
            path: "/fake-sub-2",
          },
        ],
      },
      {
        name: "Reporting Period",
        path: "/reporting-period",
      },
      { name: "Add Plans", path: "/add-plans" },
      {
        name: "Add BSS Entities",
        path: "/add-bss-entities",
      },
    ],
  },
  {
    name: "B: State-Level Indicators",
    path: "/state-level-indicators",
    children: [
      {
        name: "I: Program Characteristics",
        path: "/program-characteristics",
      },
      {
        name: "III: Encounter Data Report",
        path: "/encounter-data-report",
      },
      {
        name: "X: Program Integrity",
        path: "/program-integrity",
      },
    ],
  },

  {
    name: "C: Program-Level Indicators",
    path: "/program-level-indicators",
    children: null,
  },
  {
    name: "D: Plan-Level Indicators",
    path: "/plan-level-indicators",
    children: null,
  },
  { name: "E: BSS Entity Indicators", path: "/bss-entity-indicators" },
  { name: "Review & Submit", path: "/review-and-submit" },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const isMcparReport = pathname.includes("/mcpar");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isMcparReport && (
        <Box sx={sx.root} className={isOpen ? "closed" : "open"}>
          <Box
            as="button"
            sx={sx.closeButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowIcon title="closeNavBarButton" direction="left" />
          </Box>
          <Box sx={sx.topBox}>
            <Heading sx={sx.title}>MCPAR Report Submission Form</Heading>
          </Box>
          {LinkItems.map((section) => (
            <NavSection
              key={section.name}
              section={section}
              level={1}
              basePath="/mcpar"
            />
          ))}
        </Box>
      )}
    </>
  );
};

interface NavSectionProps {
  key: string;
  section: LinkItemProps;
  level: number;
  basePath: string;
}

const NavSection = ({ section, level, basePath }: NavSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, path, children } = section;
  const itemPath = `${basePath}${path}`;
  return (
    <>
      <React.Fragment key={itemPath}>
        {children ? (
          <Box as="button" onClick={() => setIsOpen(!isOpen)}>
            <NavItem name={name} level={level} hasChildren={!!children} />
          </Box>
        ) : (
          <>
            <Link as={RouterLink} to={itemPath}>
              <NavItem name={name} level={level} hasChildren={!!children} />
            </Link>
          </>
        )}
        {!!children && (
          <Collapse in={isOpen}>
            {isOpen &&
              children.map((section) => (
                <NavSection
                  key={section.name}
                  section={section}
                  level={level + 1}
                  basePath={itemPath}
                />
              ))}
          </Collapse>
        )}
      </React.Fragment>
    </>
  );
};

interface NavItemProps {
  name: string;
  level: number;
  hasChildren: boolean;
}

const NavItem = ({ name, level, hasChildren }: NavItemProps) => (
  <Flex sx={sx.navItemFlex}>
    <CheckCircleIcon />
    <Text sx={sx.navItemTitle} className={`level-${level}`}>
      {name}
    </Text>
    {!!hasChildren && <ArrowIcon title="openNavItemsArrow" direction="down" />}
  </Flex>
);

const sx = {
  root: {
    position: "relative",
    height: "100vh",
    width: "20rem",
    bg: "palette.gray_lightest",
    transition: "all 0.3s ease",
    "&.open": {
      marginLeft: 0,
    },
    "&.closed": {
      marginLeft: "-20rem",
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
    flexDirection: "column",
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
    marginRight: "2.5rem",
    fontSize: "14px",
    marginY: "10px",
    textAlign: "left",
    "&.level-1": {
      marginLeft: "2rem",
    },
    "&.level-2": {
      marginLeft: "3rem",
    },
    "&.level-3": {
      marginLeft: "4rem",
    },
  },
};
