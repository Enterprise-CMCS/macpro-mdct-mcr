// components
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
import { Box, Container, Flex, Image } from "@chakra-ui/react";
import { Menu, MenuOption, RouterLink } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import appLogo from "../../assets/logo_qmr.png";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  return (
    <Box sx={sx.root} data-testid="header-banner-container">
      <UsaBanner tabindex={0} />
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <RouterLink to="/" alt="link to home page" tabindex={0}>
              <Image
                src={appLogo}
                alt="MCR logo"
                sx={sx.appLogo}
                data-testid="app-logo"
              />
            </RouterLink>
            <Flex sx={sx.menuFlex}>
              <RouterLink to="/faq" alt="link to help page" tabindex={0}>
                <MenuOption
                  icon="questionCircleFill"
                  text="Get Help"
                  role="group"
                  hideText={isMobile}
                  dataTestId="faq-button"
                />
              </RouterLink>
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
    maxW: "7xl",
  },
  headerFlex: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuFlex: {
    alignItems: "center",
  },
  appLogo: {
    maxWidth: "100px",
    padding: ".25rem",
  },
};
