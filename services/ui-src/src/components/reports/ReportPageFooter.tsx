import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { useFindRoute, useUser } from "utils";
import { FormJson } from "types";
import { mcparReportRoutesFlat } from "forms/mcpar";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({ submitting, form, ...props }: Props) => {
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
            leftIcon={
              <img src={previousIcon} alt="Previous" style={sx.arrowIcon} />
            }
          >
            Previous
          </Button>
          {!form?.id || formIsDisabled ? (
            <Button
              onClick={() => navigate(nextRoute)}
              rightIcon={
                submitting ? (
                  <></>
                ) : (
                  <img src={nextIcon} alt="Next" style={sx.arrowIcon} />
                )
              }
            >
              Continue
            </Button>
          ) : (
            <Button
              form={form.id}
              type="submit"
              sx={sx.button}
              rightIcon={
                !submitting ? (
                  <img src={nextIcon} alt="Next" style={sx.arrowIcon} />
                ) : undefined
              }
            >
              {submitting ? <Spinner size="small" /> : "Save & continue"}
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
  submitting?: boolean;
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
  arrowIcon: {
    width: "1rem",
  },
};
