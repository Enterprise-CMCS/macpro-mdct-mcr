import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { TextField } from "./TextField";

export const DynamicField = ({ name, label }: Props) => {
  const form = useFormContext();
  form.register(name);

  const { fields, append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (fields.length === 0) append("");
  });

  return (
    <Box sx={sx} className={mqClasses}>
      <Box>
        {fields.map((field: any, index: any) => {
          return (
            <Flex key={field.id} alignItems="flex-end">
              <TextField
                name={`${name}[${index}]`}
                label={label}
                dynamic={{
                  parentName: name,
                  index,
                  inputRef: () => form.register,
                }}
                sxOverride={sx.textFieldOverride}
              />
              {index != 0 && (
                <button onClick={() => remove(index)} className="remove-button">
                  <Image src={cancelIcon} alt="Remove item" />
                </button>
              )}
            </Flex>
          );
        })}
      </Box>
      <Button
        sx={sx.appendButton}
        onClick={() => {
          append("");
        }}
      >
        Add a row
      </Button>
    </Box>
  );
};

interface Props {
  name: string;
  label: string;
}

const sx = {
  ".remove-button": {
    height: "1.75rem",
    width: "1.75rem",
    marginBottom: "0.625rem",
    marginLeft: "0.5rem",
  },
  appendButton: {
    minWidth: "202px",
    minHeight: "42px",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "palette.main",
    bg: "palette.white",
    border: "1px solid var(--chakra-colors-palette-main)",
    borderRadius: "3px",
    marginTop: "2rem",
  },
  textFieldOverride: {
    width: "32rem",
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
};
