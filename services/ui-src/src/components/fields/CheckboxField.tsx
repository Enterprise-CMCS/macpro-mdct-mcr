// components
import { Box } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { ChoiceFieldProps } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  const mqClasses = makeMediaQueryClasses();
  const singleBoxClass = choices.length === 1 ? "single-box" : "";

  return (
    <Box
      sx={{ ...sx, ...sxOverride }}
      className={`${mqClasses} ${singleBoxClass}`}
    >
      <ChoiceListField
        type="checkbox"
        name={name}
        label={label}
        choices={choices}
        {...props}
      />
    </Box>
  );
};

const sx = {
  "&.single-box": {
    ".ds-c-choice-wrapper": {
      display: "flex",
      alignItems: "center",
      ".ds-c-label": {
        alignSelf: "center",
        marginBottom: "0.5rem",
      },
    },
  },
};
