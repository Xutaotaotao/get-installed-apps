import {getInstalledApps as macGetInstalledApps} from './mac'
import {getInstalledApps as winGetInstalledApps} from './win'

export function getInstalledApps() {
  if (process.platform === 'darwin') {
    return macGetInstalledApps()
  } else if (process.platform === 'win32') {
    return winGetInstalledApps()
  } else {
    return new Promise((_resolve,reject) => {
      reject('Platform not supported')
    })
  }
}

export function getMacInstalledApps () {
  return macGetInstalledApps()
}

export function getWinInstalledApps () {
  return winGetInstalledApps()
}