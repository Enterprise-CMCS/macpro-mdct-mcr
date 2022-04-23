// components
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
import { Box, Container, Flex, Image } from "@chakra-ui/react";
import { Menu, MenuOption, RouterLink } from "../index";
// assets
import appLogo from "../../assets/logo_qmr.png";

export const Header = ({ handleLogout }: Props) => (
  <Box zIndex="sticky" data-testid="header-banner-container">
    <UsaBanner />
    <Box sx={{ bg: "palette.main_darkest" }}>
      <Container sx={{ maxW: "7xl" }}>
        <Flex align="center" justify="space-between" paddingY="4">
          <RouterLink to="/" alt="link to home page">
            <Image
              src={appLogo}
              alt="MCR logo"
              sx={{ maxWidth: "100px" }}
              data-testid="app-logo"
            />
          </RouterLink>
          <Flex align="center">
            <RouterLink to="/faq" alt="link to help page">
              <MenuOption
                icon="questionCircleFill"
                text="Get Help"
                hasGroupRole
              />
            </RouterLink>
            <Menu handleLogout={handleLogout} />
          </Flex>
        </Flex>
      </Container>
    </Box>
  </Box>
);

interface Props {
  handleLogout: () => void;
}
