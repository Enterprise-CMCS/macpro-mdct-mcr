// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  breakpoints: {
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "64em", // 1024px
    xl: "90em", // 1440px
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
      focus: "#ffde11",
      focus_border: "#8f7c00",
      muted: "#bac5cf",
    },
  },
});
