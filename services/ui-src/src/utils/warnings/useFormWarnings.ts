import { useEffect, useState } from "react";
import { useWatch, Control } from "react-hook-form";
// components
import { useWarningsContext } from "components/app/WarningsContext";
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

  const formData = useWatch({ control, name: fieldIds });

  useEffect(() => {
    const newWarnings: Record<string, string | null> = {};
    fieldIds.forEach((fieldId, index) => {
      newWarnings[fieldId] = validateFieldWarning(fieldId, formData[index]);
    });
    setLocalWarnings(newWarnings);
    setWarnings(newWarnings);
  }, [JSON.stringify(formData)]);

  return warnings;
};
