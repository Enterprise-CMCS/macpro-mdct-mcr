// components
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
import { Box, Container, Flex, Image } from "@chakra-ui/react";
import { Menu, MenuOption, RouterLink } from "../index";
// assets
import appLogo from "../../assets/logo_qmr.png";

export const Header = ({ handleLogout }: Props) => {
  return (
    <Box zIndex="sticky" data-testid="header-banner-container">
      <UsaBanner tabindex={0} />
      <Box sx={sx.headerBar}>
        <Container sx={sx.headerContainer}>
          <Flex align="center" justify="space-between" paddingY="4">
            <RouterLink to="/" alt="link to home page" tabindex={0}>
              <Image
                src={appLogo}
                alt="MCR logo"
                sx={sx.appLogo}
                data-testid="app-logo"
              />
            </RouterLink>
            <Flex align="center">
              <RouterLink to="/faq" alt="link to help page" tabindex={0}>
                <MenuOption
                  icon="questionCircleFill"
                  text="Get Help"
                  role="group"
                  hideTextOnMobile
                />
              </RouterLink>
              <Menu handleLogout={handleLogout} />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  headerBar: {
    bg: "palette.main_darkest",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  headerContainer: {
    maxW: "7xl",
  },
  appLogo: {
    maxWidth: "100px",
    padding: ".25rem",
  },
};
