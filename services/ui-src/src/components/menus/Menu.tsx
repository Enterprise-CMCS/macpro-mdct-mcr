import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Image,
  Link,
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { MenuOption } from "components";
// utils
import { useBreakpoint, UserContext } from "utils";
// assets
import accountCircleIcon from "assets/icons/icon_account_circle.png";
import chevronDownIcon from "assets/icons/icon_arrow_down.png";
import editIcon from "assets/icons/icon_edit_square.png";
import logoutIcon from "assets/icons/icon_arrow_right_square.png";

export const Menu = () => {
  const { logout } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  return (
    <MenuRoot offset={[8, 20]}>
      <Box role="group">
        <MenuButton
          as={Button}
          rightIcon={
            <Image src={chevronDownIcon} alt="Arrow down" sx={sx.menuIcon} />
          }
          sx={sx.menuButton}
          aria-label="my account"
        >
          <MenuOption
            icon={accountCircleIcon}
            altText="Account"
            text="My Account"
            hideText={isMobile}
          />
        </MenuButton>
      </Box>
      <MenuList sx={sx.menuList} data-testid="header-menu-options-list">
        <Link as={RouterLink} to="/profile" variant="unstyled">
          <MenuItem
            sx={sx.menuItem}
            data-testid="header-menu-option-manage-account"
          >
            <MenuOption
              icon={editIcon}
              altText="Manage account"
              text="Manage Account"
            />
          </MenuItem>
        </Link>
        <MenuItem
          onClick={logout}
          sx={sx.menuItem}
          tabIndex={0}
          data-testid="header-menu-option-log-out"
        >
          <MenuOption icon={logoutIcon} text="Log Out" altText="Logout" />
        </MenuItem>
      </MenuList>
    </MenuRoot>
  );
};

const sx = {
  menuButton: {
    padding: 0,
    paddingRight: "spacer1",
    marginLeft: "spacer1",
    borderRadius: 0,
    background: "none",
    color: "white",
    fontWeight: "bold",
    _hover: { color: "secondary", background: "none !important" },
    _active: { background: "none" },
    _focus: {
      boxShadow: "none",
      outline: "0px solid transparent !important",
    },
    ".mobile &": {
      marginLeft: 0,
    },
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    padding: "0",
    border: "none",
    background: "primary_darkest",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    borderRadius: ".375rem",
    _focus: { background: "primary_darker" },
    _hover: { background: "primary_darker" },
  },
  menuIcon: {
    width: "0.75rem",
  },
};
