import { getInstalledApps as getMacApps } from './mac';
import { getInstalledApps as getWinApps } from './win';
import { getInstalledApps as getLinuxApps } from './linux';

export async function getInstalledApps() {
  switch (process.platform) {
    case 'darwin':
      return getMacApps('/Applications');
    case 'win32':
      return getWinApps();
    case 'linux':
      return getLinuxApps();
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

export const getMacInstalledApps = getMacApps;
export const getWinInstalledApps = getWinApps;
export const getLinuxInstalledApps = getLinuxApps;
export * from './types';