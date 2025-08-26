import { ComponentStyleConfig } from "@chakra-ui/react";
import { svgFilters } from "styles/theme";

const baseStyle = {
  transition: "all 0.3s ease",
  borderRadius: "0.25rem",
  px: "1.5em",
  py: "0.5em",
  fontWeight: "bold",
  width: "fit-content",
  "&:disabled, &:disabled:hover": {
    color: "gray",
    backgroundColor: "gray_lighter",
    opacity: 1,
  },
  ".mobile &": {
    fontSize: "sm",
  },
};

const solidVariant = {
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
};

const solidInverseVariant = {
  backgroundColor: "white",
  color: "primary",
  "&:disabled, &:disabled:hover": {
    color: "base",
    backgroundColor: "gray_darker",
    opacity: 1,
  },
};

const outlineVariant = {
  backgroundColor: "transparent",
  border: (theme: any) => `1px solid ${theme.colors.primary}`,
  color: "primary",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "gray_lightest",
    color: "primary_darker",
    span: {
      filter: svgFilters.primary_darker,
    },
  },
  "&:disabled, &:disabled:hover": {
    color: "gray_lighter",
    borderColor: "gray_lighter",
    opacity: 1,
  },
};

const outlineInverseVariant = {
  backgroundColor: "transparent",
  border: (theme: any) => `1px solid ${theme.colors.white}`,
  color: "white",
  textDecoration: "none",
  "&:disabled, &:disabled:hover": {
    color: "gray_dark",
    borderColor: "gray_dark",
    backgroundColor: "transparent",
    opacity: 1,
  },
};

const ghostVariant = {
  backgroundColor: "transparent",
  color: "primary",
  textDecoration: "underline",
  padding: 0,
  "&:hover": {
    color: "primary_darker",
    span: {
      filter: svgFilters.primary_darker,
    },
  },
  "&:visited, &:visited:hover": {
    color: "primary",
  },
  "&:disabled, &:disabled:hover": {
    color: "gray_light",
  },
};

const ghostInverseVariant = {
  backgroundColor: "transparent",
  color: "white",
  textDecoration: "underline",
  padding: 0,
  "&:disabled, &:disabled:hover": {
    color: "gray_dark",
  },
};

const fixedVariant = {
  width: "5.5rem",
  height: "2.25rem",
};

const variants = {
  solid: solidVariant,
  solidInverse: solidInverseVariant,
  outline: outlineVariant,
  outlineInverse: outlineInverseVariant,
  ghost: ghostVariant,
  ghostInverse: ghostInverseVariant,
  fixed: fixedVariant,
};

const sizes = {
  sm: {
    fontSize: "sm",
    fontWeight: 400,
    px: "0.5em",
    py: "0.25em",
  },
  md: {
    fontSize: "md",
    fontWeight: 700,
    px: "1.5em",
    py: "0.5em",
  },
  lg: {
    fontSize: "lg",
    px: "1.5em",
    py: "1em",
  },
};

const buttonTheme: ComponentStyleConfig = {
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    variant: "primary",
    size: "md",
  },
};

export default buttonTheme;
