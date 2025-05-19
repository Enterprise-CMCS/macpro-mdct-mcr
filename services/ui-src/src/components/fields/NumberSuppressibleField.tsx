import { useEffect, useState } from "react";
// components
import { ChoiceField, NumberField } from "components";
// constants
import { suppressionText } from "../../constants";
// utils
import { NumberFieldProps } from "./NumberField";

export const NumberSuppressibleField = ({
  hydrate,
  name,
  ...props
}: NumberFieldProps) => {
  const [isSuppressed, setIsSuppressed] = useState(false);
  const [numberHydrate, setNumberHydrate] = useState("");

  const choiceOnChange = (checked: boolean) => {
    setIsSuppressed(checked);
  };

  const numberOnChange = (value: string) => {
    setIsSuppressed(value === suppressionText);
  };

  useEffect(() => {
    if (hydrate === suppressionText) {
      setIsSuppressed(true);
      setNumberHydrate(hydrate);
    } else {
      setIsSuppressed(false);
      setNumberHydrate(hydrate);
    }
  }, [hydrate]);

  return (
    <>
      <NumberField
        hydrate={numberHydrate}
        name={name}
        onChange={numberOnChange}
        suppressed={isSuppressed}
        suppressible={true}
        {...props}
      />
      <ChoiceField
        hint={""}
        hydrate={isSuppressed}
        inline={true}
        label={suppressionText}
        name={`${name}-suppressed`}
        onChange={choiceOnChange}
      />
    </>
  );
};
