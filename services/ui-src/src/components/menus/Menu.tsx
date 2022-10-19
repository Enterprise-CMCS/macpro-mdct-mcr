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
import { useBreakpoint } from "utils";
// assets
import accountCircleIcon from "assets/icons/icon_account_circle.png";
import chevronDownIcon from "assets/icons/icon_arrow_down.png";
import editIcon from "assets/icons/icon_edit_square.png";
import logoutIcon from "assets/icons/icon_arrow_right_square.png";

export const Menu = ({ handleLogout }: Props) => {
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
          data-testid="header-menu-dropdown-button"
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
          onClick={handleLogout}
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

interface Props {
  handleLogout: () => void;
}

const sx = {
  menuButton: {
    padding: 0,
    paddingRight: ".5rem",
    marginLeft: ".5rem",
    borderRadius: 0,
    background: "none",
    color: "palette.white",
    fontWeight: "bold",
    _hover: { color: "palette.secondary_light", background: "none !important" },
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
    background: "palette.primary_darkest",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    borderRadius: ".375rem",
    _focus: { background: "palette.primary_darker" },
    _hover: { background: "palette.primary_darker" },
  },
  menuIcon: {
    width: "0.75rem",
  },
};
