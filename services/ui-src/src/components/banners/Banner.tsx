// components
import { Alert } from "../index";

export const Banner = ({ ...props }: Props) => {
  return <Alert {...props} />;
};

interface Props {
  title: string;
  description: string;
  [key: string]: any;
}
