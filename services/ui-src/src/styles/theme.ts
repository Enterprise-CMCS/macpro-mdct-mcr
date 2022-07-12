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
      main: "#0071bc",
      main_darker: "#205493",
      main_darkest: "#112e51",
      alt_lightest: "#e1f3f8",
      alt_light: "#9bdaf1",
      alt: "#02bfe7",
      alt_dark: "#00a6d2",
      alt_darkest: "#046b99",
      // status: success
      success_lightest: "#e7f4e4",
      success_lighter: "#94bfa2",
      success_light: "#4aa564",
      success: "#2e8540",
      success_dark: "#2a7a3b",
      success_darker: "#266e35",
      success_darkest: "#174320",
      // status: warn
      warn_lightest: "#fff1d2",
      warn_lighter: "#fad980",
      warn_light: "#f9c642",
      warn: "#fdb81e",
      warn_dark: "#e4a61b",
      warn_darker: "#ca9318",
      warn_darkest: "#b18115",
      // status: error
      error_lightest: "#f9dede",
      error_lighter: "#f5adb9",
      error_light: "#e59393",
      error: "#e31c3d",
      error_dark: "#cd2026",
      error_darker: "#b31e22",
      error_darkest: "#981b1e",
      // neutrals
      white: "#ffffff",
      custom_gray_lightest: "#f8f8f8",
      gray_lightest: "#f1f1f1",
      gray_lighter: "#d6d7d9",
      gray_light: "#aeb0b5",
      gray: "#5b616b",
      gray_dark: "#323a45",
      gray_darkest: "#212121",
      black: "#000000",
      // other
      focus_light: "#ffffff",
      focus_dark: "#bd13b8",
      muted: "#bac5cf",
    },
    colorSchemes: {
      main: {
        100: "#ffffff",
        200: "#e1f3f8",
        300: "#9bdaf1",
        400: "#0071bc",
        500: "#0071bc",
        600: "#205493",
        700: "#205493",
        800: "#112e51",
        900: "#112e51",
      },
      outline: {
        100: "#ffffff",
        200: "#e1f3f8",
        300: "#9bdaf1",
        400: "#0071bc",
        500: "#0071bc",
        600: "#0071bc",
        700: "#205493",
        800: "#112e51",
        900: "#112e51",
      },
      success: {
        100: "#e7f4e4",
        200: "#94bfa2",
        300: "#4aa564",
        400: "#2e8540",
        500: "#2a7a3b",
        600: "#266e35",
        700: "#266e35",
        800: "#174320",
        900: "#174320",
      },
      warn: {
        100: "#fff1d2",
        200: "#fad980",
        300: "#f9c642",
        400: "#fdb81e",
        500: "#e4a61b",
        600: "#ca9318",
        700: "#ca9318",
        800: "#b18115",
        900: "#b18115",
      },
      error: {
        100: "#f9dede",
        200: "#f5adb9",
        300: "#e59393",
        400: "#e31c3d",
        500: "#cd2026",
        600: "#b31e22",
        700: "#b31e22",
        800: "#981b1e",
        900: "#981b1e",
      },
      neutral: {
        100: "#ffffff",
        200: "#f1f1f1",
        300: "#d6d7d9",
        400: "#aeb0b5",
        500: "#5b616b",
        600: "#323a45",
        700: "#323a45",
        800: "#212121",
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
        color: "palette.gray_darkest",
      },
    },
    Link: {
      baseStyle: {
        transition: "all 0.3s ease",
      },
      variants: {
        default: {
          color: "palette.main",
          transition: "all 0.3s ease",
          _visited: {
            color: "palette.main",
          },
          ":hover, :visited:hover": {
            color: "palette.main_darker",
          },
        },
        inline: {
          color: "palette.main_darker",
          paddingBottom: "2px",
          borderBottom: "2px solid",
          _visited: {
            color: "palette.main_darker",
          },
          ":hover, :visited:hover": {
            color: "palette.main",
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
        color: "palette.gray_darkest",
        transition: "all 0.3s ease",
      },
    },
  },
});
