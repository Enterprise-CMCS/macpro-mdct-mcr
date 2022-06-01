export const errorHandler = (error: Error | any): void => {
  let message = error.toString();

  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }

  alert(message);
};
