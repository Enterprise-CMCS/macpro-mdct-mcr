import { request } from "@playwright/test";
import { adminUserAuth } from "./consts";
import * as aws4 from "aws4";
import { Banner } from "./types";

/**
 * Determines if the API URL requires SigV4 signing.
 * @returns needsSigning - boolean indicating whether SigV4 signing is needed
 */
function needsSigV4Signing(): boolean {
  const apiUrl = process.env.API_URL || "";
  const needsSigning = new URL(apiUrl).host.endsWith(
    "execute-api.us-east-1.amazonaws.com"
  );
  return needsSigning;
}

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

  return signedRequest.headers as Record<string, string>;
}

/**
 * Generates request headers, optionally signing them with AWS SigV4 if needed.
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param endpoint - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @returns The generated headers as a record of key-value pairs.
 */
function generateRequestHeaders(
  method?: string,
  endpoint?: string,
  body?: string
): Record<string, string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  const baseHeaders = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Origin: process.env.ORIGIN || "",
    Referer: process.env.HREF || "",
    "x-api-key": process.env.ID_TOKEN || "",
    "x-amz-security-token": process.env.AWS_SESSION_TOKEN || "",
    "x-amz-date": amzDate,
  };

  if (!needsSigV4Signing() || !method || !endpoint) {
    return baseHeaders;
  } else {
    return signHeadersAws4(baseHeaders, endpoint, method, body);
  }
}

/**
 * Makes an authenticated API request using the admin user's credentials.
 * @param method - HTTP method (e.g., "GET", "POST")
 * @param path - API endpoint path
 * @param body - Optional request body for POST/PUT requests
 * @returns The response from the API request.
 */
async function authenticatedRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: any
): Promise<any> {
  const endpoint = process.env.API_URL + path;
  const headers = generateRequestHeaders(method, endpoint, body);

  const apiContext = await request.newContext({
    storageState: adminUserAuth,
    extraHTTPHeaders: headers,
  });
  const requestOptions: any = { headers };

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

  const responseData = await response.json();
  await apiContext.dispose();
  return responseData;
}

export async function getBanners(): Promise<Banner[]> {
  const banners = await authenticatedRequest("GET", "/banners");
  return banners as Banner[];
}
