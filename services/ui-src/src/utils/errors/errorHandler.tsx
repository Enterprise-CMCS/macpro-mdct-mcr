import { ErrorData } from "utils/types/types";

export const errorHandler = (
  error: Error | any,
  callback: Function
): ErrorData => {
  const isError = error && error.stack && error.message;
  const errorData = {
    name: error.name || "",
    message: isError ? error.message : JSON.stringify(error),
  };
  callback(errorData);
  return errorData;
};
