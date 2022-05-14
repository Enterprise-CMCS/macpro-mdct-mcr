// components
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "../../utils/useBreakpoint";

export const TextField = ({ label, placeholder, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Box sx={sx.root} className={mqClasses}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input {...props} isRequired placeholder={placeholder} />
      </FormControl>
    </Box>
  );
};

interface Props {
  label: string;
  placeholder?: string;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
  },
};
