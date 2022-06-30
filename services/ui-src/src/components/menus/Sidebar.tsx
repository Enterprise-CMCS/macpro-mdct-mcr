import React, { ReactText } from "react";
import { Box, Flex, Link, Text, FlexProps } from "@chakra-ui/react";
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
  return (
    <Box sx={sx.root}>
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
      {/* <SidebarContent onClose={() => onClose} /> */}
    </Box>
  );
};

const CloseButton = () => {
  return (
    <Flex align="center" paddingY="0.5rem" marginLeft="1.25rem" sx={sx.temp}>
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
        sx={sx.temp2}
      >
        <CheckCircleIcon viewBox="10 10 200 200" />
        {children}
      </Flex>
    </Link>
  );
};

const sx = {
  root: {
    minH: "100vh",
    bg: "palette.gray_lightest",
    maxW: "15rem",
  },
  temp: {
    ".ds-c-icon--arrow-left": {
      marginBottom: "3.5rem",
      marginLeft: "0.25rem",
      borderRadius: "10px 0px 0px 10px",
      backgroundColor: "palette.gray_lightest",
      height: "16px",
      width: "10px",
    },
  },
  temp2: {
    ".ds-c-icon--check-circle": {
      fill: "palette.gray_lighter",
    },
  },
};
