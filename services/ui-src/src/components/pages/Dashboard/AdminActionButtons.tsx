// components
import { Button, Td } from "@chakra-ui/react";
import { Spinner } from "@cmsgov/design-system";
// utils
import { AnyObject, ReportMetadataShape } from "types";

export const AdminActionButtons = ({
  report,
  reportType,
  reportId,
  archiveReport,
  archiving,
  unlocking,
  unlockReport,
  sxOverride,
}: AdminActionButtonProps) => {
  return (
    <>
      {reportType === "MLR" && (
        <Td>
          <Button
            variant="link"
            disabled={report.locked}
            sx={sxOverride.adminActionButton}
            onClick={() => unlockReport!(report)}
          >
            {unlocking && reportId === report.id ? (
              <Spinner size="small" />
            ) : (
              "Unlock"
            )}
          </Button>
        </Td>
      )}
      <Td>
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
      </Td>
    </>
  );
};

interface AdminActionButtonProps {
  report: ReportMetadataShape;
  reportType: string;
  reportId: string | undefined;
  archiveReport: Function;
  archiving: boolean;
  unlocking?: boolean;
  unlockReport?: Function;
  sxOverride: AnyObject;
}
