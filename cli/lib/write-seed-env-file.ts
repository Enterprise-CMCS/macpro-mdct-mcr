import path, { dirname } from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configFilePath = path.resolve(
  path.join(__dirname, "../../"),
  ".env.seed"
);

export const writeSeedEnvFile = async (
  envVariables: Record<string, string>
) => {
  await fs.rm(configFilePath, { force: true });

  const unescapeDoubleQuotes = (value: string) => {
    return value.replaceAll(String.raw`\"`, '"');
  };

  const envConfigContent = [
    `API_URL=${envVariables["API_URL"].replace("https", "http")}`,
    `launchDarklyLocalFlags='${unescapeDoubleQuotes(envVariables["LD_LOCAL_FLAGS"])}'`,
    `launchDarklyServer=${envVariables["LD_SDK_KEY"]}`,
  ].join("\n");

  await fs.writeFile(configFilePath, envConfigContent);
};
