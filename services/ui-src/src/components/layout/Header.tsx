import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useTheme,
} from "@chakra-ui/react";
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
// assets
import {
  BsBoxArrowRight,
  BsChevronDown,
  BsFillPersonFill,
  BsQuestionCircleFill,
} from "react-icons/bs";
import appLogo from "../../assets/logo_qmr.png";

interface Props {
  handleLogout: () => void;
}

export const Header = ({ handleLogout }: Props) => {
  const theme = useTheme();
  return (
    <Box data-testid="header" zIndex={3}>
      <UsaBanner />
      <Box bg="palette.main_darker">
        <Container maxW="7xl">
          <Flex py="4" alignItems="center">
            <RouterLink to="/" style={{ textDecoration: "none" }}>
              <img
                src={appLogo}
                alt="QMR Logo"
                style={{ maxWidth: "100px" }}
                data-testid="app-logo"
              />
            </RouterLink>
            <Spacer flex={6} />
            <RouterLink
              to="/faq"
              title="link to help page"
              style={{ textDecoration: "none" }}
            >
              <Flex align="center">
                <BsQuestionCircleFill
                  color={theme.colors.palette.white}
                  style={{ fontSize: "1.4rem", margin: ".5rem" }}
                />
                <Text color="palette.white" fontWeight="bold">
                  Get Help
                </Text>
              </Flex>
            </RouterLink>
            <Menu>
              <MenuButton
                bg="palette.main_darker"
                color="palette.white"
                fontWeight="bold"
                as={Button}
                rightIcon={<BsChevronDown />}
                _hover={{ bg: "red" }}
                borderRadius="0px"
                p="0px"
              >
                <Flex align="center">
                  <BsFillPersonFill
                    color={theme.colors.palette.white}
                    style={{ fontSize: "1.4rem", margin: ".5rem" }}
                  />
                  <Text color="palette.white" fontWeight="bold">
                    User
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList bg="palette.main_darker">
                <MenuItem _focus={{ bg: "red" }}>
                  <RouterLink
                    to="/faq"
                    title="link to help page"
                    style={{ textDecoration: "none" }}
                  >
                    <Flex align="center">
                      <BsQuestionCircleFill
                        color={theme.colors.palette.white}
                        style={{ fontSize: "1.4rem", margin: ".5rem" }}
                      />
                      <Text color="palette.white" fontWeight="bold">
                        Get Help
                      </Text>
                    </Flex>
                  </RouterLink>
                </MenuItem>
                <MenuItem _focus={{ bg: "red" }}>
                  <RouterLink
                    to="/acct"
                    title="link to account page"
                    style={{ textDecoration: "none" }}
                  >
                    <Flex align="center">
                      <BsFillPersonFill
                        color={theme.colors.palette.white}
                        style={{ fontSize: "1.4rem", margin: ".5rem" }}
                      />
                      <Text color="palette.white" fontWeight="bold">
                        Manage Account
                      </Text>
                    </Flex>
                  </RouterLink>
                </MenuItem>
                <MenuItem _focus={{ bg: "red" }} onClick={handleLogout}>
                  <Flex align="center">
                    <BsBoxArrowRight
                      color={theme.colors.palette.white}
                      style={{ fontSize: "1.4rem", margin: ".5rem" }}
                    />
                    <Text color="palette.white" fontWeight="bold">
                      Log Out
                    </Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
