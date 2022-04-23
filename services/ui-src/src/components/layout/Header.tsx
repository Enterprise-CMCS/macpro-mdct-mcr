import { Link as RouterLink } from "react-router-dom";
// components
import { Box, Button, Container, Flex, Spacer } from "@chakra-ui/react";
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
// assets
import { FaQuestionCircle } from "react-icons/fa";
import appLogo from "../../assets/logo_qmr.png";

interface Props {
  handleLogout: () => void;
}

export const Header = ({ handleLogout }: Props) => (
  <Box data-testid="header" zIndex={3}>
    <UsaBanner />
    <Box bg="palette.main">
      <Container maxW="7xl">
        <Flex py="4" alignItems="center">
          <RouterLink to="/">
            <img
              src={appLogo}
              alt="QMR Logo"
              style={{ maxWidth: "100px" }}
              data-testid="app-logo"
            />
          </RouterLink>
          <Spacer flex={6} />
          <Button variant="link" color="palette.white" onClick={handleLogout}>
            Logout
          </Button>
          <RouterLink to="/faq" title="link to help page">
            <FaQuestionCircle
              color="palette.white"
              style={{ fontSize: "1.4rem", margin: ".5rem" }}
            />
          </RouterLink>
        </Flex>
      </Container>
    </Box>
  </Box>
);
