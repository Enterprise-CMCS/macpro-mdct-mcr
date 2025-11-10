import { Box } from "@chakra-ui/react";
import { ReportPageFooter } from "components/reports/ReportPageFooter";
import { ReportPageShapeBase } from "types/reports";
import { useStore } from "utils";

export const ReportPage = ({ route }: Props) => {
  const { report } = useStore();
  const { path } = route;
  return (
    <Box>
      {path}
      {report?.programName}
      <ReportPageFooter />
    </Box>
  );
};

interface Props {
  route: ReportPageShapeBase;
  validateOnRender?: boolean;
}
