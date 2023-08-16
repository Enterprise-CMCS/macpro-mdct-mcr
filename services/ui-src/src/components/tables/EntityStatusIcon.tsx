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
import { getMlrEntityStatus } from "utils/tables/getMlrEntityStatus";

export const EntityStatusIcon = ({ entity, isPdf }: Props) => {
  const { report } = useContext(ReportContext);

  const entityComplete = useMemo(() => {
    return report ? getMlrEntityStatus(report, entity) : false;
  }, [report]);

  return (
    <Box sx={isPdf ? sx.containerPdf : sx.container}>
      {entityComplete ? (
        <>
          <Image
            sx={isPdf ? sx.statusIconPdf : sx.statusIcon}
            src={isPdf ? successIconDark : successIcon}
            alt={isPdf ? "" : "complete icon"}
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
            alt={isPdf ? "" : "warning icon"}
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
