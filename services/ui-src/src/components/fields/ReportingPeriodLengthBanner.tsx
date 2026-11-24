import { useFormContext, useWatch } from "react-hook-form";
// components
import { Alert } from "components";
// types
import { AlertTypes } from "types";
// utils
import { isNotTwelveMonthPeriod } from "utils/warnings/warnings";

// Shows a warning banner inside a form when the start and end date fields
// (e.g. D1.X.9a/9b) don't describe a 12-month period. Updates as the user types.
export const ReportingPeriodLengthBanner = ({
  startDateFieldId,
  endDateFieldId,
  content,
}: Props) => {
  const { control } = useFormContext();
  const [start, end] = useWatch({
    control,
    name: [startDateFieldId, endDateFieldId],
  });
  if (!isNotTwelveMonthPeriod(start, end)) return null;
  return <Alert status={AlertTypes.WARN} description={content} />;
};

interface Props {
  startDateFieldId: string;
  endDateFieldId: string;
  content: string;
  [key: string]: unknown;
}
