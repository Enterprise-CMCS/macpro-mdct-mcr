import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
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

export const Header = ({ handleLogout }: Props) => (
  <Box data-testid="header" zIndex="sticky">
    <UsaBanner />
    <Box bg="palette.main_darkest">
      <Container maxW="7xl">
        <Flex py="4" align="center" justify="space-between">
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <img
              src={appLogo}
              alt="QMR Logo"
              style={{ maxWidth: "100px" }}
              data-testid="app-logo"
            />
          </RouterLink>

          <Flex align="center">
            <RouterLink
              to="/faq"
              title="link to help page"
              style={{ textDecoration: "none" }}
            >
              <Flex align="center" role="group">
                <Icon
                  as={BsQuestionCircleFill}
                  color="palette.white"
                  style={{ fontSize: "1.4rem", marginRight: ".5rem" }}
                  _groupHover={{ color: "palette.alt_light" }}
                />
                <Text
                  color="palette.white"
                  fontWeight="bold"
                  _groupHover={{ color: "palette.alt_light" }}
                >
                  Get Help
                </Text>
              </Flex>
            </RouterLink>

            <Menu>
              <MenuButton
                bg="palette.main_darkest"
                color="palette.white"
                fontWeight="bold"
                as={Button}
                rightIcon={<BsChevronDown />}
                _hover={{ color: "palette.alt_light" }}
                _active={{ bg: "palette.main_darkest" }}
                borderRadius="0px"
                p="0px"
                marginLeft=".5rem"
                role="group"
                height="24px"
              >
                <Flex align="center">
                  <Icon
                    as={BsFillPersonFill}
                    color="palette.white"
                    style={{ fontSize: "1.4rem", marginRight: ".25rem" }}
                    _groupHover={{ color: "palette.alt_light" }}
                  />
                  <Text
                    color="palette.white"
                    fontWeight="bold"
                    _groupHover={{ color: "palette.alt_light" }}
                  >
                    User
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList bg="palette.main_darkest" p="0">
                <MenuItem
                  _focus={{ bg: "palette.main_darker" }}
                  borderRadius="4px"
                >
                  <RouterLink
                    to="/acct"
                    title="link to account page"
                    style={{ textDecoration: "none" }}
                  >
                    <Flex align="center">
                      <Icon
                        as={BsFillPersonFill}
                        color="palette.white"
                        style={{ fontSize: "1.4rem", margin: ".5rem" }}
                      />
                      <Text color="palette.white" fontWeight="bold">
                        Manage Account
                      </Text>
                    </Flex>
                  </RouterLink>
                </MenuItem>
                <MenuItem
                  _focus={{ bg: "palette.main_darker" }}
                  borderRadius="4px"
                  onClick={handleLogout}
                >
                  <Flex align="center">
                    <Icon
                      as={BsBoxArrowRight}
                      color="palette.white"
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
        </Flex>
      </Container>
    </Box>
  </Box>
);
