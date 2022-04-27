// components
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { RouterLink } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";
// assets
import hhsLogo from "../../assets/logo_hhs.svg";
import medicaidLogo from "../../assets/logo_medicaid.svg";

export const Footer = () => {
  const { isMobile, isDesktop } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();
  return (
    <Box sx={sx.root} data-testid="footer-container">
      <Box sx={sx.footerTop}>
        <Container sx={sx.footerTopContainer}>
          <Flex sx={sx.footerTopFlex} className={mqClasses}>
            <Flex sx={sx.footerTopLogoFlex} className={mqClasses}>
              {isMobile && (
                <Image
                  src={hhsLogo}
                  alt="HHS logo"
                  sx={sx.hhsLogo}
                  data-testid="hhs-logo"
                />
              )}
              <Image
                src={medicaidLogo}
                alt="Medicaid logo"
                sx={sx.medicaidLogo}
                data-testid="medicaid-logo"
              />
            </Flex>
            <Flex sx={sx.footerTopTextFlex}>
              {!isMobile && (
                <Image
                  src={hhsLogo}
                  alt="HHS logo"
                  sx={sx.hhsLogo}
                  data-testid="hhs-logo"
                />
              )}
              <Text sx={sx.footerText} className={mqClasses}>
                A federal government website managed and paid for by the U.S.
                Centers for Medicare and Medicaid Services and part of the
                MACPro suite.
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box sx={sx.footerBottom}>
        <Container sx={sx.footerBottomContainer}>
          <Flex sx={sx.footerBottomFlex} className={mqClasses}>
            <Flex sx={sx.footerBottomLinkFlex} className={mqClasses}>
              <RouterLink to="/faq" alt="link to help page">
                <Text sx={sx.link} className={mqClasses}>
                  Contact Us
                </Text>
              </RouterLink>
              {isDesktop && <Text sx={sx.divider}>|</Text>}
              <Link
                href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
                target="_blank"
              >
                <Text sx={sx.link} className={mqClasses}>
                  Accessibility Statement
                </Text>
              </Link>
            </Flex>
            <Text sx={sx.address} className={mqClasses}>
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
    flexShrink: "0",
  },
  footerTop: {
    bg: "palette.gray_lightest",
    minHeight: "7rem",
  },
  footerTopContainer: {
    maxW: "7xl",
  },
  footerTopFlex: {
    minH: "7rem",
    justifyContent: "space-between",
    alignItems: "center",
    paddingY: "1rem",
    "&.mobile": {
      flexDirection: "column",
    },
  },
  footerTopLogoFlex: {
    paddingRight: "1rem",
    "&.mobile": {
      marginTop: "2rem",
      minWidth: "200px",
    },
  },
  footerTopTextFlex: {
    alignItems: "center",
  },
  medicaidLogo: {
    minWidth: "150px",
  },
  hhsLogo: {
    marginRight: "1.25rem",
  },
  footerText: {
    maxW: "24rem",
    fontSize: "14px",
    "&.mobile": {
      marginY: "1rem",
    },
  },
  footerBottom: {
    minHeight: "3rem",
    bg: "palette.main_darkest",
    color: "palette.white",
    fontSize: 14,
  },
  footerBottomContainer: {
    maxW: "7xl",
  },
  footerBottomFlex: {
    paddingY: ".5rem",
    justifyContent: "space-between",
    alignItems: "center",
    "&.mobile": {
      alignItems: "normal",
      flexDirection: "column",
    },
  },
  footerBottomLinkFlex: {
    "&.mobile, &.tablet": {
      flexDirection: "column",
    },
    "a:first-of-type > p": {
      marginLeft: 0,
    },
  },
  link: {
    margin: "0.5rem",
    _visited: {
      color: "palette.white",
    },
    _hover: {
      color: "palette.gray_light",
    },
    "&.mobile, &.tablet": {
      margin: "0.25rem 0",
    },
  },
  divider: {
    margin: "0.5rem",
    cursor: "default",
  },
  address: {
    fontWeight: "bold",
    "&.mobile, &.tablet": {
      margin: "0.25rem 0",
    },
  },
};
