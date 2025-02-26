const { getInstalledApps } = require("./dist/index");

console.time("test");
getInstalledApps().then((apps) => {
  console.log(apps);

  console.timeEnd("test");
});
