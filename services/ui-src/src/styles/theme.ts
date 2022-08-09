// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

const svgFilters = {
  primary_darker:
    "brightness(0) saturate(100%) invert(19%) sepia(43%) saturate(3547%) hue-rotate(185deg) brightness(97%) contrast(101%)",
};

const theme = extendTheme({
  sizes: {
    appMax: "100vw",
    basicPageWidth: "46rem",
    reportPageWidth: "40rem",
    // font sizes: https://design.cms.gov/utilities/font-size/
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.3125rem", // 21px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  breakpoints: {
    // read this: https://bit.ly/3xSWnDt
    base: "0em", // mobile (<=35em|560px)
    sm: "35em", // tablet (>35em|560px and <=55em|880px)
    md: "55em", // desktop, small (>55em|880px and <=75em|1200px)
    lg: "75em", // desktop, large (>75em|1200px and <=100em|1600px)
    xl: "100em", // desktop, ultrawide (>100em|1600px)
  },
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  lineHeights: {
    // https://design.cms.gov/utilities/line-height/
    normal: "normal",
    reset: 1,
    heading: 1.3,
    base: 1.5,
    lead: 1.7,
  },
  colors: {
    palette: {
      // primary
      primary: "#0071bc",
      primary_darker: "#004f84",
      primary_darkest: "#00395e",
      // secondary
      secondary_lightest: "#e6f9fd",
      secondary_lighter: "#b3ecf8",
      secondary_light: "#4ed2ee",
      secondary: "#02bfe7",
      secondary_dark: "#02acd0",
      secondary_darker: "#0186a2",
      secondary_darkest: "#016074",
      // status: success
      success_lightest: "#e7f3e7",
      success_lighter: "#89c487",
      success_light: "#2a9526",
      success: "#12890e",
      success_dark: "#107b0d",
      success_darker: "#0d600a",
      success_darkest: "#094507",
      // status: warn
      warn_lightest: "#fef9e9",
      warn_lighter: "#fce28f",
      warn_light: "#f9ca35",
      warn: "#f8c41f",
      warn_dark: "#dfb01c",
      warn_darker: "#ae8916",
      warn_darkest: "#7c6210",
      // status: error
      error_lightest: "#fce8ec",
      error_lighter: "#f7bbc5",
      error_light: "#f18e9e",
      error: "#e31c3d",
      error_dark: "#cc1937",
      error_darker: "#9f142b",
      error_darkest: "#720e1f",
      // neutrals
      white: "#ffffff",
      gray_lightest: "#f2f2f2",
      gray_lighter: "#d9d9d9",
      gray_light: "#a6a6a6",
      gray: "#5a5a5a",
      gray_dark: "#404040",
      base: "#262626",
      black: "#000000",
      // other
      focus_light: "#ffffff",
      focus_dark: "#bd13b8",
      muted: "#e9ecf1",
      // custom
      gray_lightest_highlight: "#f8f8f8",
      spreadsheet_green: "#1d6f42",
    },
  },
  components: {
    Accordion: {
      baseStyle: {
        borderStyle: "none",
      },
    },
    Button: {
      baseStyle: {
        transition: "all 0.3s ease",
        width: "fit-content",
        borderRadius: "0.25rem",
        fontWeight: "bold",
        "&.mobile": {
          fontSize: "sm",
        },
      },
      variants: {
        primary: {
          backgroundColor: "palette.primary",
          color: "palette.white",
          _hover: {
            backgroundColor: "palette.primary_darker",
          },
        },
        transparent: {
          color: "palette.primary",
          backgroundColor: "transparent",
          _hover: {
            color: "palette.primary_darker",
            backgroundColor: "transparent",
          },
        },
        outline: () => ({
          ...theme.components.Button.variants.transparent,
          border: "1px solid",
          borderColor: "palette.primary",
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "palette.primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        }),
        link: () => ({
          ...theme.components.Button.variants.transparent,
          textDecoration: "underline",
        }),
        danger: {
          backgroundColor: "palette.error_dark",
          color: "palette.white",
          _hover: {
            backgroundColor: "palette.error_darker",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Heading: {
      baseStyle: {
        color: "palette.base",
      },
    },
    Link: {
      baseStyle: {
        transition: "all 0.3s ease",
      },
      variants: {
        default: {
          color: "palette.primary",
          transition: "all 0.3s ease",
          _visited: {
            color: "palette.primary",
          },
          ":hover, :visited:hover": {
            color: "palette.primary_darker",
          },
        },
        inline: {
          color: "palette.primary_darker",
          paddingBottom: "2px",
          borderBottom: "2px solid",
          _visited: {
            color: "palette.primary_darker",
          },
          ":hover, :visited:hover": {
            color: "palette.primary",
          },
        },
        inverse: {
          color: "palette.white",
          _visited: {
            color: "palette.white",
          },
          ":hover, :visited:hover": {
            color: "palette.gray_light",
          },
        },
        button: {},
      },
      defaultProps: {
        variant: "default",
      },
    },
    Text: {
      baseStyle: {
        color: "palette.base",
        transition: "all 0.3s ease",
      },
    },
  },
});

export default theme;
