import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form } from "components";
// types
import { AnyObject, FormJson, InputChangeEvent } from "types";
// form
import formJson from "forms/adminDashSelector/adminDashSelector";
// utils
import { useUser } from "utils";

export const AdminDashSelector = ({ verbiage }: Props) => {
  const navigate = useNavigate();
  const [reportSelected, setReportSelected] = useState<boolean>(false);

  const { userIsAdmin, userIsApprover, userIsHelpDeskUser } =
    useUser().user ?? {};

  // create radio options
  const reportChoices = [
    {
      id: "MCPAR",
      label: "Managed Care Program Annual Report (MCPAR)",
    },
  ];
  const mlrReportChoice = {
    id: "MLR",
    label: "Medicaid Medical Loss Ratio (MLR)",
  };

  // assemble and inject report choices depending on whether report is enabled
  const mlrReport = useFlags()?.mlrReport;
  if (mlrReport) {
    reportChoices.push(mlrReportChoice);
  }
  const reportField = formJson.fields.find((field) => field.id === "report")!;
  reportField.props.choices = reportChoices;

  // add validation to formJson
  const form: FormJson = formJson;

  const onChange = (event: InputChangeEvent) => {
    if (event.target.name === "report") {
      setReportSelected(true);
    }
  };

  const onSubmit = (formData: AnyObject) => {
    let selectedReport = formData["report"][0].key;
    selectedReport = selectedReport.replace("report-", "").toLowerCase();
    localStorage.setItem("selectedReportType", selectedReport);

    if (userIsAdmin || userIsApprover || userIsHelpDeskUser) {
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
      color: "palette.base",
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
