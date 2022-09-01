import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { TextField } from "components";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { svgFilters } from "styles/theme";

export const DynamicField = ({ name, label, ...props }: Props) => {
  // get form context and register field
  const form = useFormContext();
  form.register(name);

  // make formfield dynamic array with config options
  const { fields, append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  // render form field values as individual inputs
  useEffect(() => {
    if (fields.length === 0) {
      append(props?.hydrate || "");
    }
  }, []);

  const fieldErrorState = form?.formState?.errors?.[name];

  return (
    <Box>
      {fields.map((field: Record<"id", string>, index: number) => {
        return (
          <Flex key={field.id} alignItems="flex-end">
            <TextField
              name={`${name}[${index}]`}
              label={label}
              errorMessage={fieldErrorState?.[index]?.message}
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
        variant="outline"
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
    _hover: {
      filter: svgFilters.primary_darker,
    },
  },
  appendButton: {
    width: "12.5rem",
    height: "2.5rem",
    marginTop: "2rem",
  },
  textFieldOverride: {
    width: "32rem",
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
};
