// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
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
      spreadsheet_green: "#1D6F42",
    },
    colorSchemes: {
      primary: {
        100: "#ffffff",
        200: "#e6f9fd",
        300: "#b3ecf8",
        400: "#0071bc",
        500: "#0071bc",
        600: "#004f84",
        700: "#004f84",
        800: "#00395e",
        900: "#00395e",
      },
      primary_outline: {
        100: "#ffffff",
        200: "#e6f9fd",
        300: "#b3ecf8",
        400: "#0071bc",
        500: "#0071bc",
        600: "#0071bc",
        700: "#004f84",
        800: "#00395e",
        900: "#00395e",
      },
      secondary: {
        100: "#e6f9fd",
        200: "#b3ecf8",
        300: "#4ed2ee",
        400: "#02bfe7",
        500: "#02bfe7",
        600: "#0186a2",
        700: "#0186a2",
        800: "#016074",
        900: "#016074",
      },
      secondary_outline: {
        100: "#e6f9fd",
        200: "#b3ecf8",
        300: "#4ed2ee",
        400: "#02bfe7",
        500: "#02bfe7",
        600: "#02bfe7",
        700: "#0186a2",
        800: "#016074",
        900: "#016074",
      },
      success: {
        100: "#e7f3e7",
        200: "#89c487",
        300: "#2a9526",
        400: "#12890e",
        500: "#107b0d",
        600: "#0d600a",
        700: "#0d600a",
        800: "#094507",
        900: "#094507",
      },
      warn: {
        100: "#fef9e9",
        200: "#fce28f",
        300: "#f9ca35",
        400: "#f8c41f",
        500: "#dfb01c",
        600: "#ae8916",
        700: "#ae8916",
        800: "#7c6210",
        900: "#7c6210",
      },
      error: {
        100: "#fce8ec",
        200: "#f7bbc5",
        300: "#f18e9e",
        400: "#e31c3d",
        500: "#cc1937",
        600: "#9f142b",
        700: "#9f142b",
        800: "#720e1f",
        900: "#720e1f",
      },
      neutral: {
        100: "#ffffff",
        200: "#f2f2f2",
        300: "#d9d9d9",
        400: "#a6a6a6",
        500: "#5a5a5a",
        600: "#404040",
        700: "#404040",
        800: "#262626",
        900: "#000000",
      },
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
        width: "fit-content",
        transition: "all 0.3s ease",
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
