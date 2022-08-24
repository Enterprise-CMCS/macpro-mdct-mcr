// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { BasicPage, DropdownField, Form } from "components";
// types
import { FormJson, States } from "types";
// utils
import verbiage from "verbiage/pages/home";
// form data
import { reportSchema } from "forms/mcpar/reportSchema";

export const ReadOnly = ({ form, onSubmit }: Props) => {
  const dropdownOptions = Object.keys(States).map((value) => {
    return {
      value,
      label: States[value as keyof typeof States],
    };
  });
  const { readOnly } = verbiage;
  const labelStyle = "margin-top: 0";
  return (
    <>
      <BasicPage data-testid="read-only-view">
        <Box>
          <Heading as="h1" sx={sx.headerText}>
            {readOnly.header}
          </Heading>
        </Box>
        <Form
          id={form.id}
          formJson={form}
          formSchema={reportSchema[form.id as keyof typeof reportSchema]}
          onSubmit={onSubmit}
        >
          <DropdownField
            name="States"
            label=""
            labelClassName={labelStyle}
            hint={readOnly.body}
            ariaLabel={readOnly.ariaLabel}
            options={dropdownOptions}
          />
          <Flex sx={sx.navigationButton}>
            <Button type="submit">{readOnly.buttonLabel}</Button>
          </Flex>
        </Form>
      </BasicPage>
    </>
  );
};

interface Props {
  form: FormJson;
  onSubmit: Function;
  [key: string]: any;
}

const sx = {
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
