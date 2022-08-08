import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { TextField } from "./TextField";

export const DynamicField = ({ name, label, ...props }: Props) => {
  const form = useFormContext();
  form.register(name);

  const { fields, append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append(props?.hydrate || "");
    }
  });

  return (
    <Box>
      {fields.map((field: Record<"id", string>, index: number) => {
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
              hydrate={props?.hydrate?.[index]}
              sxOverride={sx.textFieldOverride}
            />
            {index != 0 && (
              <Box sx={sx.removeBox}>
                <button
                  onClick={() => remove(index)}
                  data-testid="removeButton"
                >
                  <Image
                    sx={sx.removeImage}
                    src={cancelIcon}
                    alt="Remove item"
                  />
                </button>
              </Box>
            )}
          </Flex>
        );
      })}
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
  [key: string]: any;
}

const sx = {
  removeBox: {
    marginBottom: "0.625rem",
    marginLeft: "0.625rem",
  },
  removeImage: {
    width: "1.25rem",
    height: "1.25rem",
  },
  appendButton: {
    minWidth: "202px",
    minHeight: "42px",
    marginTop: "2rem",
    border: "1px solid var(--chakra-colors-palette-main)",
    borderRadius: "3px",
    bg: "palette.white",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "palette.primary",
  },
  textFieldOverride: {
    width: "32rem",
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
};
