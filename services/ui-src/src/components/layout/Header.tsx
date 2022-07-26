import { Link as RouterLink, useLocation } from "react-router-dom";
// components
import { UsaBanner } from "@cmsgov/design-system";
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { Menu, MenuOption } from "components";
// utils
import { makeMediaQueryClasses, useBreakpoint } from "utils";
// assets
import appLogo from "assets/logos/logo_mcr_draft.png";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();
  const { pathname } = useLocation();
  const isMcparReportPage = pathname.includes("/mcpar/");
  // TODO: Get current program name
  const currentProgramName = "Current Program Name";

  return (
    <Box sx={sx.root} id="header">
      <Flex sx={sx.usaBannerContainer} className={mqClasses}>
        <UsaBanner />
      </Flex>
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer} className={mqClasses}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/">
              <Image src={appLogo} alt="MCR logo" sx={sx.appLogo} />
            </Link>
            <Flex sx={sx.menuFlex}>
              <Link
                as={RouterLink}
                to="/help"
                aria-label="Get Help"
                data-testid="header-help-button"
              >
                <MenuOption
                  icon="questionCircleFill"
                  text="Get Help"
                  role="group"
                  hideText={isMobile}
                />
              </Link>
              <Menu handleLogout={handleLogout} />
            </Flex>
          </Flex>
        </Container>
      </Flex>
      {isMcparReportPage && (
        <Flex sx={sx.subnavBar}>
          <Container sx={sx.subnavContainer} className={mqClasses}>
            <Flex sx={sx.subnavFlex}>
              <Flex>
                <Text sx={sx.programNameText}>
                  Program: {currentProgramName}
                </Text>
              </Flex>
              <Flex sx={sx.subnavFlexRight}>
                {!isMobile && (
                  <Link
                    as={RouterLink}
                    to="/mcpar"
                    sx={sx.leaveFormLink}
                    tabIndex={-1}
                  >
                    <Button
                      sx={sx.subnavButton}
                      variant="outline"
                      data-testid="leave-form-button"
                    >
                      Leave form
                    </Button>
                  </Link>
                )}
              </Flex>
            </Flex>
          </Container>
        </Flex>
      )}
    </Box>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: "sticky",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  usaBannerContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "palette.gray_lightest",
    "&.desktop": {
      padding: "0 1.25rem",
    },
  },
  headerBar: {
    minHeight: "4rem",
    alignItems: "center",
    bg: "palette.main_darkest",
  },
  headerContainer: {
    maxW: "appMax",
    "&.desktop": {
      padding: "0 2.25rem",
    },
  },
  headerFlex: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuFlex: {
    alignItems: "center",
  },
  appLogo: {
    maxWidth: "200px",
  },
  subnavBar: {
    bg: "palette.alt_lightest",
  },
  subnavContainer: {
    maxW: "appMax",
    "&.desktop": {
      padding: "0 2.25rem",
    },
  },
  subnavFlex: {
    height: "60px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  programNameText: {
    fontWeight: "bold",
  },
  subnavFlexRight: {
    alignItems: "center",
    paddingRight: ".5rem",
  },
  leaveFormLink: {
    marginLeft: "2rem",
  },
  subnavButton: {
    color: "palette.main",
    border: "1px solid",
    borderColor: "palette.main",
    borderRadius: "0.25rem",
    "&:hover": {
      bg: "palette.main",
      color: "white",
    },
  },
};
