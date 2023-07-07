const {getInstalledApps} = require('./dist/index')
getInstalledApps().then(res => {
  console.log(res)
})