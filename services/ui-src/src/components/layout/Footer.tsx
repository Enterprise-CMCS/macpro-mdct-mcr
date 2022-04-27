// components
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { RouterLink } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import hhsLogo from "../../assets/logo_hhs.svg";
import medicaidLogo from "../../assets/logo_medicaid.svg";

export const Footer = () => {
  const { isMobile, isDesktop } = useBreakpoint();

  return (
    <Box sx={sx.root} data-testid="footer-container">
      <Box sx={sx.footerTop}>
        <Container sx={sx.footerTopContainer}>
          <Flex sx={sx.footerTopFlex} className={isMobile ? "mobile" : ""}>
            <Flex
              sx={sx.footerTopLogoFlex}
              className={isMobile ? "mobile" : ""}
            >
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
              <Text sx={sx.footerText} className={isMobile ? "mobile" : ""}>
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
          <Flex sx={sx.footerBottomFlex} className={isMobile ? "mobile" : ""}>
            <Flex
              sx={sx.footerBottomLinkFlex}
              className={!isDesktop ? "mobiletablet" : ""}
            >
              <RouterLink to="/faq" alt="link to help page">
                <Text sx={sx.link} className={!isDesktop ? "mobiletablet" : ""}>
                  Contact Us
                </Text>
              </RouterLink>
              {isDesktop && <Text sx={sx.divider}>|</Text>}
              <Link
                href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
                target="_blank"
              >
                <Text sx={sx.link} className={!isDesktop ? "mobiletablet" : ""}>
                  Accessibility Statement
                </Text>
              </Link>
            </Flex>
            <Text sx={sx.address} className={!isDesktop ? "mobiletablet" : ""}>
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
    bg: "palette.main_darkest",
    color: "palette.white",
    fontSize: 14,
  },
  footerBottomContainer: {
    maxW: "7xl",
  },
  footerBottomFlex: {
    paddingY: "1rem",
    justifyContent: "space-between",
    alignItems: "center",
    "&.mobile": {
      alignItems: "normal",
      flexDirection: "column",
    },
  },
  footerBottomLinkFlex: {
    "&.mobiletablet": {
      flexDirection: "column",
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
    "&.mobiletablet": {
      margin: "0.25rem 0",
    },
  },
  divider: {
    margin: "0.5rem",
    cursor: "default",
  },
  address: {
    fontWeight: "bold",
    "&.mobiletablet": {
      margin: "0.25rem 0",
    },
  },
};
