import { Link as RouterLink } from "react-router-dom";
// components
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
// utils
import { useBreakpoint } from "utils";
// assets
import hhsLogo from "assets/logos/logo_hhs.svg";
import mcrLogo from "assets/logos/logo_mcr_footer.png";
import medicaidLogo from "assets/logos/logo_medicaid.svg";

export const Footer = () => {
  const { isMobile } = useBreakpoint();
  return (
    <Box sx={sx.root} id="footer" role="contentinfo">
      <Box sx={sx.footerTop}>
        <Container sx={sx.footerTopContainer}>
          <Flex sx={sx.footerTopFlex}>
            <Flex sx={sx.footerTopLogoFlex}>
              <Image
                src={mcrLogo}
                alt="Managed Care Reporting logo"
                sx={sx.mcrLogo}
              />
            </Flex>
            <Flex sx={sx.footerRightLogosFlex}>
              {!isMobile && (
                <Image src={hhsLogo} alt="HHS logo" sx={sx.hhsLogo} />
              )}
              <Flex sx={sx.footerRightLogosTextFlex}>
                {isMobile && (
                  <Flex sx={sx.hhsMedicaidLogoMobile}>
                    <Image src={hhsLogo} alt="HHS logo" sx={sx.hhsLogo} />
                    <Image
                      src={medicaidLogo}
                      alt="Medicaid logo"
                      sx={sx.medicaidLogo}
                    />
                  </Flex>
                )}
                <Text sx={sx.footerText}>
                  A federal government website managed and paid for by the U.S.
                  Centers for Medicare and Medicaid Services and part of the
                  MDCT suite.
                </Text>
                {!isMobile && (
                  <Image
                    src={medicaidLogo}
                    alt="Medicaid logo"
                    sx={sx.medicaidLogo}
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box sx={sx.footerBottom}>
        <Container sx={sx.footerBottomContainer}>
          <Flex sx={sx.footerBottomFlex}>
            <Flex sx={sx.footerBottomLinkFlex}>
              <Link as={RouterLink} to="/help" variant="inverse" sx={sx.link}>
                Contact Us
              </Link>
              {!isMobile && <Text sx={sx.divider}>|</Text>}
              <Link
                href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
                target="_blank"
                variant="inverse"
                sx={sx.link}
              >
                Accessibility Statement
              </Link>
            </Flex>
            <Flex>
              <Text sx={sx.address}>
                7500 Security Boulevard Baltimore, MD 21244
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

const sx = {
  root: {
    flexShrink: "0",
    ".desktop &": {
      position: "sticky",
      zIndex: "sticky",
    },
  },
  footerTop: {
    bg: "palette.gray_lightest",
    minHeight: "7rem",
  },
  footerTopContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  footerTopFlex: {
    minH: "12.5rem",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingY: "2rem",
    ".mobile &": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  footerTopLogoFlex: {
    paddingRight: "1rem",
    ".mobile &": {
      minWidth: "200px",
      paddingRight: 0,
      justifyContent: "center",
    },
  },
  footerRightLogosFlex: {
    alignItems: "flex-start",
  },
  footerRightLogosTextFlex: {
    flexDirection: "column",
    gap: "1.375rem",
    ".mobile &": {
      gap: "0",
    },
  },
  mcrLogo: {
    maxWidth: "12.125rem",
    ".mobile &": {
      maxWidth: "10.125rem",
    },
  },
  medicaidLogo: {
    maxWidth: "12.875rem",
    ".mobile &": {
      maxWidth: "9.375rem",
    },
  },
  hhsLogo: {
    marginRight: "1.5rem",
    marginTop: "-0.5rem",
    ".mobile &": {
      maxHeight: "4.25rem",
      marginRight: "0.75rem",
    },
  },
  hhsMedicaidLogoMobile: {
    marginY: "1.75rem",
    justifyContent: "center",
  },
  footerText: {
    maxW: "20rem",
    fontSize: "0.875rem",
    ".mobile &": {
      maxW: "100%",
      marginX: "1rem",
    },
  },
  footerBottom: {
    minHeight: "3rem",
    bg: "palette.primary_darkest",
    fontSize: 14,
  },
  footerBottomContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  footerBottomFlex: {
    paddingY: "1rem",
    justifyContent: "space-between",
    ".mobile &": {
      alignItems: "normal",
      flexDirection: "column",
    },
  },
  footerBottomLinkFlex: {
    ".mobile &": {
      flexDirection: "column",
    },
    "a:first-of-type > p": {
      marginLeft: 0,
    },
  },
  link: {
    margin: "0.5rem 0",
    ".mobile &": {
      margin: "0.25rem 0",
    },
  },
  divider: {
    color: "palette.white",
    margin: "0.5rem",
    cursor: "default",
  },
  address: {
    color: "palette.white",
    fontWeight: "bold",
    alignSelf: "center",
    ".mobile &": {
      margin: "2.25rem 0 0",
    },
  },
};
