import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image, Link } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { TextField } from "./TextField";

export const DynamicField = ({ name, label }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const form = useFormContext();
  form.register(name);

  const { fields, append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  if (fields.length === 0) append("");

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
              />
              {index != 0 && (
                <Button onClick={() => remove(index)} variant="unstyled">
                  <Image
                    sx={sx.removeButton}
                    src={cancelIcon}
                    alt="Remove item"
                  />
                </Button>
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
  removeButton: {
    boxSize: "1.25rem",
    marginBottom: "1rem",
    marginLeft: "0.625rem",
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
};
