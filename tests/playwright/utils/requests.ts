import { request } from "@playwright/test";
import { adminUserAuth, stateUserAuth } from "./consts";
import * as aws4 from "aws4";
import * as crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Banner } from "./types";

/**
 * Signs headers using AWS SigV4.
 * @param baseHeaders
 * @param endpoint
 * @param method
 * @param body
 * @returns The signed headers as a record of key-value pairs.
 */
function signHeadersAws4(
  baseHeaders: Record<string, string>,
  endpoint: string,
  method?: string,
  body?: string
): Record<string, string> {
  const urlParts = new URL(endpoint);

  const headersForSigning: Record<string, string> = {
    ...baseHeaders,
    Host: urlParts.host,
  };

  if (body && (method === "POST" || method === "PUT")) {
    headersForSigning["Content-Type"] = "application/json";
  }

  const requestOptions = {
    service: "execute-api",
    region: "us-east-1",
    method: method,
    host: urlParts.host,
    path: urlParts.pathname + urlParts.search,
    headers: headersForSigning,
    body: body || "",
  };

  const signedRequest = aws4.sign(requestOptions, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  });

  // Convert all header values to strings for Playwright compatibility
  const stringHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(signedRequest.headers || {})) {
    stringHeaders[key] = String(value);
  }

  return stringHeaders;
}

/**
 * Reads a logged-in user's Cognito ID token.
 * @param storageStatePath - Optional storage state path to extract ID token from
 * @returns The ID token, defaulting to the admin user's
 */
function getIdToken(storageStatePath?: string): string {
  let idToken = process.env.ID_TOKEN || "";

  // If a different storage state is provided, try to read the ID token from it
  if (storageStatePath) {
    try {
      const storagePath = path.resolve(storageStatePath);
      const storageData = JSON.parse(fs.readFileSync(storagePath, "utf8"));
      // Extract ID token from localStorage in the storage state
      const localStorage = storageData.origins?.[0]?.localStorage || [];

      // Look specifically for the Cognito ID token with the exact key pattern
      const idTokenItem = localStorage.find((item: any) =>
        item.name.endsWith(".idToken")
      );

      if (idTokenItem) {
        idToken = idTokenItem.value;
      }
    } catch (error) {
      console.warn(`Could not read ID token from storage state: ${error}`);
    }
  }

  return idToken;
}

/**
 * Generates request headers, optionally signing them with AWS SigV4 if needed.
 * @param idToken - The token to send as x-api-key
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param endpoint - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @returns The generated headers as a record of key-value pairs.
 */
function generateRequestHeaders(
  idToken: string,
  method?: string,
  endpoint?: string,
  body?: string
): Record<string, string> {
  const now = new Date();
  const amzDate = now.toISOString().replaceAll(/[:-]|\.\d{3}/g, "");

  const baseHeaders = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Origin: process.env.ORIGIN || "",
    Referer: process.env.HREF || "",
    "x-api-key": idToken,
    "x-amz-security-token": process.env.AWS_SESSION_TOKEN || "",
    "x-amz-date": amzDate,
  };

  // When running against LocalStack, we do not need to sign requests
  const isLocalStack = new URL(process.env.API_URL || "").host.includes(
    "localstack"
  );

  if (isLocalStack) {
    return baseHeaders;
  }

  return signHeadersAws4(baseHeaders, endpoint || "", method, body);
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RawApiResponse {
  status: number;
  statusText: string;
  rawText: string;
}

/**
 * Sends a signed API request with the given token, and returns the response
 * whatever its status.
 */
async function executeSignedRequest(
  method: HttpMethod,
  apiPath: string,
  token: string,
  body?: any,
  storageStatePath?: string
): Promise<RawApiResponse> {
  const endpoint = process.env.API_URL + apiPath;

  const bodyString =
    (method === "POST" || method === "PUT") && body
      ? JSON.stringify(body)
      : undefined;

  // The token is set before SigV4 signing, so x-api-key is a signed header
  const headers = generateRequestHeaders(token, method, endpoint, bodyString);

  const apiContext = await request.newContext({
    storageState: storageStatePath || adminUserAuth,
    extraHTTPHeaders: headers,
  });

  try {
    const response = await apiContext.fetch(endpoint, {
      method,
      headers,
      data: bodyString,
    });
    return {
      status: response.status(),
      statusText: response.statusText(),
      rawText: await response.text(),
    };
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Makes an API request with a real user's token, without throwing on an
 * error status.
 */
export async function authenticatedRawRequest(
  method: HttpMethod,
  apiPath: string,
  body?: any,
  storageStatePath?: string
): Promise<RawApiResponse> {
  return executeSignedRequest(
    method,
    apiPath,
    getIdToken(storageStatePath),
    body,
    storageStatePath
  );
}

/** Makes an API request with a token of the caller's choosing. */
export async function requestWithCustomToken(
  method: HttpMethod,
  apiPath: string,
  customToken: string,
  body?: any
): Promise<RawApiResponse> {
  return executeSignedRequest(method, apiPath, customToken, body);
}

/** Builds a token that was not issued by Cognito, for negative tests. */
export function buildForgedJwt(
  state: string = "TX",
  role: string = "mdctmcr-bor",
  storageStatePath: string = stateUserAuth,
  expiration: number = 9999999999
): string {
  // Pulls the real issuer for the active test environment from the saved token
  const realToken = getIdToken(storageStatePath);
  const realPayload = JSON.parse(
    Buffer.from(realToken.split(".")[1], "base64url").toString("utf8")
  );

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    "cognito:username": "retest-forge-user",
    "custom:cms_roles": role,
    "custom:cms_state": state,
    email: "retest-user@example.com",
    iss: realPayload.iss,
    exp: expiration,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const fakeSignature = crypto
    .createHash("sha256")
    .update("fake_secret")
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
}

/**
 * Makes an authenticated API request using the admin user's credentials.
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param path - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @param storageStatePath - Optional storage state path (defaults to adminUserAuth)
 * @returns The response from the API request.
 */
async function authenticatedRequest(
  method: HttpMethod,
  path: string,
  body?: any,
  storageStatePath?: string
): Promise<any> {
  const response = await authenticatedRawRequest(
    method,
    path,
    body,
    storageStatePath
  );

  if (response.status < 200 || response.status >= 300) {
    console.log(`❌ Request failed: ${response.status} ${response.statusText}`);
    console.log(`📄 Response body: ${response.rawText}`);
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} Endpoint: ${process.env.API_URL + path} Response: ${response.rawText}`
    );
  }

  return method === "DELETE" ? null : JSON.parse(response.rawText);
}

/**
 *
 * Fetches all banners from the API
 * @returns an array of banners
 */
export async function getBanners(): Promise<Banner[]> {
  const banners = await authenticatedRequest("GET", "/banners");
  return banners as Banner[];
}

export async function postBanner(
  banner: Omit<Banner, "key" | "createdAt" | "lastAltered">
): Promise<void> {
  await authenticatedRequest("POST", "/banners", banner);
}

/**
 *
 * Deletes a banner by its ID
 * @param bannerId
 */
async function deleteBanner(bannerId: string): Promise<void> {
  await authenticatedRequest("DELETE", `/banners/${bannerId}`);
}

/**
 * Deletes all existing banners from the API
 */
export async function deleteAllBanners(): Promise<void> {
  const banners = await getBanners();
  for (const banner of banners) {
    await deleteBanner(banner.key);
  }
}

export async function postReport(
  reportType: string,
  reportData: any,
  stateAbbreviation: string
): Promise<any> {
  return await authenticatedRequest(
    "POST",
    `/reports/${reportType}/${stateAbbreviation}`,
    reportData,
    stateUserAuth
  );
}

/**
 * Updates a report by its ID
 * @param reportType - the report type for example MCR, MLR or NAAAR
 * @param reportData - the request body for updating the report
 * @param stateAbbreviation - The state abbreviation for the report
 * @param reportId - The ID of the report to update
 */
export async function putReport(
  reportType: string,
  reportData: any,
  stateAbbreviation: string,
  reportId: string
): Promise<void> {
  await authenticatedRequest(
    "PUT",
    `/reports/${reportType}/${stateAbbreviation}/${reportId}`,
    reportData,
    stateUserAuth
  );
}

export async function getAllReportsForState(
  reportType: string,
  stateAbbreviation: string
): Promise<any[]> {
  const reports = await authenticatedRequest(
    "GET",
    `/reports/${reportType}/${stateAbbreviation}`
  );
  return reports as any[];
}

export async function archiveReport(
  reportType: string,
  stateAbbreviation: string,
  reportId: string
): Promise<void> {
  await authenticatedRequest(
    "PUT",
    `/reports/archive/${reportType}/${stateAbbreviation}/${reportId}`
  );
}

export async function archiveAllReportsForState(
  reportType: string,
  stateAbbreviation: string
): Promise<void> {
  const allReports = await getAllReportsForState(reportType, stateAbbreviation);
  const reportsToArchive = allReports.filter((report) => !report.archived);

  for (const report of reportsToArchive) {
    await archiveReport(reportType, stateAbbreviation, report.id);
  }
}
