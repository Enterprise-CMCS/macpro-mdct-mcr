import { useEffect, useState } from "react";
import { useWatch, Control } from "react-hook-form";
// components
import { useWarningsContext } from "components/app/WarningsContext";
// types
import { FieldValue } from "types";
// utils
import { validateFieldWarning } from "./warnings";

export const useFormWarnings = (
  fieldIds: string[],
  control: Control
): Record<string, string | null> => {
  const { setWarnings } = useWarningsContext();
  const [warnings, setLocalWarnings] = useState<Record<string, string | null>>(
    {}
  );

  const fieldValues: (FieldValue | null | undefined)[] = useWatch({
    control,
    name: fieldIds,
  });

  useEffect(() => {
    const newWarnings = Object.fromEntries(
      fieldIds.map((fieldId, index) => [
        fieldId,
        validateFieldWarning(fieldId, fieldValues[index]),
      ])
    );
    setLocalWarnings(newWarnings);
    setWarnings(newWarnings);
  }, [JSON.stringify(fieldValues)]);

  return warnings;
};
