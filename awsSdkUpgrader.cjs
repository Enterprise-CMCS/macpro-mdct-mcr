const { execSync } = require("node:child_process");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");

const result = execSync(
  "cd services/app-api && yarn info @aws-sdk/client-dynamodb version && cd -"
).toString();
// const latestSdkVersionNumber = result.split("\n")[1].trim();
const latestSdkVersionNumber = "3.758.0";
const versionMatch = /^3\.(\d+)\.0$/.exec(latestSdkVersionNumber);
if (!versionMatch) {
  throw new Error(
    `Unexpected @aws-sdk version number: ${latestSdkVersionNumber}`
  );
}
const minorVersion = versionMatch[1];
execSync(`git checkout -b bump-sdk-${minorVersion}`);

const serviceDirectories = readdirSync("services", { withFileTypes: true })
  .filter((info) => info.isDirectory())
  .map((info) => path.join("services", info.name));

for (let directory of serviceDirectories) {
  const service = JSON.parse(
    readFileSync(path.join(directory, "package.json"), "utf8")
  );
  const dependencies = service.dependencies ?? {};
  const packagesToUpgrade = Object.keys(dependencies)
    .filter((key) => key.startsWith("@aws-sdk/"))
    .map((packageName) => `${packageName}@^${latestSdkVersionNumber}`)
    .join(" ");
  if (packagesToUpgrade) {
    const dependencyUpgradeCommand = `cd ${directory} && yarn upgrade ${packagesToUpgrade} && cd -`;
    console.log(dependencyUpgradeCommand);
    execSync(dependencyUpgradeCommand);
  }

  const devDependencies = service.devDependencies ?? {};
  const devPackagesToUpgrade = Object.keys(devDependencies)
    .filter((key) => key.startsWith("@aws-sdk/"))
    .map((packageName) => `${packageName}@^${latestSdkVersionNumber}`)
    .join(" ");
  if (devPackagesToUpgrade) {
    const devDependencyUpgradeCommand = `cd ${directory} && yarn upgrade --dev ${devPackagesToUpgrade} && cd -`;
    console.log(devDependencyUpgradeCommand);
    execSync(devDependencyUpgradeCommand);
  }
}

execSync(
  `git commit -am 'Bump AWS SDK version numbers to ${latestSdkVersionNumber}'`
);
execSync(`git push`);
