// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },

  breakpoints: {
    // read this: https://bit.ly/3xSWnDt
    base: "0em", // mobile (<=35em|560px)
    sm: "35em", // tablet (>35em|560px and <=55em|880px)
    md: "55em", // desktop, small (>55em|880px and <=75em|1200px)
    lg: "75em", // desktop, large (>75em|1200px and <=100em|1600px)
    xl: "100em", // desktop, ultrawide (>100em|1600px)
  },
  colors: {
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
    },
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
      // neutrals
      white: "#ffffff",
      gray_lightest: "#f1f1f1",
      gray_lighter: "#d6d7d9",
      gray_light: "#aeb0b5",
      gray: "#5b616b",
      gray_dark: "#323a45",
      gray_darkest: "#212121",
      black: "#000000",
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
      // other
      focus_light: "#ffffff",
      focus_dark: "#bd13b8",
      muted: "#bac5cf",
    },
  },
  components: {
    Button: {
      baseStyle: {
        transition: "all 0.3s ease",
      },
    },
    Text: {
      baseStyle: {
        transition: "all 0.3s ease",
      },
    },
    Link: {
      baseStyle: {
        transition: "all 0.3s ease",
      },
    },
  },
});
