import { Box } from "@chakra-ui/react";
import { ReportPageFooter } from "components/reports/ReportPageFooter";
import { ReportPageShapeBase } from "types/reports";
import { useStore } from "utils";

export const ReportPage = ({ route }: Props) => {
  const { report } = useStore();

  // const { entityType, verbiage, pageConfig } = route;

  return (
    <Box>
      <p>{route.path}</p>
      <p>{report?.reportType}</p>

      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ReportPageShapeBase;
  validateOnRender?: boolean;
}
