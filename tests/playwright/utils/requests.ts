import { request } from "@playwright/test";
import { adminUserAuth, stateUserAuth } from "./consts";
import * as aws4 from "aws4";
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
 * Generates request headers, optionally signing them with AWS SigV4 if needed.
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param endpoint - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @param storageStatePath - Optional storage state path to extract ID token from
 * @returns The generated headers as a record of key-value pairs.
 */
function generateRequestHeaders(
  method?: string,
  endpoint?: string,
  body?: string,
  storageStatePath?: string
): Record<string, string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  let idToken = process.env.ID_TOKEN || "";

  // If a different storage state is provided, try to read the ID token from it
  if (storageStatePath) {
    const fs = require("fs");
    const path = require("path");
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
    } catch (e) {
      console.warn(`Could not read ID token from storage state: ${e}`);
    }
  }

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

/**
 * Makes an authenticated API request using the admin user's credentials.
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param path - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @param storageStatePath - Optional storage state path (defaults to adminUserAuth)
 * @returns The response from the API request.
 */
async function authenticatedRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: any,
  storageStatePath?: string
): Promise<any> {
  const endpoint = process.env.API_URL + path;

  const bodyString =
    (method === "POST" || method === "PUT") && body
      ? JSON.stringify(body)
      : undefined;

  const headers = generateRequestHeaders(
    method,
    endpoint,
    bodyString,
    storageStatePath
  );

  const apiContext = await request.newContext({
    storageState: storageStatePath || adminUserAuth,
    extraHTTPHeaders: headers,
  });

  const requestOptions: any = {
    headers,
    ...(bodyString !== undefined && { data: bodyString }),
  };

  let response;
  switch (method) {
    case "GET":
      response = await apiContext.get(endpoint, { headers });
      break;
    case "POST":
      response = await apiContext.post(endpoint, requestOptions);
      break;
    case "PUT":
      response = await apiContext.put(endpoint, requestOptions);
      break;
    case "DELETE":
      response = await apiContext.delete(endpoint, { headers });
      break;
  }

  if (!response.ok()) {
    const responseText = await response.text();
    console.log(
      `❌ Request failed: ${response.status()} ${response.statusText()}`
    );
    console.log(`📄 Response body: ${responseText}`);
    await apiContext.dispose();
    throw new Error(
      `API request failed: ${response.status()} ${response.statusText()} Endpoint: ${endpoint} Response: ${responseText}`
    );
  }

  const responseData = method === "DELETE" ? null : await response.json();
  await apiContext.dispose();
  return responseData;
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

export async function postMCPARReport(
  reportData: any,
  stateAbbreviation: string
): Promise<void> {
  await authenticatedRequest(
    "POST",
    `/reports/MCPAR/${stateAbbreviation}`,
    reportData,
    stateUserAuth
  );
}

export async function getAllReportsForState(
  stateAbbreviation: string
): Promise<any[]> {
  const reports = await authenticatedRequest(
    "GET",
    `/reports/MCPAR/${stateAbbreviation}`
  );
  return reports as any[];
}

export async function archiveReport(
  stateAbbreviation: string,
  reportId: string
): Promise<void> {
  await authenticatedRequest(
    "PUT",
    `/reports/archive/MCPAR/${stateAbbreviation}/${reportId}`
  );
}

export async function archiveAllReportsForState(
  stateAbbreviation: string
): Promise<void> {
  const allReports = await getAllReportsForState(stateAbbreviation);
  const reportsToArchive = allReports.filter((report) => !report.archived);

  for (const report of reportsToArchive) {
    await archiveReport(stateAbbreviation, report.id);
  }
}
