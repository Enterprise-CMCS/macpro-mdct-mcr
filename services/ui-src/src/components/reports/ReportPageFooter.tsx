import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { ReportContext } from "components";
// utils
import { useFindRoute, useUser } from "utils";
import { FormJson } from "types";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({ form, ...props }: Props) => {
  const navigate = useNavigate();
  const { report } = useContext(ReportContext);
  const { previousRoute, nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes,
    report?.formTemplate.basePath
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
              <Image src={previousIcon} alt="Previous" sx={sx.arrowIcon} />
            }
          >
            Previous
          </Button>
          {!form?.id || formIsDisabled ? (
            <Button
              onClick={() => navigate(nextRoute)}
              rightIcon={<Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              form={form.id}
              type="submit"
              rightIcon={<Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />}
            >
              Continue
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
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "3.5rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
  arrowIcon: {
    width: "1rem",
  },
};
