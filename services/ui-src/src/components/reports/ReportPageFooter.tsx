import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { Icon } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { FormJson } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";

export const ReportPageFooter = ({ loading, form, ...props }: Props) => {
  const navigate = useNavigate();
  const { previousRoute, nextRoute } = useFindRoute(
    mcparReportRoutesFlat,
    "/mcpar"
  );

  const { userIsAdmin, userIsApprover, userIsHelpDeskUser } =
    useUser().user ?? {};
  const isAdminUserType = userIsAdmin || userIsApprover || userIsHelpDeskUser;
  const formIsDisabled = isAdminUserType && form?.adminDisabled;

  return (
    <Box sx={sx.footerBox} {...props}>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button
            onClick={() => navigate(previousRoute)}
            variant="outline"
            leftIcon={<Icon icon="arrowLeft" />}
          >
            Previous
          </Button>
          {!form?.id || formIsDisabled ? (
            <Button
              onClick={() => navigate(nextRoute)}
              rightIcon={loading ? <></> : <Icon icon="arrowRight" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              form={form.id}
              type="submit"
              sx={sx.button}
              rightIcon={loading ? <></> : <Icon icon="arrowRight" />}
            >
              {loading ? <Spinner size="sm" mr="-2" /> : "Save & continue"}
            </Button>
          )}
        </Flex>
        {/* TODO: Add Prince Print Button */}
      </Box>
    </Box>
  );
};

interface Props {
  form?: FormJson;
  loading?: boolean;
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "3.5rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  button: {
    width: "11.5rem",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
};
