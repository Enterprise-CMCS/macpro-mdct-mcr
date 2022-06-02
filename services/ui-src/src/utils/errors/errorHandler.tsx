export const errorHandler = (error: Error | any): void => {
  const isError = error && error.stack && error.message;
  const message = isError ? error.message : JSON.stringify(error);
  alert(message);
  return message;
};
