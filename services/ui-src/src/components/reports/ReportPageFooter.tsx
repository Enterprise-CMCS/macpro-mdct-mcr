import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex } from "@chakra-ui/react";
import { Icon, TemplateContext } from "components";
// utils
import { useFindRoute } from "utils";

export const ReportPageFooter = ({ formId, ...props }: Props) => {
  const navigate = useNavigate();
  const { formTemplate, formRoutes } = useContext(TemplateContext);
  const { previousRoute, nextRoute } = useFindRoute(
    formRoutes,
    formTemplate.basePath
  );
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
          {formId ? (
            <Button
              form={formId}
              type="submit"
              rightIcon={<Icon icon="arrowRight" />}
            >
              Save & continue
            </Button>
          ) : (
            <Button
              onClick={() => navigate(nextRoute)}
              rightIcon={<Icon icon="arrowRight" />}
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
  formId?: string;
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
};
