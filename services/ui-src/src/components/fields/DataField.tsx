// components
import { DateField as CmsdsDateField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";
import { StyleObject } from "utils/types/types";

export const DateField = ({ label, sxOverrides, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <Box sx={{ ...sx, ...sxOverrides }} className={mqClasses}>
      <CmsdsDateField label={label} {...props} />
    </Box>
  );
};

interface Props {
  label: string;
  sxOverrides?: StyleObject;
  [key: string]: any;
}

const sx = {};
