import { Auth } from "aws-amplify";
import { errorHandler } from "utils/errors/errorHandler";

export const getRequestHeaders = async (): Promise<any> => {
  try {
    const session = await Auth.currentSession();
    const token = await session.getIdToken().getJwtToken();
    const headers = {
      "x-api-key": token,
    };
    return headers;
  } catch (error) {
    errorHandler(error);
  }
};
