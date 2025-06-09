/* eslint-disable no-console */
/*
 * Usage:
 *   node ./scripts/yarn-lock-diff.cjs \
 *     yarn.lock.new \
 *     yarn.lock.old \
 *     package.json.new \
 *     package.json.old
 */

const fs = require("fs");
const { parse } = require("@yarnpkg/lockfile");

const getPackageName = (key) => {
  const match = key.match(/^(@?[^@]+(?:\/[^@]+)?)@/);
  return match ? match[1] : key;
};

const parseLockFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parse(content);
  return parsed.object;
};

const parsePackageJson = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(content);

  return {
    ...json.dependencies,
    ...json.devDependencies,
  };
};

const compareLockFiles = (oldLockFile, newLockFile) => {
  const keys = new Set([
    ...Object.keys(oldLockFile),
    ...Object.keys(newLockFile),
  ]);
  const packages = [];

  for (const key of keys) {
    const packageName = getPackageName(key);
    const priorEntry = oldLockFile[key];
    const upgradedEntry = newLockFile[key];

    const priorVersion = priorEntry?.version || "-";
    const upgradedVersion = upgradedEntry?.version || "-";

    let status = "";
    if (!priorEntry && upgradedEntry) status = "added";
    else if (priorEntry && !upgradedEntry) status = "removed";
    else if (priorEntry.version === upgradedEntry.version) status = "unchanged";

    // Skip unchanged packages
    if (status === "unchanged") continue;

    const packageIndex = packages.findIndex(
      (pkg) => pkg.package === packageName
    );

    // Package has multiple entries, so combine them
    if (packageIndex > -1) {
      if (status === "added") {
        packages[packageIndex].upgradedVersion = upgradedVersion;
      }
      if (status === "removed") {
        packages[packageIndex].priorVersion = priorVersion;
      }
    } else {
      const pkg = {
        package: packageName,
        priorVersion,
        upgradedVersion,
      };
      packages.push(pkg);
    }
  }

  return packages;
};

const parsedOldPackageJson = parsePackageJson(process.argv[4]);
const parsedNewPackageJson = parsePackageJson(process.argv[5]);

const packageJsonDependencies = new Set([
  ...Object.keys(parsedOldPackageJson),
  ...Object.keys(parsedNewPackageJson),
]);

const parsedOldLockFile = parseLockFile(process.argv[2]);
const parsedNewLockFile = parseLockFile(process.argv[3]);

const diff = compareLockFiles(parsedOldLockFile, parsedNewLockFile);

// Filter diff to non-transitive packages
const filteredDiff = diff.filter((pkg) =>
  packageJsonDependencies.has(pkg.package)
);

// Print diff
console.log(JSON.stringify(filteredDiff, null, 2));
