import { getInstalledApps } from '../index';

export type InstalledApp = {
  appName: string;
  appVersion: string;
  appIdentifier: string;
  [key: string]: any; // allow any other properties
};

// works for macos, win and linux
export async function isAppInstalled(appName: string): Promise<boolean> {

  let foundApp;
  
  foundApp = await getApp(appName)

  if (foundApp) {
    console.log(`App '${appName}' is installed.`);
    return true
  }

  console.log(`App '${appName}' is not installed.`);
  return false;
}

// @TODO: again, another shitty caching method. Use Redux!
let installedApps; 

// works for win and macos
export async function getApp(appName: string): Promise<InstalledApp | undefined> {
  const platform = process.platform;
  
  let foundApp;

  if (installedApps === undefined || installedApps.length === 0) {
    console.log('Loading installed apps...');
    installedApps = await getInstalledApps() as InstalledApp[];
    console.log(`Loaded ${installedApps.length} installed apps.`);
  }


  foundApp = installedApps.find(installedApp => {
    return (
        installedApp.appName?.toLowerCase() === appName.toLowerCase()
        ||
        installedApp.appIdentifier?.toLowerCase() === appName.toLowerCase()
      )}
    )
  
  if (foundApp) {
    console.log(`Found exact match for '${appName}': ${foundApp.appName}`);
    console.log(`Install path: ${foundApp.installPath}`);
      console.log(`Method: ${foundApp.method}`);

  } else {
    foundApp = installedApps.find(installedApp => (
          installedApp.appName?.toLowerCase().includes(appName.toLowerCase())
          ||
          installedApp.appIdentifier?.toLowerCase().includes(appName.toLowerCase())
        )
    )
    if (foundApp) {
      console.log(`Found partial match for '${appName}': ${foundApp.appName}`);
      console.log(`Install path: ${foundApp.installPath}`);
      console.log(`Method: ${foundApp.method}`);
    } else {
      console.log(`No match found for '${appName}'.`);
    }
  }
  
  return foundApp;
}

// Test the functions
(async () => {
  console.log('Testing isAppInstalled for "activitywatch":');
  const result = await isAppInstalled('activitywatch');
  console.log('Result:', result);
})();