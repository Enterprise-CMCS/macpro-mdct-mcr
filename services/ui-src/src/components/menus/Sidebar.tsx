import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// components
import {
  Box,
  Collapse,
  Flex,
  Image,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { SkipNav } from "components";
// utils
import { useBreakpoint, useStore } from "utils";
// assets
import arrowDownIcon from "assets/icons/icon_arrow_down_gray.png";
import arrowUpIcon from "assets/icons/icon_arrow_up_gray.png";

interface LinkItemProps {
  name: string;
  path: string;
  children?: LinkItemProps[] | null;
}

interface SidebarProps {
  isHidden: boolean;
}

export const Sidebar = ({ isHidden }: SidebarProps) => {
  const { isDesktop } = useBreakpoint();
  const [isOpen, toggleSidebar] = useState(isDesktop);
  const { report } = useStore();
  const reportJson = report?.formTemplate;

  return (
    <>
      {reportJson && (
        <>
          <SkipNav
            id="skip-nav-sidebar"
            href="#report-content"
            text="Skip to main content"
            sxOverride={sx.sideBarSkipNav}
          />
          <Box
            id="sidebar"
            sx={sx.root}
            display={isHidden ? "none" : "block"}
            className={isOpen ? "open" : "closed"}
            role="navigation"
            aria-label="Sidebar menu"
          >
            <Box
              as="button"
              sx={sx.closeButton}
              onClick={() => toggleSidebar(!isOpen)}
              aria-label="Open/Close sidebar menu"
            >
              <Image
                src={arrowDownIcon}
                alt={isOpen ? "Arrow left" : "Arrow right"}
                sx={sx.sidebarIcon}
                className={isOpen ? "left" : "right"}
              />
            </Box>
            <Box id="sidebar-title-box" sx={sx.topBox}>
              <Heading sx={sx.title}>{reportJson.name}</Heading>
            </Box>
            <Box sx={sx.navSectionsBox} className="nav-sections-box">
              {reportJson.routes.map((section) => (
                <NavSection key={section.name} section={section} level={1} />
              ))}
            </Box>
          </Box>
        </>
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
  const currentPath = window.location.pathname;
  const isCurrentPath = optionPath === currentPath;
  return (
    <Flex sx={sx.navItemFlex} className={isCurrentPath ? "selected" : ""}>
      <Text sx={sx.navItemTitle} className={`level-${level}`}>
        {name}
      </Text>
      {!!hasChildren && (
        <Image
          src={isOpen ? arrowUpIcon : arrowDownIcon}
          alt={isOpen ? "Collapse subitems" : "Expand subitems"}
          sx={sx.navItemArrow}
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
      ".desktop &": {
        marginLeft: "-2rem",
      },
    },
    "&.closed": {
      marginLeft: "-21rem",
      ".desktop &": {
        marginLeft: "-22rem",
      },
    },
    ".tablet &, .mobile &": {
      position: "fixed",
      zIndex: "dropdown",
      height: "100%",
    },
  },
  sideBarSkipNav: {
    position: "fixed",
  },
  topBox: {
    borderBottom: "1px solid var(--chakra-colors-palette-gray_lighter)",
  },
  title: {
    fontSize: "xl",
    fontWeight: "bold",
    width: "15rem",
    padding: "1rem 1rem",
    ".desktop &": {
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
    ".tablet &, .mobile &": {
      height: "100%",
      paddingBottom: "16rem",
      overflowY: "scroll",
      overflowX: "hidden",
    },
  },
  navItemFlex: {
    flexDirection: "row",
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
        color: "palette.secondary_darkest",
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
      ".desktop &": {
        marginLeft: "2rem",
      },
    },
    "&.level-2": {
      marginLeft: "2rem",
      ".desktop &": {
        marginLeft: "3rem",
      },
    },
    "&.level-3": {
      marginLeft: "3rem",
      ".desktop &": {
        marginLeft: "4rem",
      },
    },
  },
  navItemArrow: {
    width: "1rem",
    height: "1rem",
    margin: "0.75rem 0.75rem 0 auto",
  },
  sidebarIcon: {
    width: "1rem",
    "&.left": {
      transform: "rotate(90deg)",
    },
    "&.right": {
      transform: "rotate(270deg)",
    },
  },
};
