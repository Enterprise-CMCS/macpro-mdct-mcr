import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Flex } from "@chakra-ui/react";
import { Form, ReportContext } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { AnyObject, StandardReportPageShape, ReportStatus } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";
import { Spinner } from "@cmsgov/design-system";

export const StandardReportPage = ({ route, setSubmitting }: Props) => {
  const { report, updateReport } = useContext(ReportContext);
  const { full_name, state, userIsStateUser, userIsStateRep } =
    useUser().user ?? {};
  const navigate = useNavigate();
  const { nextRoute } = useFindRoute(mcparReportRoutesFlat, "/mcpar");

  const onSubmit = async (formData: AnyObject) => {
    if (userIsStateUser || userIsStateRep) {
      setSubmitting(true);
      const reportKeys = {
        state: state,
        id: report?.id,
      };
      const dataToWrite = {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: full_name,
        fieldData: formData,
      };
      await updateReport(reportKeys, dataToWrite);
      setSubmitting(false);
    }
    navigate(nextRoute);
  };

  return (
    <Box data-testid="standard-page">
      {!report ? (
        <Flex sx={sx.spinnerContainer}>
          <Spinner size="big" />
        </Flex>
      ) : (
        <Form
          id={route.form.id}
          formJson={route.form}
          onSubmit={onSubmit}
          formData={report}
        />
      )}
    </Box>
  );
};

interface Props {
  route: StandardReportPageShape;
  setSubmitting: Function;
}

const sx = {
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",

    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
