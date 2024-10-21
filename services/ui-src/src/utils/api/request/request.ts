import { del, get, post, put } from "aws-amplify/api";
import {
  AuthTokens,
  fetchAuthSession,
  signIn,
  signOut,
} from "aws-amplify/auth";

const apiName = "mcr";

interface RequestHeaders {
  "x-api-key": string | undefined;
}

export const getRequestHeaders = async (): Promise<
  RequestHeaders | undefined
> => {
  try {
    const tokens = await getTokens();
    const headers = {
      "x-api-key": tokens?.idToken?.toString(),
    };

    return headers;
  } catch (error) {
    console.log(error); //eslint-disable-line no-console
    return;
  }
};

export const getTokens = async (): Promise<AuthTokens | undefined> => {
  return (await fetchAuthSession()).tokens;
};

export const loginUser = async (
  username: string,
  password: string
): Promise<void> => {
  await signIn({ username, password });
};

export const logoutUser = async (): Promise<void> => {
  await signOut();
};

export const refreshSession = async (): Promise<void> => {
  await fetchAuthSession({ forceRefresh: true });
};

export const deleteApi = async (path: string, opts?: any): Promise<void> => {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  await del({
    apiName,
    path,
    options,
  }).response;
};

export const getApi = async <T>(path: string, opts?: any): Promise<T> => {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
};

export const postApi = async <T>(path: string, opts?: any): Promise<T> => {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await post({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
};

export const putApi = async <T>(path: string, opts?: any): Promise<T> => {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await put({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
};
