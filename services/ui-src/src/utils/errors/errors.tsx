export const errorHandler = (error: Error | any) => {
  let message = error.toString();

  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }

  alert(message);
};
