import { Link as RouterLink } from "react-router-dom";
// components
import { Box, Button, Container, Flex, Spacer } from "@chakra-ui/react";
import { UsaBanner } from "@cmsgov/design-system";
import { Logo } from "components";
// assets
import { FaQuestionCircle } from "react-icons/fa";

interface Props {
  handleLogout: () => void;
}

export function Header({ handleLogout }: Props) {
  return (
    <Box data-testid="header" zIndex={3}>
      <UsaBanner />
      <Box bg="palette.main">
        <Container maxW="7xl">
          <Flex py="4" alignItems="center">
            <RouterLink to="/">
              <Logo />
            </RouterLink>
            <Spacer flex={6} />
            <Button variant="link" color="palette.white" onClick={handleLogout}>
              Logout
            </Button>
            <RouterLink to="/faq">
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
}
