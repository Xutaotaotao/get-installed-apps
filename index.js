const {getInstalledApps} = require('./dist/index')
console.log(111)
getInstalledApps().then(res => {
  console.log(res[1].appName)
})