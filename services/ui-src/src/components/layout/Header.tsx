import { Link as RouterLink } from "react-router-dom";
// components
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
import { Menu, MenuOption } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import appLogo from "../../assets/images/logo_mcr_draft.png";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  return (
    <Box sx={sx.root}>
      <UsaBanner />
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/">
              <Image src={appLogo} alt="MCR logo" sx={sx.appLogo} />
            </Link>
            <Flex sx={sx.menuFlex}>
              <Link as={RouterLink} to="/help" data-testid="header-help-button">
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
  },
  headerBar: {
    height: "4rem",
    alignItems: "center",
    bg: "palette.main_darkest",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  headerContainer: {
    maxW: "appMax",
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
};
