// components
import { Button } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportMetadataShape } from "types";

export const AdminActionButtons = ({
  report,
  reportType,
  reportId,
  archiveReport,
  archiving,
  locking,
  lockReport,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <>
      {reportType === "MLR" && (
        <Button
          variant="link"
          sx={sxOverride.adminActionButton}
          onClick={() => lockReport!(report)}
        >
          {locking && reportId === report.id ? (
            <Spinner size="small" />
          ) : report?.locked ? (
            "Unlock"
          ) : (
            "Lock"
          )}
        </Button>
      )}
      <Button
        variant="link"
        sx={sxOverride.adminActionButton}
        onClick={() => archiveReport(report)}
      >
        {archiving && reportId === report.id ? (
          <Spinner size="small" />
        ) : report?.archived ? (
          "Unarchive"
        ) : (
          "Archive"
        )}
      </Button>
    </>
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archiveReport: Function;
  archiving: boolean;
  locking?: boolean;
  lockReport?: Function;
  sxOverride: AnyObject;
}
