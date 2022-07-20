import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// components
import { ArrowIcon } from "@cmsgov/design-system";
import { Box, Collapse, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { SidebarOpenContext } from "components";
// utils
import { useBreakpoint, useScrollPosition } from "utils";
// data
import mcparRouteStructure from "forms/mcpar/reportStructure";

interface LinkItemProps {
  name: string;
  path: string;
  children?: LinkItemProps[] | null;
}

export const Sidebar = () => {
  const { isDesktop } = useBreakpoint();
  const { pathname } = useLocation();
  const isMcparReport = pathname.includes("/mcpar");

  const { sidebarIsOpen, setSidebarIsOpen } = useContext(SidebarOpenContext);
  const [navHeight, setNavHeight] = useState<number>(0);

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const headerBottom = document
      .getElementById("header")
      ?.getBoundingClientRect()?.bottom!;
    const footerTop = document.getElementById("footer")?.getBoundingClientRect()
      ?.top!;
    const titleBoxHeight = document
      .getElementById("sidebar-title-box")
      ?.getBoundingClientRect()?.height!;
    const newNavHeight = footerTop! - headerBottom! - titleBoxHeight || 0;
    setNavHeight(newNavHeight);
  }, [pathname, scrollPosition]);

  return (
    <>
      {isMcparReport && (
        <Box
          id="sidebar"
          sx={sx.root}
          className={sidebarIsOpen ? "open" : "closed"}
          role="navigation"
          aria-label="Sidebar menu"
          data-testid="sidebar-nav"
        >
          <Box
            as="button"
            sx={sx.closeButton}
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            aria-label="Open/Close sidebar menu"
          >
            <ArrowIcon
              title="closeNavBarButton"
              direction={sidebarIsOpen ? "left" : "right"}
            />
          </Box>
          <Box id="sidebar-title-box" sx={sx.topBox}>
            <Heading sx={sx.title}>MCPAR Report Submission Form</Heading>
          </Box>
          <Box
            sx={{
              ...sx.navSectionsBox,
              height: isDesktop ? navHeight : "auto",
            }}
            className="nav-sections-box"
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
  const [isOpen, setIsOpen] = useState(false);
  const { name, path, children } = section;
  return (
    <React.Fragment key={path}>
      {children ? (
        <Box as="button" onClick={() => setIsOpen(!isOpen)}>
          <NavItem
            name={name}
            level={level}
            optionPath={path}
            hasChildren={!!children}
            isOpen={isOpen}
          />
        </Box>
      ) : (
        <Link as={RouterLink} to={path}>
          <NavItem
            name={name}
            level={level}
            optionPath={path}
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
  const currentPath = window.location.pathname;
  const isCurrentPath = optionPath === currentPath;
  return (
    <Flex sx={sx.navItemFlex} className={isCurrentPath ? "selected" : ""}>
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
    position: "fixed",
    zIndex: "dropdown",
    height: "100vh",
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
    width: "15rem",
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
  navSectionsBox: {
    overflowY: "scroll",
    height: "500px",
    overflowX: "hidden",
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
      bg: "palette.gray_lightest_highlight",
      borderBottom: "1px solid transparent",
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
      marginLeft: "1.5rem",
    },
    "&.level-2": {
      marginLeft: "2.5rem",
    },
    "&.level-3": {
      marginLeft: "3.5rem",
    },
  },
};
