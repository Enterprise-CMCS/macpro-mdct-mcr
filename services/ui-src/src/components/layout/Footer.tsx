// components
import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { RouterLink } from "../index";
// eslint-disable-next-line multiline-comment-style
// utils
// import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
// import hhsLogo from "../../assets/logo_hhs.png";
// import medicaidLogo from "../../assets/logo_medicaid.png";

export const Footer = () => {
  // const { isMobile } = useBreakpoint();
  return (
    <Box sx={sx.root} data-testid="footer-container">
      <Box sx={sx.footerTop}>
        <Flex>
          <Container sx={{ maxW: "7xl" }}></Container>
        </Flex>
      </Box>
      <Box sx={sx.footerBottom}>
        <Container sx={{ maxW: "7xl" }}>
          <Flex justify="space-between" align="center" sx={{ height: "3rem" }}>
            <Text>
              <RouterLink
                to="/faq"
                alt="link to help page"
                styleOverride={sx.link}
              >
                Contact Us
              </RouterLink>
              |
              <Link
                href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
                target="_blank"
                sx={sx.link}
              >
                Accessibility Statement
              </Link>
            </Text>
            <Text sx={sx.address}>
              7500 Security Boulevard Baltimore, MD 21244
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

const sx = {
  root: {
    border: "1px solid red",
    minHeight: 100,
  },
  footerTop: {
    bg: "palette.gray_lightest",
    height: "7rem",
  },
  footerBottom: {
    bg: "palette.main_darkest",
    color: "palette.white",
    fontSize: 14,
  },
  address: {
    fontWeight: "bold",
  },
  link: {
    margin: "0.5rem",
    "&:visited": {
      color: "palette.white",
    },
    "&:hover": {
      color: "palette.gray_light",
    },
  },
};
