import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  components: {
    Form: {
      baseStyle: {
        helperText: {
          fontSize: "md",
          color: "black.700",
          lineHeight: "base",
        },
      },
    },
    FormError: {
      baseStyle: {
        text: {
          color: "red.700",
          fontSize: "md",
        },
      },
    },
  },
});
