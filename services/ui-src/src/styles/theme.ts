// Chakra UI theme info: https://v1.chakra-ui.com/docs/styled-system/theming/theme
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
  config: {
    cssVarPrefix: "mdct",
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
        ".mobile &": {
          fontSize: "sm",
        },
      },
      variants: {
        // primary variants
        primary: {
          backgroundColor: "primary",
          color: "white",
          "&:hover": {
            backgroundColor: "primary_darker",
          },
          "&:disabled, &:disabled:hover": {
            color: "gray",
            backgroundColor: "gray_lighter",
            opacity: 1,
          },
        },
        transparent: {
          color: "primary",
          backgroundColor: "transparent",
          _hover: {
            color: "primary_darker",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        outline: () => ({
          ...theme.components.Button.variants.transparent,
          border: "1px solid",
          borderColor: "primary",
          textDecoration: "none",
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
          _visited: {
            color: "primary",
          },
          ":hover, :visited:hover": {
            color: "primary_darker",
            backgroundColor: "gray_lightest",
          },
          ":disabled": {
            color: "gray_lighter",
            borderColor: "gray_lighter",
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
          backgroundColor: "white",
          color: "primary",
          _hover: {
            color: "primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        inverse_transparent: {
          color: "white",
          backgroundColor: "transparent",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            color: "gray_lighter",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.gray_lighter,
            },
          },
        },
        inverse_outline: () => ({
          ...theme.components.Button.variants.inverse_transparent,
          border: "1px solid",
          borderColor: "white",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "gray_lighter",
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
          backgroundColor: "error_dark",
          color: "white",
          _hover: {
            backgroundColor: "error_darker",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Heading: {
      baseStyle: {
        color: "base",
      },
    },
    Link: {
      baseStyle: {
        textDecoration: "underline",
        transition: "all 0.3s ease",
      },
      variants: {
        primary: {
          color: "primary",
          _visited: {
            color: "primary",
            textDecorationColor: "primary",
          },
          ":hover, :visited:hover": {
            color: "primary_darker",
            textDecorationColor: "primary_darker",
          },
        },
        inverse: {
          color: "white",
          _visited: {
            color: "white",
            textDecorationColor: "white",
          },
          ":hover, :visited:hover": {
            color: "gray_lighter",
            textDecorationColor: "gray_lighter",
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
        color: "base",
        transition: "all 0.3s ease",
      },
    },
  },
});

export default theme;
