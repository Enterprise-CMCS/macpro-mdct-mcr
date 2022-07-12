import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Collapse, Flex, Heading, Link, Text } from "@chakra-ui/react";
// TODO: swap out for new assets from design
import { ArrowIcon, CheckCircleIcon } from "@cmsgov/design-system";
import NavItems from "data/navigation/MCPARSideNavItems";

interface LinkItemProps {
  name: string;
  path: string;
  children?: LinkItemProps[] | null;
}

const basePath = "/mcpar";

export const Sidebar = () => {
  const { pathname } = useLocation();
  const isMcparReport = pathname.includes("/mcpar");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {isMcparReport && (
        <Box sx={sx.root} className={isOpen ? "open" : "closed"}>
          <Box
            as="button"
            sx={sx.closeButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowIcon
              title="closeNavBarButton"
              direction={isOpen ? "left" : "right"}
            />
          </Box>
          <Box sx={sx.topBox}>
            <Heading sx={sx.title}>MCPAR Report Submission Form</Heading>
          </Box>
          {NavItems.map((section) => (
            <NavSection
              key={section.name}
              section={section}
              level={1}
              basePath={basePath}
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
            <NavItem
              name={name}
              level={level}
              optionPath={itemPath}
              hasChildren={!!children}
              isOpen={isOpen}
            />
          </Box>
        ) : (
          <Link as={RouterLink} to={itemPath}>
            <NavItem
              name={name}
              level={level}
              optionPath={itemPath}
              hasChildren={!!children}
            />
          </Link>
        )}
        {!!children && (
          <Collapse in={isOpen}>
            {children.map((section) => (
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
  optionPath: string;
  level: number;
  hasChildren: boolean;
  isOpen?: boolean;
}

const NavItem = ({
  name,
  optionPath,
  level,
  hasChildren,
  isOpen,
}: NavItemProps) => {
  const currentPath = window.location.pathname;
  const selectedClass = optionPath === currentPath ? "selected" : "";
  return (
    <Flex sx={sx.navItemFlex} className={selectedClass}>
      <CheckCircleIcon />
      <Text sx={sx.navItemTitle} className={`level-${level}`}>
        {name}
      </Text>
      {!!hasChildren && (
        <ArrowIcon
          title="openNavItemsArrow"
          direction={isOpen ? "up" : "down"}
        />
      )}
    </Flex>
  );
};

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
    ".ds-c-icon--arrow": {
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
    ".ds-c-icon--arrow": {
      position: "absolute",
      top: "10px",
      right: "0.5rem",
      fontSize: "13px",
      color: "palette.gray",
    },
    "&.selected": {
      bg: "palette.custom_gray_lightest",
      borderBottom: "none",
      borderInlineStartWidth: "0.125rem",
      borderInlineStartColor: "palette.alt",
      ".chakra-text": {
        color: "palette.alt_darkest",
      },
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
