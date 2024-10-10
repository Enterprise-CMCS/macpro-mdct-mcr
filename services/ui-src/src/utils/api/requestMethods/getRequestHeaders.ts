import { fetchAuthSession } from "aws-amplify/auth";

export const getRequestHeaders = async (): Promise<any> => {
  try {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const headers = {
      "x-api-key": idToken?.toString(),
    };
    return headers;
  } catch (error) {
    console.log(error); //eslint-disable-line no-console
  }
};
