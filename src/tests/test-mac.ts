import { strict as assert } from 'assert';
import { getAppsFileInfo, getInstalledApps, parsePlutilData } from '../mac';

async function test() {
  // Test with a known app directory, e.g., Calculator
  const testApps = ['/Applications/Safari.app'];

  try {
    const result = await getAppsFileInfo(testApps);
    console.log('Test result:', result);

    assert.equal(result.length, 1);
    assert.equal(result[0].appName, 'Safari');
    assert.equal(result[0].appIdentifier, 'com.apple.Safari');
    assert.equal(result[0].installPath, '/Applications/Safari.app');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testAllApps() {
  try {
    const allApps = await getInstalledApps('/Applications');
    console.log('All Apps Test result count:', allApps.length);

    // Basic assertion: should retrieve info for multiple apps
    if (allApps.length > 10) {
      console.log('Successfully retrieved info for multiple apps');
    } else {
      console.log('Unexpectedly low number of apps retrieved');
    }

    const methods = new Set(allApps.map((app) => app.method));
    console.log('Resolution methods used:', [...methods].join(', '));

    // Regression: a partial Spotlight index must never attach one app's
    // metadata to another app's installPath
    for (const app of allApps) {
      const installPath = app.installPath ?? '';
      assert.ok(
        installPath.endsWith('.app'),
        `unexpected installPath: ${installPath}`,
      );
      if (app.method === 'mdls') {
        assert.equal(
          app.metadata.kMDItemFSName,
          installPath.split('/').pop(),
          `mdls metadata mismatched for ${installPath}`,
        );
      }
    }
    const safari = allApps.find((app) => app.appName === 'Safari');
    if (safari) {
      assert.equal(safari.installPath, '/Applications/Safari.app');
      assert.equal(safari.appIdentifier, 'com.apple.Safari');
      console.log('Safari metadata paired with its own installPath');
    }
  } catch (error) {
    console.error('All Apps test failed:', error);
  }
}

async function testPlutil() {
  const testApps = ['/Applications/Safari.app'];

  try {
    const result = await parsePlutilData(testApps);
    console.log('Plutil test result:', result);

    assert.equal(result.length, 1);
    assert.equal(result[0].appIdentifier, 'com.apple.Safari');
  } catch (error) {
    console.error('Plutil test failed:', error);
  }
}

async function runTests() {
  console.log('--- Running existing tests ---');
  await test();

  console.log('\n--- Running plutil test ---');
  await testPlutil();
  await testAllApps();
}

runTests();
