import { useState } from "react";

export function useFormFields(initialState: any) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event: Event) {
      setValues({
        ...fields,
        [(event.target as HTMLTextAreaElement).id]: (
          event.target as HTMLTextAreaElement
        ).value,
      });
    },
  ];
}
