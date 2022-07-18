import { useFieldArray } from "react-hook-form";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
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

  const components: AnyObject[] = [];
  fields.forEach((item) => {
    components.push({
      type: props?.type,
      ...dynamicProps,
      ...item,
    });
  });

  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  return (
    <Box sx={sx} className={`${mqClasses} ${nestedChildClasses}`}>
      <Box>
        {components.map((field: any, index: any) => {
          return (
            <Flex key={field.id} alignItems="flex-end">
              {formFieldFactory(new Array(field))}
              <Button onClick={() => remove(index)}>
                <Image src={cancelIcon} alt="Remove item" />
              </Button>
            </Flex>
          );
        })}
      </Box>
      <Button
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
};
