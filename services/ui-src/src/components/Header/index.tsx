import { UsaBanner } from "@cmsgov/design-system";
import { Logo } from "components";
import { Link } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import * as CUI from "@chakra-ui/react";

interface Props {
  handleLogout: () => void;
}

export function Header({ handleLogout }: Props) {
  return (
    <CUI.Box data-testid="header" zIndex={3}>
      <UsaBanner />
      {/* using hex color here for branded color */}
      <CUI.Box bg="#0071bc">
        <CUI.Container maxW="7xl">
          <CUI.Flex py="4" alignItems="center">
            <Link to="/">
              <Logo />
            </Link>
            <CUI.Spacer flex={6} />
            <CUI.Button onClick={handleLogout} variant="link" color="white">
              Logout
            </CUI.Button>
            <Link to="/faq">
              <FaQuestionCircle
                color="white"
                style={{ fontSize: "1.4rem", margin: ".5rem" }}
              />
            </Link>
          </CUI.Flex>
        </CUI.Container>
      </CUI.Box>
    </CUI.Box>
  );
}
