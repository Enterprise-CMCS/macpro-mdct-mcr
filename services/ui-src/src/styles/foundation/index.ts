import { breakpoints } from "./breakpoints";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { sizes } from "./sizes";
import { space } from "./space";
import { typography } from "./typography";

export const foundation = {
  breakpoints: breakpoints,
  colors: colors,
  fonts: fonts,
  sizes: sizes,
  space: space,
  ...typography,
};
