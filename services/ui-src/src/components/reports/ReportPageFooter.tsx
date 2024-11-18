import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// utils
import { parseCustomHtml, useFindRoute, useStore } from "utils";
import { CustomHtmlElement, FormJson, ReportStatus } from "types";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({
  submitting,
  form,
  praDisclosure,
  ...props
}: Props) => {
  const navigate = useNavigate();
  const { report } = useStore();
  const { previousRoute, nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes,
    report?.formTemplate.basePath
  );

  const { userIsAdmin, userIsReadOnly, userIsEndUser } = useStore().user ?? {};
  const isAdminUserType = userIsAdmin || userIsReadOnly;
  const hidePrevious = previousRoute === "/mcpar" || previousRoute === "/mlr";
  const reportWithSubmittedStatus = report?.status === ReportStatus.SUBMITTED;
  const formIsDisabled =
    (isAdminUserType && !form?.editableByAdmins) ||
    (userIsEndUser && reportWithSubmittedStatus);
  const isReadOnly = !form?.id || formIsDisabled;

  const prevButton = (
    <Button
      onClick={() => navigate(previousRoute)}
      variant="outline"
      leftIcon={<Image src={previousIcon} alt="" sx={sx.arrowIcon} />}
    >
      Previous
    </Button>
  );

  const nextButtonNavOnly = (
    <Button
      onClick={() => navigate(nextRoute)}
      sx={sx.nextButton}
      rightIcon={<Image src={nextIcon} alt="" sx={sx.arrowIcon} />}
    >
      Continue
    </Button>
  );

  const nextButtonSubmit = (
    <Button
      form={form?.id}
      type="submit"
      sx={sx.nextButton}
      rightIcon={
        !submitting ? (
          <Image src={nextIcon} alt="" sx={sx.arrowIcon} />
        ) : undefined
      }
    >
      {submitting ? <Spinner size="sm" /> : "Continue"}
    </Button>
  );

  return (
    <Box sx={sx.footerBox} {...props}>
      <Flex>
        {!hidePrevious ? prevButton : null}
        {isReadOnly ? nextButtonNavOnly : nextButtonSubmit}
      </Flex>
      {praDisclosure && (
        <Box sx={sx.praStatement}>{parseCustomHtml(praDisclosure)}</Box>
      )}
    </Box>
  );
};

interface Props {
  form?: FormJson;
  submitting?: boolean;
  praDisclosure?: CustomHtmlElement[];
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "2.5rem",
    paddingTop: "1.5rem",
  },
  arrowIcon: {
    width: "1rem",
  },
  button: {
    width: "8.25rem",
  },
  nextButton: {
    minWidth: "8.25rem",
    marginLeft: "auto",
  },
  praStatement: {
    fontSize: "0.875rem",
    marginTop: "1rem",
  },
};
