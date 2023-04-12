// components
import { TextField } from "components";

export const TextAreaField = ({
  name,
  label,
  placeholder,
  rows = 3,
  ...props
}: Props) => {
  return (
    <TextField
      name={name}
      label={label}
      placeholder={placeholder}
      multiline
      rows={rows}
      {...props}
    />
  );
};

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  clear?: boolean;
  [key: string]: any;
}
