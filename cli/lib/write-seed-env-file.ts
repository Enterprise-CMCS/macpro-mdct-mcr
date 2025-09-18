import path, { dirname } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configFilePath = path.resolve(
  path.join(__dirname, "../../../"),
  ".env.seed"
);

export const writeSeedEnvFile = async (
  envVariables: Record<string, string>
) => {
  await fs.rm(configFilePath, { force: true });

  const envConfigContent = [
    `API_URL=${envVariables["API_URL"].replace("https", "http")}`,
  ].join("\n");

  await fs.writeFile(configFilePath, envConfigContent);
};
