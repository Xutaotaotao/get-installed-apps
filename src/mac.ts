import { execFile, spawn } from "child_process";
import { readdir } from "fs/promises";
import { basename, join } from "path";
import { promisify } from "util";
import { MacMdlsMetadata, MacPlutilMetadata, ReturnData } from "./types";

const execFileAsync = promisify(execFile);

const MDLS_MAX_BUFFER = 64 * 1024 * 1024;

const MDLS_ATTRIBUTE_LINE = /^(\S+)\s*=\s*(.+)$/;

export async function getInstalledApps(
  directory: string,
): Promise<Array<ReturnData<"darwin", "mdls"> | ReturnData<"darwin", "plutil">>> {
  const directoryContents = await getDirectoryContents(directory);
  return getAppsFileInfo(directoryContents);
}

/**
 * getDirectoryContents
 * @param directory
 * @returns Absolute paths of the .app bundles inside the directory
 */
export async function getDirectoryContents(
  directory: string,
): Promise<Array<string>> {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.name.toLowerCase().endsWith(".app") &&
        (entry.isDirectory() || entry.isSymbolicLink()),
    )
    .map((entry) => join(directory, entry.name));
}

/**
 * getAppsFileInfo
 * @param appsFile - array of app bundle paths
 * @returns All apps fileInfo data, from mdls where the Spotlight index
 * covers the app and from plutil for the rest
 */
export async function getAppsFileInfo(
  appsFile: readonly string[],
): Promise<Array<ReturnData<"darwin", "mdls"> | ReturnData<"darwin", "plutil">>> {
  const mdlsApps = await getMdlsAppsInfo(appsFile);

  const unresolved = appsFile.filter((app) => !mdlsApps.has(app));
  const plutilApps = new Map(
    (await parsePlutilData(unresolved)).map((app) => [app.installPath, app]),
  );

  return appsFile
    .map((app) => mdlsApps.get(app) ?? plutilApps.get(app))
    .filter(
      (app): app is ReturnData<"darwin", "mdls"> | ReturnData<"darwin", "plutil"> =>
        app !== undefined,
    );
}

async function getMdlsAppsInfo(
  appsFile: readonly string[],
): Promise<Map<string, ReturnData<"darwin", "mdls">>> {
  if (appsFile.length === 0) {
    return new Map();
  }

  try {
    const { stdout } = await execFileAsync("mdls", [...appsFile], {
      encoding: "utf8",
      maxBuffer: MDLS_MAX_BUFFER,
    });
    return pairMdlsBlocksToPaths(splitMdlsOutput(stdout), appsFile);
  } catch {
    return new Map();
  }
}

// Batch mdls output has no separator between files; attributes are printed
// sorted, so _kMDItemDisplayNameWithExtensions always starts a new block.
function splitMdlsOutput(stdout: string): string[][] {
  const blocks: string[][] = [];
  let currentBlock: string[] | undefined;

  for (const line of stdout.split(/\r?\n/)) {
    if (line.startsWith("_kMDItemDisplayNameWithExtensions")) {
      currentBlock = [];
      blocks.push(currentBlock);
    }
    if (currentBlock && line.trim()) {
      currentBlock.push(line);
    }
  }

  return blocks;
}

// mdls silently omits blocks for unindexed files, so the nth block is not
// necessarily the nth path. Blocks keep input order; a path claims the next
// unconsumed block only when it names that exact bundle (kMDItemFSName).
function pairMdlsBlocksToPaths(
  blocks: readonly string[][],
  appsFile: readonly string[],
): Map<string, ReturnData<"darwin", "mdls">> {
  const parsedBlocks = blocks.map(parseMdlsBlock);
  const paired = new Map<string, ReturnData<"darwin", "mdls">>();
  let blockIndex = 0;

  for (const app of appsFile) {
    if (blockIndex >= parsedBlocks.length) {
      break;
    }

    const metadata = parsedBlocks[blockIndex];
    if (metadata.kMDItemFSName !== basename(app)) {
      continue;
    }

    blockIndex += 1;
    if (!metadata.kMDItemDisplayName) {
      continue; // block is this app's but incomplete; leave it for plutil
    }

    paired.set(app, toMdlsAppInfo(metadata, app));
  }

  return paired;
}

function parseMdlsBlock(lines: readonly string[]): MacMdlsMetadata {
  const metadata: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(MDLS_ATTRIBUTE_LINE);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2].trim();
    if (value === "(null)" || value === "(") {
      continue;
    }
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    metadata[key] = value;
  }

  return metadata;
}

function toMdlsAppInfo(
  metadata: MacMdlsMetadata,
  installPath: string,
): ReturnData<"darwin", "mdls"> {
  const aliasedMetadata: MacMdlsMetadata = {
    ...metadata,
    appName: metadata.kMDItemDisplayName,
    appVersion: metadata.kMDItemVersion,
    appIdentifier: metadata.kMDItemCFBundleIdentifier,
    appInstallDate: metadata.kMDItemDateAdded,
  };

  return {
    appName: metadata.kMDItemDisplayName || null,
    appIdentifier: metadata.kMDItemCFBundleIdentifier || null,
    appVersion: metadata.kMDItemVersion || null,
    platform: "darwin",
    method: "mdls",
    metadata: aliasedMetadata,
    installPath,
  };
}

/**
 * parsePlutilData
 * @param appsFile - array of app paths
 * @returns All apps fileInfo data using plutil
 */
export async function parsePlutilData(
  appsFile: readonly string[],
): Promise<Array<ReturnData<"darwin", "plutil">>> {
  const plutilPromises = appsFile.map((app) => {
    return new Promise<ReturnData<"darwin", "plutil"> | null>((resolve) => {
      const runPlutilShell = spawn("plutil", [
        "-p",
        `${app}/Contents/Info.plist`,
      ]);
      let stdoutData = "";

      runPlutilShell.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      runPlutilShell.on("close", (code) => {
        if (code === 0) {
          resolve(toPlutilAppInfo(stdoutData, app));
        } else {
          resolve(null);
        }
      });

      runPlutilShell.on("error", () => resolve(null));
    });
  });

  const results = await Promise.all(plutilPromises);
  return results.filter((r): r is ReturnData<"darwin", "plutil"> => r !== null);
}

function toPlutilAppInfo(
  stdoutData: string,
  installPath: string,
): ReturnData<"darwin", "plutil"> {
  const appData: Record<string, string> = {};

  for (const line of stdoutData.split(/\r?\n/)) {
    const match = line.match(/"([^"]+)"\s*=>\s*(.+)/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      appData[key] = value;
    }
  }

  const metadata: MacPlutilMetadata = { ...appData };
  return {
    appName:
      appData.CFBundleDisplayName ||
      appData.CFBundleName ||
      appData.CFBundleExecutable ||
      null,
    appVersion:
      appData.CFBundleShortVersionString || appData.CFBundleVersion || null,
    appIdentifier: appData.CFBundleIdentifier || null,
    platform: "darwin",
    method: "plutil",
    metadata,
    installPath,
  };
}
