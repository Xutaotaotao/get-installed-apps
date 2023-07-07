import {getInstalledApps as macGetInstalledApps} from './mac'
import {getInstalledApps as winGetInstalledApps} from './win'

export default function getInstalledApps() {
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