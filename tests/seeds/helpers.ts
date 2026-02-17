import {
  SRPClient,
  calculateSignature,
  getNowString,
} from "amazon-user-pool-srp-client";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { AwsHeaders } from "./types";

dotenv.config({ path: "../../.env" });
dotenv.config({ path: "../../.env.seed" });

const apiUrl: string | undefined = process.env.API_URL;
const clientId: string | undefined = process.env.COGNITO_USER_POOL_CLIENT_ID;
const region: string | undefined =
  process.env.COGNITO_USER_POOL_ID?.split("_")[0];
const userPoolId: string | undefined =
  process.env.COGNITO_USER_POOL_ID?.split("_")[1];
const cognitoUrl: string = `https://cognito-idp.${region}.amazonaws.com`;

const errorResponse = (error: any): void => {
  if (error?.cause?.code === "ECONNREFUSED") {
    console.error("‼️ API server must be running to use this script");
  } else {
    console.error(error);
  }
};

const get = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  const request = {
    method: "GET",
    headers,
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const getApi = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  return get(`${apiUrl}${url}`, headers);
};

const post = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any,
  method = "POST"
): Promise<any> => {
  const request = {
    method,
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, request);
    return response.json();
  } catch (error) {
    errorResponse(error);
  }
};

export const postApi = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  return post(`${apiUrl}${url}`, headers, body);
};

export const putApi = async (
  url: string,
  headers: Headers | AwsHeaders,
  body: any
): Promise<any> => {
  return post(`${apiUrl}${url}`, headers, body, "PUT");
};

const del = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  const request = {
    method: "delete",
    headers,
  };

  try {
    await fetch(url, request);
    return {};
  } catch (error) {
    errorResponse(error);
  }
};

export const deleteApi = async (
  url: string,
  headers: Headers | AwsHeaders
): Promise<any> => {
  return del(`${apiUrl}${url}`, headers);
};

export const login = async (
  email: string | undefined,
  password: string | undefined
): Promise<any> => {
  const srp = new SRPClient(userPoolId);
  const SRP_A = srp.calculateA();

  return post(
    cognitoUrl,
    {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    {
      ClientId: clientId,
      AuthFlow: "USER_SRP_AUTH",
      AuthParameters: {
        USERNAME: email,
        SRP_A,
      },
    }
  ).then(async ({ ChallengeName, ChallengeParameters }) => {
    const hkdf = srp.getPasswordAuthenticationKey(
      ChallengeParameters.USER_ID_FOR_SRP,
      password,
      ChallengeParameters.SRP_B,
      ChallengeParameters.SALT
    );

    const dateNow = getNowString();
    const signatureString = calculateSignature(
      hkdf,
      userPoolId,
      ChallengeParameters.USER_ID_FOR_SRP,
      ChallengeParameters.SECRET_BLOCK,
      dateNow
    );

    const { AuthenticationResult } = await post(
      cognitoUrl,
      {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
      },
      {
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        ChallengeName,
        ChallengeResponses: {
          PASSWORD_CLAIM_SIGNATURE: signatureString,
          PASSWORD_CLAIM_SECRET_BLOCK: ChallengeParameters.SECRET_BLOCK,
          TIMESTAMP: dateNow,
          USERNAME: ChallengeParameters.USER_ID_FOR_SRP,
        },
      }
    );

    return AuthenticationResult;
  });
};

export const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  "en-US",
  {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }
);

export const randomIndex = (size: number) => Math.floor(Math.random() * size);

export const numberFloat = () =>
  faker.number
    .float({
      min: 99.01,
      max: 99.99,
      fractionDigits: 2,
    })
    .toString();

export const numberInt = () =>
  faker.number
    .int({
      min: 1,
      max: 100,
    })
    .toString();
