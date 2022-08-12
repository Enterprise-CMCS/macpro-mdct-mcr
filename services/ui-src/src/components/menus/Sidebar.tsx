import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// components
import { ArrowIcon } from "@cmsgov/design-system";
import { Box, Collapse, Flex, Heading, Link, Text } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses, useBreakpoint } from "utils";
// data
import mcparRouteStructure from "forms/mcpar/reportStructure";
import { isMcparReportPage } from "forms/mcpar";

interface LinkItemProps {
  name: string;
  path: string;
  children?: LinkItemProps[] | null;
}

export const Sidebar = () => {
  const mqClasses = makeMediaQueryClasses();
  const { isDesktop } = useBreakpoint();
  const [isOpen, toggleSidebar] = useState(isDesktop);
  const { pathname } = useLocation();

  return (
    <>
      {isMcparReportPage(pathname) && (
        <Box
          id="sidebar"
          sx={sx.root}
          className={`${mqClasses} ${isOpen ? "open" : "closed"}`}
          role="navigation"
          aria-label="Sidebar menu"
          data-testid="sidebar-nav"
        >
          <Box
            as="button"
            sx={sx.closeButton}
            onClick={() => toggleSidebar(!isOpen)}
            aria-label="Open/Close sidebar menu"
          >
            <ArrowIcon
              title="closeNavBarButton"
              direction={isOpen ? "left" : "right"}
            />
          </Box>
          <Box id="sidebar-title-box" sx={sx.topBox}>
            <Heading sx={sx.title} className={mqClasses}>
              MCPAR Report Submission Form
            </Heading>
          </Box>
          <Box
            sx={sx.navSectionsBox}
            className={`${mqClasses} nav-sections-box`}
          >
            {mcparRouteStructure.map((section) => (
              <NavSection key={section.name} section={section} level={1} />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

interface NavSectionProps {
  key: string;
  section: LinkItemProps;
  level: number;
}

const NavSection = ({ section, level }: NavSectionProps) => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname.includes(section.path)) {
      setIsOpen(true);
    }
  }, [pathname]);

  const { name, path, children } = section;
  return (
    <React.Fragment key={path}>
      {children ? (
        <Box
          as="button"
          onClick={() => setIsOpen(!isOpen)}
          sx={sx.navLinkWithChildren}
        >
          <NavItem
            name={name}
            level={level}
            optionPath={path}
            hasChildren={true}
            isOpen={isOpen}
          />
        </Box>
      ) : (
        <Link
          as={RouterLink}
          to={path}
          variant="unstyled"
          sx={sx.navLinkSansChildren}
        >
          <NavItem
            name={name}
            level={level}
            optionPath={path}
            hasChildren={false}
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
            />
          ))}
        </Collapse>
      )}
    </React.Fragment>
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
  const mqClasses = makeMediaQueryClasses();
  const currentPath = window.location.pathname;
  const isCurrentPath = optionPath === currentPath;
  return (
    <Flex sx={sx.navItemFlex} className={isCurrentPath ? "selected" : ""}>
      <Text sx={sx.navItemTitle} className={`level-${level} ${mqClasses}`}>
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
    width: "20rem",
    position: "relative",
    bg: "palette.gray_lightest",
    transition: "all 0.3s ease",
    "&.open": {
      marginLeft: "-1rem",
      "&.desktop": {
        marginLeft: "-2rem",
      },
    },
    "&.closed": {
      marginLeft: "-21rem",
      "&.desktop": {
        marginLeft: "-22rem",
      },
    },
    "&.tablet, &.mobile": {
      position: "fixed",
      zIndex: "dropdown",
      height: "100%",
    },
  },
  topBox: {
    borderBottom: "1px solid var(--chakra-colors-palette-gray_lighter)",
  },
  title: {
    fontSize: "xl",
    fontWeight: "bold",
    width: "15rem",
    padding: "1rem 1rem",
    "&.desktop": {
      padding: "1rem 0 1rem 2rem",
    },
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
  navSectionsBox: {
    "&.tablet, &.mobile": {
      height: "100%",
      paddingBottom: "16rem",
      overflowY: "scroll",
      overflowX: "hidden",
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
    ".ds-c-icon--arrow": {
      position: "absolute",
      top: "10px",
      right: "0.5rem",
      fontSize: "13px",
      color: "palette.gray",
    },
    "&.selected": {
      position: "relative",
      zIndex: 1,
      bg: "palette.gray_lightest_highlight",
      borderBottom: "1px solid transparent",
      borderInlineStartWidth: "0.125rem",
      borderInlineStartColor: "palette.secondary",
      ".chakra-text": {
        color: "palette.secondary_darker",
      },
    },
  },
  navLinkWithChildren: {
    _focus: {
      position: "relative",
      zIndex: 3,
    },
  },
  navLinkSansChildren: {
    display: "flex",
    _focus: {
      position: "relative",
      zIndex: 3,
    },
  },
  navItemTitle: {
    marginRight: "2.5rem",
    fontSize: "14px",
    marginY: "10px",
    textAlign: "left",
    "&.level-1": {
      marginLeft: "1rem",
      "&.desktop": {
        marginLeft: "2rem",
      },
    },
    "&.level-2": {
      marginLeft: "2rem",
      "&.desktop": {
        marginLeft: "3rem",
      },
    },
    "&.level-3": {
      marginLeft: "3rem",
      "&.desktop": {
        marginLeft: "4rem",
      },
    },
  },
};
