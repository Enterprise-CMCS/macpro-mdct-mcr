// components
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";

export const ChoiceListField = ({
  name,
  type,
  label,
  choices,
  onChangeHandler,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Box sx={sxOverride} className={mqClasses}>
      <CmsdsChoiceList
        name={name}
        type={type}
        label={label}
        choices={choices}
        onChange={(e) => onChangeHandler(e)}
        {...props}
      />
    </Box>
  );
};

export interface ChoiceListSelected {
  value: string;
  id: string;
}

export interface ChoiceListChoices {
  label: string;
  value: string;
}

interface Props {
  name: string;
  type: "checkbox" | "radio";
  label: string;
  choices: ChoiceListChoices[];
  onChangeHandler: Function;
  sxOverride?: AnyObject;
  [key: string]: any;
}
