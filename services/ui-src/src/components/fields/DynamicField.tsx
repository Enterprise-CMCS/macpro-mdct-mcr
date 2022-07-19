import { useFieldArray } from "react-hook-form";
// components
import { Box, Button, Flex, Image, Link } from "@chakra-ui/react";
// utils
import { formFieldFactory, makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicField = ({
  name,
  label,
  placeholder,
  sxOverride,
  nested,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();

  const { fields, append, remove } = useFieldArray({
    name: "dynamicForm",
  });

  const dynamicProps = {
    props: {
      label: label,
      name: name,
      placeholder: placeholder,
      sxOverride: sxOverride,
      ...props,
    },
  };

  // have parent array with schema id (abss-8)
  // change schema.ts to array, not string
  // dynamic field is an array of text fields to add or delete
  // array.min(1).required().test with some custom test

  const components: AnyObject[] = [];
  fields.forEach((item) => {
    components.push({
      type: props?.type,
      ...dynamicProps,
      id: name,
    });
  });

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  if (fields.length === 0) append({});

  return (
    <Box sx={sx} className={`${mqClasses} ${nestedChildClasses}`}>
      <Box>
        {components.map((field: any, index: any) => {
          return (
            <Flex key={field.id} alignItems="flex-end">
              {formFieldFactory(new Array(field))}
              {index != 0 && (
                <Link onClick={() => remove(index)}>
                  <Image
                    sx={sx.removeButton}
                    src={cancelIcon}
                    alt="Remove item"
                  />
                </Link>
              )}
            </Flex>
          );
        })}
      </Box>
      <Button
        sx={sx.appendButton}
        onClick={() => {
          append({});
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
  placeholder?: string;
  nested?: boolean;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  "&.nested": {
    label: {
      marginTop: 0,
    },
  },
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
