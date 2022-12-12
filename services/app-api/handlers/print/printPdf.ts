import handler from "../handler-lib";
import AWS from "aws-sdk";
import axios from "axios";
import { StatusCodes } from "../../utils/types/types";

/**
 * Calls the CMS Prince PDF Generator to generate a PDF of the provided HTML
 */
export const printPdf = handler(async (event, _context) => {
  // Throw an error if there is no provided HTML
  const body = event.body ? JSON.parse(event.body) : null;

  if (!body || !body.encodedHtml) {
    throw new Error("Missing required encodedHtml");
  }

  const host = process.env.PRINCE_API_HOST;
  const path = process.env.PRINCE_API_PATH;

  const params = {
    method: "POST",
    url: `https://${host}${path}`,
    host: host,
    path: path,
    region: "us-east-1",
    service: "execute-api",
    data: body.encodedHtml, // aws4 looks for body; axios for data
    body: body.encodedHtml,
  };

  // Sign auth, and massage the format for axios
  const aws4 = require("aws4");
  const credentials = AWS.config.credentials;
  if (!credentials) {
    throw new Error("No config found to make request to PDF API");
  }

  let signedRequest = aws4.sign(params, {
    secretAccessKey: credentials.secretAccessKey,
    accessKeyId: credentials.accessKeyId,
    sessionToken: credentials.sessionToken,
  });

  delete signedRequest.body; // Remove body after signing, contained in data, don't need to duplicate it

  // Execute
  try {
    let response = await axios(signedRequest);
    return { body: response.data };
  } catch (error: any) {
    if (error.response.status === StatusCodes.UNAUTHORIZED) {
      throw new Error("You do not have access to the CMS PDF Generator");
    }
  }
});
