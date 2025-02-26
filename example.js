const { getInstalledApps } = require("./dist/index");

getInstalledApps().then((apps) => {
  console.log(apps);
});
