import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { FormJson } from "types";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({
  submitting,
  form,
  hidePrevious,
  ...props
}: Props) => {
  const navigate = useNavigate();
  const { report } = useContext(ReportContext);
  const { previousRoute, nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes,
    report?.formTemplate.basePath
  );

  const { userIsAdmin, userIsReadOnly } = useUser().user ?? {};
  const isAdminUserType = userIsAdmin || userIsReadOnly;
  const formIsDisabled = isAdminUserType && form?.adminDisabled;

  return (
    <Box sx={sx.footerBox} {...props}>
      <Box>
        <Flex sx={hidePrevious ? sx.floatButtonRight : sx.buttonFlex}>
          {!hidePrevious && (
            <Button
              onClick={() => navigate(previousRoute)}
              variant="outline"
              leftIcon={
                <Image src={previousIcon} alt="Previous" sx={sx.arrowIcon} />
              }
            >
              Previous
            </Button>
          )}
          {!form?.id || formIsDisabled ? (
            <Button
              onClick={() => navigate(nextRoute)}
              rightIcon={
                submitting ? (
                  <></>
                ) : (
                  <Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />
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
                  <Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />
                ) : undefined
              }
            >
              {submitting ? <Spinner size="sm" /> : "Continue"}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  form?: FormJson;
  submitting?: boolean;
  hidePrevious?: boolean;
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "3.5rem",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
  floatButtonRight: {
    justifyContent: "right",
    marginY: "1.5rem",
  },
  arrowIcon: {
    width: "1rem",
  },
  button: {
    width: "8.25rem",
  },
};
