import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { svgFilters } from "styles/theme";
// utils
import { EntityShape, InputChangeEvent } from "types";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicField = ({ name, label, ...props }: Props) => {
  // get form context and register field
  const form = useFormContext();
  form.register(name);
  const [displayValues, setDisplayValues] = useState<EntityShape[]>([]);

  // make formfield dynamic array with config options
  const { fields, append, remove } = useFieldArray({
    name: name,
    shouldUnregister: true,
  });

  // update display value and form field data on change
  const onChangeHandler = async (event: InputChangeEvent) => {
    const { id, value } = event.target;
    const currentEntity = displayValues.find((entity) => entity.id === id);
    const currentEntityIndex = displayValues.indexOf(currentEntity!);
    const newDisplayValues = [...displayValues];
    newDisplayValues[currentEntityIndex].name = value;
    setDisplayValues(newDisplayValues);
  };

  // render form field values as individual inputs
  // useEffect(() => {
  //   if (fields.length === 0) {
  //     console.log("hydrate", props?.hydrate);
  //     append(props?.hydrate || "");
  //   }
  // }, []);

  // // render hydrated values on refresh
  // useEffect(() => {
  //   form.reset();
  //   console.log("hydrate", props?.hydrate);
  //   append(props?.hydrate || "");
  // }, [props?.hydrate]);

  // set initial display value to form state field value or hydration value
  const hydrationValue = props?.hydrate;
  useEffect(() => {
    if (hydrationValue) {
      // setDisplayValues(hydrationValue);
      append(hydrationValue);
    }
  }, [hydrationValue]); // only runs on hydrationValue fetch/update

  const fieldErrorState = form?.formState?.errors?.[name];

  const appendRecord = () => {
    const newEntity = { id: Date.now().toString(), name: "" };
    append(newEntity);
    setDisplayValues([...displayValues, newEntity]);
  };

  const removeRecord = (index: number) => {
    remove(index);
    const newDisplayValues = [...displayValues];
    newDisplayValues.splice(index, 1);
    setDisplayValues(newDisplayValues);
  };

  return (
    <Box>
      {fields.map((field: Record<"id", string>, index: number) => {
        return (
          <Flex key={field.id} alignItems="flex-end" sx={sx.textField}>
            <CmsdsTextField
              id={displayValues[index].id}
              name={`${name}[${index}]`}
              label={label || ""}
              // hint={parsedHint}
              errorMessage={fieldErrorState?.[index]?.message}
              disabled={props?.disabled}
              onChange={(e) => onChangeHandler(e)}
              value={displayValues[index]?.name}
              // {...props}
            />
            {index != 0 && (
              <Box sx={sx.removeBox}>
                <button
                  onClick={() => removeRecord(index)}
                  data-testid="removeButton"
                >
                  {!props?.disabled && (
                    <Image
                      sx={sx.removeImage}
                      src={cancelIcon}
                      alt="Remove item"
                    />
                  )}
                </button>
              </Box>
            )}
          </Flex>
        );
      })}
      {!props.disabled && (
        <Button variant="outline" sx={sx.appendButton} onClick={appendRecord}>
          Add a row
        </Button>
      )}
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
  textField: {
    width: "32rem",
    ".ds-u-clearfix": {
      width: "100%",
    },
  },
};
