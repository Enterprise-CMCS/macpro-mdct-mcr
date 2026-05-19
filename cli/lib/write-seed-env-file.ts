import path, { dirname } from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = path.join(__dirname, "../../");
const configFilePath = path.resolve(outputPath, ".env.seed");

export const writeSeedEnvFile = async (
  envVariables: Record<string, string>
) => {
  await fs.rm(configFilePath, { force: true });

  const envConfigContent = [
    `API_URL=${envVariables["API_URL"].replace("https", "http")}`,
  ].join("\n");

  await fs.writeFile(configFilePath, envConfigContent);
};
