// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

// Foundational style overrides
import { foundation } from "./foundation";

export const svgFilters = {
  primary:
    "brightness(0) saturate(100%) invert(30%) sepia(93%) saturate(1282%) hue-rotate(181deg) brightness(91%) contrast(101%)",
  primary_darker:
    "brightness(0) saturate(100%) invert(19%) sepia(43%) saturate(3547%) hue-rotate(185deg) brightness(97%) contrast(101%)",
  white:
    "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(142deg) brightness(115%) contrast(115%);",
  gray_lighter:
    "brightness(0) saturate(100%) invert(91%) sepia(0%) saturate(89%) hue-rotate(162deg) brightness(97%) contrast(93%);",
};

const theme = extendTheme({
  ...foundation,
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
        ".mobile &": {
          fontSize: "sm",
        },
      },
      variants: {
        // primary variants
        primary: {
          backgroundColor: "palette.primary",
          color: "palette.white",
          "&:hover": {
            backgroundColor: "palette.primary_darker",
          },
          "&:disabled, &:disabled:hover": {
            color: "palette.gray",
            backgroundColor: "palette.gray_lighter",
            opacity: 1,
          },
        },
        transparent: {
          color: "palette.primary",
          backgroundColor: "transparent",
          _hover: {
            color: "palette.primary_darker",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        outline: () => ({
          ...theme.components.Button.variants.transparent,
          border: "1px solid",
          borderColor: "palette.primary",
          textDecoration: "none",
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "palette.primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
          _visited: {
            color: "palette.primary",
          },
          ":hover, :visited:hover": {
            color: "palette.primary_darker",
          },
          _focus: {
            textDecoration: "none",
          },
        }),
        link: () => ({
          ...theme.components.Button.variants.transparent,
          textDecoration: "underline",
        }),
        // inverse variants
        inverse: {
          backgroundColor: "palette.white",
          color: "palette.primary",
          _hover: {
            color: "palette.primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        inverse_transparent: {
          color: "palette.white",
          backgroundColor: "transparent",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            color: "palette.gray_lighter",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.gray_lighter,
            },
          },
        },
        inverse_outline: () => ({
          ...theme.components.Button.variants.inverse_transparent,
          border: "1px solid",
          borderColor: "palette.white",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "palette.gray_lighter",
            span: {
              filter: svgFilters.gray_lighter,
            },
          },
        }),
        inverse_link: () => ({
          ...theme.components.Button.variants.inverse_transparent,
          textDecoration: "underline",
        }),
        // other
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
        textDecoration: "underline",
        transition: "all 0.3s ease",
      },
      variants: {
        primary: {
          color: "palette.primary",
          _visited: {
            color: "palette.primary",
            textDecorationColor: "palette.primary",
          },
          ":hover, :visited:hover": {
            color: "palette.primary_darker",
            textDecorationColor: "palette.primary_darker",
          },
        },
        inverse: {
          color: "palette.white",
          _visited: {
            color: "palette.white",
            textDecorationColor: "palette.white",
          },
          ":hover, :visited:hover": {
            color: "palette.gray_lighter",
            textDecorationColor: "palette.gray_lighter",
          },
        },
        unstyled: {
          textDecoration: "none",
          ":focus, :focus-visible, :hover, :visited, :visited:hover": {
            textDecoration: "none",
          },
        },
      },
      defaultProps: {
        variant: "primary",
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
