import React, { ReactText } from "react";
import {
  Box,
  Flex,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  FlexProps,
} from "@chakra-ui/react";
import { ArrowIcon, CheckCircleIcon } from "@cmsgov/design-system";

interface LinkItemProps {
  name: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Get Started" },
  { name: "A: Program Information" },
  { name: "B: State-Level Indicators" },
  { name: "C: Program-Level Indicators" },
  { name: "D: Plan-Level Indicators" },
  { name: "E: BSS Entity Indicators" },
  { name: "Review & Submit" },
];

// from https://chakra-templates.dev/navigation/sidebar
export const Sidebar = () => {
  const { isOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent onClose={() => onClose} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const SidebarContent = ({ ...rest }) => {
  return (
    <Box bg="palette.gray_lightest" maxW="15rem" {...rest}>
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        borderBottom="1px solid gray"
      >
        <Text fontSize="xl" fontWeight="bold" minW="11.5rem">
          MCPAR Report Submission Form
        </Text>
        <CloseButton />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} itemName={link.name}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const CloseButton = () => {
  return (
    <Flex align="center" paddingY="0.5rem" marginLeft="1.25rem">
      <ArrowIcon title="title" direction="left" />
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  itemName: string;
  children: ReactText;
}
const NavItem = ({ itemName, children, ...rest }: NavItemProps) => {
  const linkPath = window.location + "/" + itemName;
  return (
    <Link href={linkPath} textColor="palette.gray_darkest">
      <Flex
        align="center"
        paddingY="0.5rem"
        marginLeft="1.25rem"
        role="group"
        {...rest}
        borderBottom="1px solid gray"
      >
        <CheckCircleIcon viewBox="10 10 200 200" />
        {children}
      </Flex>
    </Link>
  );
};
