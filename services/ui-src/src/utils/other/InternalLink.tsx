import { ReactNode } from "react";
import { Link as RouterLink, useParams } from "react-router";
import { removeReportSpecificPath } from "utils/reports/pathFormatter";

/**
 * This component assumes we are taking template style paths and converting them to urls
 */
export const InternalLink = ({ to, children }: Props) => {
  const { reportType, state, reportId } = useParams();
  const basePath = `/report/${reportType}/${state}/${reportId}`;
  const formattedPath = `${basePath}/${removeReportSpecificPath(to)}`;
  return <RouterLink to={formattedPath}>{children}</RouterLink>;
};

interface Props {
  to: string;
  children?: ReactNode;
}
