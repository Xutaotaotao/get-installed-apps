import { Registry } from "./utils/registry";
import { ReturnData } from "./types";

export function getInstalledApps() {
  return new Promise(async (resolve, reject) => {
    let HKLM_SOFTWARE_Microsoft: any = [];
    let HKLM_SOFTWARE_Wow6432Node_Microsoft: any = [];
    let HKCU_SOFTWARE_Microsoft: any = [];
    let HKCU_SOFTWARE_Wow6432Node_Microsoft: any = [];
    try {
      HKLM_SOFTWARE_Microsoft = await getApps(
        new Registry({
          hive: Registry.HKLM,
          key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
        })
      );
    } catch (err) {
      console.error("HKLM_SOFTWARE_Microsoft err", err);
    }

    try {
      HKLM_SOFTWARE_Wow6432Node_Microsoft = await getApps(
        new Registry({
          hive: Registry.HKLM,
          key: "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
        })
      );
    } catch (err) {
      console.error("HKLM_SOFTWARE_Wow6432Node_Microsoft err", err);
    }

    try {
      HKCU_SOFTWARE_Microsoft = await getApps(
        new Registry({
          hive: Registry.HKCU,
          key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
        })
      );
    } catch (err) {
      console.error("HKCU_SOFTWARE_Microsoft err", err);
    }

    try {
      HKCU_SOFTWARE_Wow6432Node_Microsoft = await getApps(
        new Registry({
          hive: Registry.HKCU,
          key: "\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
        })
      );
    } catch (err) {
      console.error("HKCU_SOFTWARE_Wow6432Node_Microsoft err", err);
    }

    resolve(
      [
        ...HKLM_SOFTWARE_Microsoft,
        ...HKLM_SOFTWARE_Wow6432Node_Microsoft,
        ...HKCU_SOFTWARE_Microsoft,
        ...HKCU_SOFTWARE_Wow6432Node_Microsoft,
      ].filter((o) => o.appName)
    );
  });
}

export function getApps(regKey: any) {
  return new Promise((resolve) => {
    try {
      regKey.keys(function (err: Error, key: any) {
        if (err) {
          console.error(err);
          resolve([]);
        }
        if (key) {
          const getAppItems = key.map((o: any) => {
            return getAppData(o);
          });
          Promise.all(getAppItems).then((res) => {
            resolve(res);
          });
        } else {
          resolve([]);
        }
      });
    } catch (err) {
      console.error("getAppItems err", err);
      resolve([]);
    }
  });
}

/**
 * Extracts the directory path from a file path string
 */
function extractDirectoryPath(filePath: string | undefined): string | null {
  if (!filePath) return null;
  
  // Remove surrounding quotes if present
  let cleanPath = filePath.replace(/^["']|["']$/g, '').trim();
  
  // Handle paths with arguments (e.g., "C:\path\to\app.exe" --arg)
  const exeMatch = cleanPath.match(/^(.+\.exe)/i);
  if (exeMatch) {
    cleanPath = exeMatch[1];
  }
  
  // Extract directory from file path
  const lastBackslash = cleanPath.lastIndexOf('\\');
  const lastForwardSlash = cleanPath.lastIndexOf('/');
  const lastSeparator = Math.max(lastBackslash, lastForwardSlash);
  
  if (lastSeparator > 0) {
    return cleanPath.substring(0, lastSeparator);
  }
  
  return null;
}

/**
 * Checks if the uninstall string refers to a common system uninstaller
 */
function isSystemUninstaller(uninstallStr: string): boolean {
  const lower = uninstallStr.toLowerCase();
  return lower.includes('msiexec') || lower.includes('rundll32') || lower.includes('control.exe');
}

/**
 * Derives the install path from available registry values
 */
function deriveInstallPath(app: any): string | null {
  // Priority 1: Direct InstallLocation
  if (app.InstallLocation && app.InstallLocation.trim()) {
    return app.InstallLocation.trim();
  }
  
  // Priority 2: Inno Setup App Path
  if (app['Inno Setup: App Path'] && app['Inno Setup: App Path'].trim()) {
    return app['Inno Setup: App Path'].trim();
  }
  
  // Priority 3: Extract from DisplayIcon
  if (app.DisplayIcon) {
    const iconPath = extractDirectoryPath(app.DisplayIcon);
    if (iconPath) return iconPath;
  }
  
  // Priority 4: Extract from UninstallString (skip if system uninstaller)
  if (app.UninstallString && !isSystemUninstaller(app.UninstallString)) {
    const uninstallPath = extractDirectoryPath(app.UninstallString);
    if (uninstallPath) return uninstallPath;
  }
  
  // Priority 5: Extract from QuietUninstallString (skip if system uninstaller)
  if (app.QuietUninstallString && !isSystemUninstaller(app.QuietUninstallString)) {
    const quietUninstallPath = extractDirectoryPath(app.QuietUninstallString);
    if (quietUninstallPath) return quietUninstallPath;
  }
  
  return null;
}

export function getAppData(appKey) {
  return new Promise((resolve) => {
    let app: any = {};
    try {
      let keyArr = appKey.key.split("\\");
      app.appIdentifier = keyArr[keyArr.length - 1];
      appKey.values((e: any, items: any) => {
        if (items) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].value) {
              app[items[i].name] = items[i].value;
            }
            if (items[i].name === "DisplayName") {
              app.appName = items[i].value;
            }
            if (items[i].name === "DisplayVersion") {
              app.appVersion = items[i].value;
            }
            if (items[i].name === "InstallDate") {
              app.appInstallDate = items[i].value;
            }
            if (items[i].name === "Publisher") {
              app.appPublisher = items[i].value;
            }
          }
        }
        
        // Dynamically derive install path from available registry values
        const derivedInstallPath = deriveInstallPath(app);
        
        let appreturn: ReturnData<"win32", "registry"> = {
          appName: app.appName || null,
          appIdentifier: app.appIdentifier || null,
          platform: "win32",
          appVersion: app.appVersion || null,
          method: "registry",
          metadata: app,
          installPath: derivedInstallPath,
        };
        resolve(appreturn);
      });
    } catch (err) {
     resolve({
        appName: "",
        appIdentifier: "",
        installPath: "",
        platform: "win32",
        appVersion: app.appVersion || null,
        metadata: {},
        method: "registry",
        
      });
    }
  });
}