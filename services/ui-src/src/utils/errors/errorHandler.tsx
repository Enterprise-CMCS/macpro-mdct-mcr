export const errorHandler = (
  error: Error | any,
  callback?: Function,
  message?: string
): void => {
  const errorData = {
    name: error.name,
    message: message || error.message,
  };
  if (callback) callback(errorData);
  console.warn(errorData.name, errorData.message); // eslint-disable-line no-console
};
