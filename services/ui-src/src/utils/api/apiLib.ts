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
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import { updateTimeout } from "utils";

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
    console.log(error);
    return;
  }
}

export async function getTokens(): Promise<AuthTokens | undefined> {
  return (await fetchAuthSession()).tokens;
}

export async function authenticateWithIDM(): Promise<void> {
  await signInWithRedirect({ provider: { custom: "Okta" } });
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

export async function apiRequest<T>(
  request: any,
  path: string,
  opts?: RequestOptions,
  hasResponseBody?: Boolean
): Promise<T> {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    ...opts,
  };

  try {
    await updateTimeout();

    const { body } = await request({ apiName, path, options }).response;

    if (hasResponseBody === false) {
      return undefined as unknown as T;
    }

    return (await body.json()) as unknown as T;
  } catch (e: any) {
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
}

export async function del<T>(path: string, opts?: RequestOptions): Promise<T> {
  return apiRequest<T>(ampDel, path, opts, false);
}

export async function get<T>(path: string, opts?: RequestOptions): Promise<T> {
  return apiRequest<T>(ampGet, path, opts);
}

export async function post<T>(path: string, opts?: RequestOptions): Promise<T> {
  return apiRequest<T>(ampPost, path, opts);
}

export async function put<T>(path: string, opts?: RequestOptions): Promise<T> {
  return apiRequest<T>(ampPut, path, opts);
}
