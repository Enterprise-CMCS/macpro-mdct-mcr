// components
import { Box, Image, Text } from "@chakra-ui/react";
// utils
import { EntityShape } from "types";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import unfinishedIconDark from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";
import successIconDark from "assets/icons/icon_check_circle_dark.png";
import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { mapValidationTypesToSchema } from "utils";
import { object } from "yup";

export const EntityStatusIcon = ({ entity, isPdf }: Props) => {
  const { report } = useContext(ReportContext);

  const entityComplete = useMemo(() => {
    const reportFormValidation = Object.fromEntries(
      Object.entries(report?.formTemplate.validationJson ?? {}).filter(
        ([key]) => key.includes("report_") || key.includes("state_")
      )
    );

    const formValidationSchema =
      mapValidationTypesToSchema(reportFormValidation);
    const formResolverSchema = object(formValidationSchema || {});

    try {
      return formResolverSchema.validateSync(entity);
    } catch (err) {
      return false;
    }
  }, [report]);

  return (
    <Box sx={isPdf ? sx.containerPdf : sx.container}>
      {entityComplete ? (
        <>
          <Image
            sx={isPdf ? sx.statusIconPdf : sx.statusIcon}
            src={isPdf ? successIconDark : successIcon}
            alt="complete icon"
            boxSize="xl"
          />
          {isPdf && (
            <Text sx={sx.successText}>
              <b>Complete</b>
            </Text>
          )}
        </>
      ) : (
        <>
          <Image
            sx={isPdf ? sx.statusIconPdf : sx.statusIcon}
            src={isPdf ? unfinishedIconDark : unfinishedIcon}
            alt="warning icon"
            boxSize="xl"
          />
          {isPdf && (
            <Text sx={sx.errorText}>
              <b>Error</b>
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

interface Props {
  /**
   * Entity to show status for
   */
  entity: EntityShape;
  /**
   * Whether or not icon is appearing on PDF page (used for styling)
   */
  isPdf?: boolean;
  [key: string]: any;
}

const sx = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  successText: {
    color: "palette.success_darker",
    fontSize: "0.667rem",
  },
  errorText: {
    color: "palette.error_darker",
    fontSize: "0.667rem",
  },
  containerPdf: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
  statusIconPdf: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
