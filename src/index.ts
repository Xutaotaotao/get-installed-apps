import { getInstalledApps as macGetInstalledApps } from './mac'
import { getInstalledApps as winGetInstalledApps } from './win'

export function getMacInstalledApps(directory = "/Applications") {
  return macGetInstalledApps(directory)
}

export function getWinInstalledApps() {
  return winGetInstalledApps()
}