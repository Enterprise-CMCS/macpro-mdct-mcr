import { Link as RouterLink } from "react-router-dom";
// components
import {
  Box,
  Button,
  Link,
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Icon, MenuOption } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";

export const Menu = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();
  return (
    <MenuRoot offset={[8, 20]}>
      <Box role="group">
        <MenuButton
          as={Button}
          rightIcon={<Icon icon="chevronDown" color="palette.white" />}
          sx={sx.menuButton}
          className={mqClasses}
          aria-label="manage my account"
          data-testid="header-menu-dropdown-button"
        >
          <MenuOption
            icon="personCircle"
            text="My Account"
            hideText={isMobile}
          />
        </MenuButton>
      </Box>
      <MenuList sx={sx.menuList} data-testid="header-menu-options-list">
        <MenuItem
          sx={sx.menuItem}
          data-testid="header-menu-option-manage-account"
        >
          <Link as={RouterLink} to="/profile">
            <MenuOption icon="pencilSquare" text="Manage Account" />
          </Link>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={sx.menuItem}
          tabIndex={0}
          data-testid="header-menu-option-log-out"
        >
          <MenuOption icon="arrowRightSquare" text="Log Out" />
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
    _hover: { color: "palette.alt_light" },
    _active: { background: "none" },
    _focus: {
      boxShadow: "none",
      outline: "0px solid transparent !important",
    },
    "&.mobile": {
      marginLeft: 0,
    },
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    padding: "0",
    border: "none",
    background: "palette.main_darkest",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    borderRadius: ".375rem",
    _focus: { background: "palette.main_darker" },
  },
};
