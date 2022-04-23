// components
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { MenuOption, RouterLink } from "../index";
// assets
import { BsChevronDown } from "react-icons/bs";

export default ({ handleLogout }: Props) => (
  <Menu offset={[8, 32]}>
    <Box role="group">
      <MenuButton as={Button} rightIcon={<BsChevronDown />} sx={sx.menuButton}>
        <MenuOption icon="personFill" text="User" />
      </MenuButton>
    </Box>
    <MenuList sx={sx.menuList}>
      <MenuItem sx={sx.menuItem}>
        <RouterLink to="/acct" alt="link to account page" tabindex={0}>
          <MenuOption icon="personFill" text="Manage Account" />
        </RouterLink>
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={sx.menuItem} tabIndex={0}>
        <MenuOption icon="boxArrowRight" text="Log Out" />
      </MenuItem>
    </MenuList>
  </Menu>
);

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
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    padding: "0",
    border: "none",
    background: "palette.main_darkest",
  },
  menuItem: {
    borderRadius: ".375rem",
    _focus: { background: "palette.main_darker" },
  },
};
