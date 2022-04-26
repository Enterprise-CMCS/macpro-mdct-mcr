// components
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { RouterLink } from "../index";
// utils
import { useBreakpoint } from "../../utils/useBreakpoint";
// assets
import hhsLogo from "../../assets/logo_hhs.svg";
import medicaidLogo from "../../assets/logo_medicaid.svg";

export const Footer = () => {
  const { isMobile } = useBreakpoint();
  return (
    <Box data-testid="footer-container">
      <Box sx={sx.footerTop}>
        <Container sx={{ maxW: "7xl" }}>
          <Flex
            justify="space-between"
            align="center"
            sx={{
              flexDirection: `${isMobile ? "column" : "row"}`,
              minH: "7rem",
            }}
          >
            <Flex
              sx={sx.medicaidLogoHolder}
              className={isMobile ? "mobile" : ""}
            >
              {isMobile && (
                <Image
                  src={hhsLogo}
                  alt="HHS logo"
                  sx={{ marginRight: "1.25rem" }}
                  data-testid="hhs-logo"
                />
              )}
              <Image
                src={medicaidLogo}
                alt="Medicaid logo"
                data-testid="medicaid-logo"
              />
            </Flex>
            <Flex>
              {!isMobile && (
                <Image
                  src={hhsLogo}
                  alt="HHS logo"
                  sx={{ marginRight: "1.25rem" }}
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
        <Container sx={{ maxW: "7xl" }}>
          <Flex justify="space-between" align="center" sx={{ minH: "3rem" }}>
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
  footerTop: {
    bg: "palette.gray_lightest",
  },
  medicaidLogoHolder: {
    "&.mobile": {
      marginTop: "2rem",
    },
  },
  footerText: {
    maxW: "24rem",
    "&.mobile": {
      marginY: "1rem",
    },
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
