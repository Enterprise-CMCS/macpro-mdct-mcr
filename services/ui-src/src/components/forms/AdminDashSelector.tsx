import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form } from "components";
// types
import { AnyObject, FormJson, InputChangeEvent } from "types";
// utils
import { useStore } from "utils";
// form
import formJson from "forms/adminDashSelector/adminDashSelector";

export const AdminDashSelector = ({ verbiage }: Props) => {
  const navigate = useNavigate();
  const [reportSelected, setReportSelected] = useState<boolean>(false);

  // state management
  const { userIsAdmin, userIsReadOnly } = useStore().user ?? {};
  const { reportsByState, clearReportsByState } = useStore();

  // create radio options
  const reportChoices = [
    {
      id: "MCPAR",
      label: "Managed Care Program Annual Report (MCPAR)",
    },
    {
      id: "MLR",
      label: "Medicaid Medical Loss Ratio (MLR)",
    },
    {
      id: "NAAAR",
      label: "Network Adequacy and Access Assurances Report (NAAAR)",
    },
  ];

  // assemble and inject report choices depending on whether report is enabled
  const reportField = formJson.fields.find((field) => field.id === "report")!;

  reportField.props.choices = reportChoices;

  // add validation to formJson
  const form: FormJson = formJson;

  useEffect(() => {
    if (reportsByState) {
      clearReportsByState();
    }
  }, []);

  const onChange = (event: InputChangeEvent) => {
    if (event.target.name === "report") {
      setReportSelected(true);
    }
  };

  const onSubmit = (formData: AnyObject) => {
    let selectedReport = formData["report"][0].key;
    selectedReport = selectedReport.replace("report-", "").toLowerCase();
    localStorage.setItem("selectedReportType", selectedReport);

    if (userIsAdmin || userIsReadOnly) {
      const selectedState = formData["state"].value;
      localStorage.setItem("selectedState", selectedState);
    }

    navigate(`/${selectedReport}`);
  };

  return (
    <Box sx={sx.root} data-testid="read-only-view">
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        onChange={onChange}
        validateOnRender={false}
        dontReset={false}
      />
      <Flex sx={sx.navigationButton}>
        <Button type="submit" form={formJson.id} isDisabled={!reportSelected}>
          {verbiage.buttonLabel}
        </Button>
      </Flex>
    </Box>
  );
};

interface Props {
  verbiage: AnyObject;
}

const sx = {
  root: {
    ".ds-c-field__hint": {
      fontSize: "md",
      color: "base",
    },
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
