import { Link as RouterLink } from "react-router-dom";
// components
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
// utils
import { useBreakpoint } from "utils";
// assets
import hhsLogo from "assets/logos/logo_hhs.png";
import mcrLogo from "assets/logos/logo_mcr_footer.png";
import medicaidLogo from "assets/logos/logo_medicaid.svg";

export const Footer = () => {
  const { isDesktop } = useBreakpoint();
  return (
    <Box sx={sx.root} id="footer" role="contentinfo">
      <Box sx={sx.footerTop}>
        <Container sx={sx.footerTopContainer}>
          <Flex sx={sx.footerTopFlex}>
            <Box sx={sx.footerTopLeftContainer}>
              <Image
                src={mcrLogo}
                alt="Managed Care Reporting logo"
                sx={sx.mcrLogo}
              />
            </Box>
            <Box sx={sx.footerTopRightContainer}>
              <Flex sx={sx.footerTopRightTopFlex}>
                <Box sx={sx.footerCMSBrandingLeft}>
                  <Box sx={sx.hhsLogo}>
                    <Image
                      src={hhsLogo}
                      alt="Department of Health and Human Services, USA"
                    />
                  </Box>

                  {!isDesktop && (
                    <Box sx={sx.hhsMedicaidLogoMobile}>
                      <Image
                        src={medicaidLogo}
                        alt="Medicaid.gov: Keeping America Healthy"
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={sx.footerCMSBrandingRight}>
                  <Text sx={sx.hhsCopyText}>
                    A federal government website managed and paid for by the
                    U.S. Centers for Medicare and Medicaid Services and part of
                    the MDCT suite.
                  </Text>
                </Box>
              </Flex>
              {isDesktop && (
                <Flex sx={sx.footerCMSMedicaid}>
                  <Box sx={sx.medicaidLogo}>
                    <Image
                      src={medicaidLogo}
                      alt="Medicaid.gov: Keeping America Healthy"
                    />
                  </Box>
                </Flex>
              )}
            </Box>
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
    "@media print": {
      display: "none",
    },
  },
  footerTop: {
    bg: "palette.gray_lightest",
    minHeight: "7rem",
    padding: "2rem 0",
  },
  footerTopContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  footerTopFlex: {
    flexWrap: "wrap",
  },
  footerTopLeftContainer: {
    flex: "0 0 50%",
    maxWidth: "100%",
    minWidth: "100%",
    marginBottom: "1em",
    ".desktop &": {
      marginBottom: 0,
      maxWidth: "50%",
      minWidth: "auto",
    },
  },
  footerTopRightContainer: {
    flex: "0 0 50%",
    maxWidth: "100%",
    minWidth: "100%",
    ".desktop &": {
      minWidth: "auto",
    },
  },
  footerTopRightTopFlex: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    ".desktop &": {
      justifyContent: "flex-end",
      flexDirection: "row",
    },
  },
  footerCMSBrandingLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    padding: "0 1rem",
    minWidth: "100%",
    marginBottom: "1rem",
    ".desktop &": {
      marginBottom: 0,
      display: "block",
      width: "auto",
      maxWidth: "auto",
      minWidth: "auto",
    },
  },
  footerCMSBrandingRight: {
    flex: "0 0 75%",
    maxWidth: "25rem",
  },

  mcrLogo: {
    maxHeight: "4.875rem",
    margin: "0 auto",
    ".desktop &": {
      margin: 0,
    },
  },
  hhsLogo: {
    display: "inline-block",
    width: "4.375rem",
  },
  hhsMedicaidLogoMobile: {
    maxWidth: "12.5rem",
    marginLeft: "1.25rem",
  },
  hhsCopyText: {
    display: "inline-block",
    textAlign: "left",
    verticalAlign: "top",
    fontSize: "sm",
    lineHeight: "21px",
    marginTop: 0,
  },
  footerCMSMedicaid: {
    justifyContent: "flex-end",
  },
  medicaidLogo: {
    flex: "0 0 75%",
    maxWidth: "75%",
    marginTop: ".25rem",
    ".desktop &": {
      maxWidth: "25rem",
    },
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
    alignItems: "normal",
    flexDirection: "column",
    ".desktop &": {
      alignItems: "initial",
      flexDirection: "row",
    },
  },
  footerBottomLinkFlex: {
    flexDirection: "column",
    ".desktop &": {
      flexDirection: "row",
    },
    "a:first-of-type > p": {
      marginLeft: 0,
    },
  },
  link: {
    margin: "0.5rem 0",
    ".desktop &": {
      "&:first-child": {
        paddingRight: ".5rem",
        borderRight: "1px solid",
        borderColor: "palette.white",
      },
      "&:last-child": {
        paddingLeft: ".5rem",
      },
    },
  },
  address: {
    color: "palette.white",
    fontWeight: "bold",
    alignSelf: "center",
    margin: "2.25rem 0 0",
    ".desktop &": {
      margin: 0,
    },
  },
};
