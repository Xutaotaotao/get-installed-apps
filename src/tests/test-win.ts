// Updated test-win.ts with registry tests added
import { getInstalledApps, getApps, getAppData } from '../win';
import { Registry } from '../utils/registry';

async function testGetInstalledApps() {
  try {
    const allApps = await getInstalledApps() as any[];
    console.log('All Apps Test result count:', allApps.length);

    // Basic assertion: should retrieve info for multiple apps
    if (allApps.length > 0) {
      console.log('Successfully retrieved info for apps');
      // Log first few apps for verification
      console.log('First few apps:', allApps.slice(0, 3).map(app => ({
        name: app.appName,
        version: app.appVersion,
        identifier: app.appIdentifier
      })));
    } else {
      console.log('No apps retrieved');
    }
  } catch (error) {
    console.error('All Apps test failed:', error);
  }
}

async function testGetApps() {
  try {
    const regKey = new Registry({
      hive: Registry.HKLM,
      key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
    });

    const apps = await getApps(regKey) as any[];
    console.log('Get Apps Test result count:', apps.length);

    if (apps.length > 0) {
      console.log('Successfully retrieved apps from registry');
      console.log('First app:', {
        name: apps[0].appName,
        version: apps[0].appVersion,
        identifier: apps[0].appIdentifier
      });
    } else {
      console.log('No apps retrieved from registry');
    }
  } catch (error) {
    console.error('Get Apps test failed:', error);
  }
}

async function testGetAppData() {
  return new Promise<void>((resolve) => {
    try {
      const regKey = new Registry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
      });

      // Get the first available app key to test getAppData
      regKey.keys(async (err: Error, keys: any) => {
        if (err) {
          console.error('Failed to get registry keys for getAppData test:', err);
          resolve();
          return;
        }

        if (keys && keys.length > 0) {
          const firstKey = keys[0];
          console.log('Testing getAppData with key:', firstKey.key);

          const appData = await getAppData(firstKey) as any;
          console.log('Get App Data result:', {
            appName: appData.appName,
            appIdentifier: appData.appIdentifier,
            installPath: appData.installPath,
            platform: appData.platform,
            method: appData.method
          });

          // Basic validation
          if (appData.appName || appData.appIdentifier) {
            console.log('Successfully retrieved app data');
          } else {
            console.log('App data retrieval returned empty result');
          }
        } else {
          console.log('No registry keys available for getAppData test');
        }
        resolve();
      });
    } catch (error) {
      console.error('Get App Data test failed:', error);
      resolve();
    }
  });
}

async function runTests() {
  console.log('--- Running Windows registry tests ---');

  console.log('\n--- Testing getInstalledApps ---');
  await testGetInstalledApps();

  console.log('\n--- Testing getApps ---');
  await testGetApps();

  console.log('\n--- Testing getAppData ---');
  await testGetAppData();
}

runTests();