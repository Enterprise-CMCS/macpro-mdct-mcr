// components
import { Image } from "@chakra-ui/react";
// utils
import { EntityShape } from "types";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import successIcon from "assets/icons/icon_check_circle.png";
import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { mapValidationTypesToSchema } from "utils";
import { object } from "yup";

export const EntityStatusIcon = ({ entity }: Props) => {
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
    mapValidationTypesToSchema;

    try {
      return formResolverSchema.validateSync(entity);
    } catch (err) {
      return false;
    }
  }, [report]);

  return (
    <>
      {entityComplete ? (
        <Image
          sx={sx.statusIcon}
          src={successIcon}
          alt="complete icon"
          boxSize="xl"
        />
      ) : (
        <Image
          sx={sx.statusIcon}
          src={unfinishedIcon}
          alt="warning icon"
          boxSize="xl"
        />
      )}
    </>
  );
};

interface Props {
  entity: EntityShape;
  [key: string]: any;
}

const sx = {
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
