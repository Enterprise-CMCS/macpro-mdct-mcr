// components
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { MenuOption, RouterLink } from "../index";
// assets
import { BsChevronDown } from "react-icons/bs";

export default ({ handleLogout }: Props) => (
  <Menu offset={[8, 38]}>
    <MenuButton
      as={Button}
      role="group"
      rightIcon={<BsChevronDown />}
      sx={sx.menuButton}
    >
      <MenuOption icon="personFill" text="User" />
    </MenuButton>
    <MenuList sx={sx.menuList}>
      <MenuItem sx={sx.menuItem}>
        <RouterLink to="/acct" alt="link to account page">
          <MenuOption icon="personFill" text="Manage Account" />
        </RouterLink>
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={sx.menuItem}>
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
    height: "1.5rem",
    padding: 0,
    marginLeft: ".75rem",
    borderRadius: 0,
    background: "none",
    color: "palette.white",
    fontWeight: "bold",
    _hover: { color: "palette.alt_light" },
    _active: { background: "none" },
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
