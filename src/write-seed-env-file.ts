import path, { dirname } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = path.join(__dirname, "../../");
const configFilePath = path.resolve(outputPath, ".env.seed");

export async function writeSeedEnvFile(apiUrl: string) {
  await fs.rm(configFilePath, { force: true });

  const envConfigContent = [`API_URL=${apiUrl.replace("https", "http")}`].join(
    "\n"
  );

  await fs.writeFile(configFilePath, envConfigContent);
}
