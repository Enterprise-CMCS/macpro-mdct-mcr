import {
  del as ampDel,
  get as ampGet,
  post as ampPost,
  put as ampPut,
} from "aws-amplify/api";
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

interface RequestOptions {
  body: any;
}

export async function getRequestHeaders(): Promise<RequestHeaders | undefined> {
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
}

export async function getTokens(): Promise<AuthTokens | undefined> {
  return (await fetchAuthSession()).tokens;
}

export async function loginUser(
  username: string,
  password: string
): Promise<void> {
  await signIn({ username, password });
}

export async function logoutUser(): Promise<void> {
  await signOut();
}

export async function refreshSession(): Promise<void> {
  await fetchAuthSession({ forceRefresh: true });
}

export async function del(path: string, opts?: RequestOptions): Promise<void> {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  await ampDel({
    apiName,
    path,
    options,
  }).response;
}

export async function get<T>(path: string, opts?: RequestOptions): Promise<T> {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await ampGet({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
}

export async function post<T>(path: string, opts?: RequestOptions): Promise<T> {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await ampPost({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
}

export async function put<T>(path: string, opts?: RequestOptions): Promise<T> {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };
  const { body } = await ampPut({
    apiName,
    path,
    options,
  }).response;

  return (await body.json()) as unknown as T;
}
