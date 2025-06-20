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

    // Skip unchanged packages
    if (
      priorEntry &&
      upgradedEntry &&
      priorEntry.version === upgradedEntry.version
    ) {
      continue;
    }

    const existingPackage = packages.find(
      (pkg) => pkg.package === packageName
    );

    /**
     * A package could have multiple entries in JSON, so combine
     * the output.
     * 
     * This happens when the version is updated in package.json,
     * creating a new key, rather than keeping the prior key
     * and doing a version upgrade in yarn.lock only.
     */
    if (existingPackage) {
      if (!priorEntry) {
        existingPackage.upgradedVersion = upgradedVersion;
      }
      if (!upgradedEntry) {
        existingPackage.priorVersion = priorVersion;
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

/** 
 * Filter to only changed versions. This can happen if package.json
 * and yarn.lock are synced and the package was not actually updated.
 */ 
const filteredPackages = filteredDiff.filter((pkg) =>
  pkg.priorVersion !== pkg.upgradedVersion
);

// Print diff
console.log(JSON.stringify(filteredPackages, null, 2));
