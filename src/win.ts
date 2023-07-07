import { Registry } from "./utils/registry";

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

export function getAppData(appKey) {
  return new Promise((resolve) => {
    let app: any = {};
    try {
      let keyArr = appKey.key.split("\\");
      app.appIdentifier = keyArr[keyArr.length - 1];
      appKey.values((e: any, items: any) => {
        if (items) {
          for (var i = 0; i < items.length; i++) {
            app[items[i].name] = items[i].value
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
        resolve(app);
      });
    } catch (err) {
      resolve(app);
    }
  });
}
