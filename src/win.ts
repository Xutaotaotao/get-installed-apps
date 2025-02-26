import { HKEY, enumerateKeys, enumerateValues } from "registry-js";

// 定义应用信息类型
export interface AppInfo {
  appIdentifier: string;
  appName?: string;
  appVersion?: string;
  appInstallDate?: string;
  appPublisher?: string;
  [key: string]: any;
}

// 需要查询的注册表路径配置
const REGISTRY_PATHS = [
  {
    hive: HKEY.HKEY_LOCAL_MACHINE,
    key: "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
  },
  {
    hive: HKEY.HKEY_LOCAL_MACHINE,
    key: "SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
  },
  {
    hive: HKEY.HKEY_CURRENT_USER,
    key: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
  },
  {
    hive: HKEY.HKEY_CURRENT_USER,
    key: "SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
  },
];

export async function getInstalledApps(): Promise<AppInfo[]> {
  try {
    const results = await Promise.all(
      REGISTRY_PATHS.map((path) => getApps(path.hive, path.key))
    );
    return results.flat().filter((app) => app.appName);
  } catch (error) {
    console.error("Error fetching installed apps:", error);
    return [];
  }
}

export async function isAppInstalled(name: string): Promise<boolean> {
  const apps = await getInstalledApps();
  return apps.some((app) => app.appName === name);
}

async function getApps(hive: HKEY, keyPath: string): Promise<AppInfo[]> {
  try {
    const subKeys = enumerateKeys(hive, keyPath);
    const apps = await Promise.all(
      subKeys.map((subKey) => getAppData(hive, `${keyPath}\\${subKey}`))
    );

    return apps.filter((app) => app.appName);
  } catch (error) {
    console.error(`Error reading registry path ${keyPath}:`, error);
    return [];
  }
}

async function getAppData(hive: HKEY, keyPath: string): Promise<AppInfo> {
  const app: AppInfo = {
    appIdentifier: keyPath.split("\\").pop() || "",
  };

  try {
    const values = enumerateValues(hive, keyPath);

    for (const value of values) {
      if (!value) {
        continue;
      }
      switch (value.name) {
        case "DisplayName":
          app.appName = String(value.data);
          break;
        case "DisplayVersion":
          app.appVersion = String(value.data);
          break;
        case "InstallDate":
          app.appInstallDate = String(value.data);
          break;
        case "Publisher":
          app.appPublisher = String(value.data);
          break;
      }
      // 保留所有原始值
      app[value.name] = String(value.data);
    }
  } catch (error) {
    const values = enumerateValues(hive, keyPath);
    console.error(
      `Error reading app data from ${keyPath}:`,
      error,
      `Values`,
      values
    );
  }

  return app;
}
