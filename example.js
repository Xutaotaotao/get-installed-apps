const { getInstalledApps } = require("./dist/index");
const fs = require("fs");
const path = require("path");

function getDirectoryFromPath(filePath) {
  return path.dirname(filePath);
}

function listExeFiles(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(`Error reading directory ${directoryPath}: ${err}`);
        return;
      }

      const exeFiles = files
        .filter(
          (file) =>
            path.extname(file).toLowerCase() === ".exe" &&
            !file.toLowerCase().includes("uni")
        )
        .map((file) => path.join(directoryPath, file));

      resolve(exeFiles);
    });
  });
}

const getAppLocation = async (app) => {
  let location = [];
  if (app.DisplayIcon && app.DisplayIcon.includes(".exe")) {
    location = app.DisplayIcon.split(",")[0];
  } else {
    if (app.UninstallString && app.UninstallString.includes(".exe")) {
      const uninstalllocation = app.UninstallString.split('"')[1];
      const directoryPath = uninstalllocation
        ? getDirectoryFromPath(uninstalllocation)
        : "";
      if (directoryPath) {
        const exeFiles = await listExeFiles(directoryPath);
        location = exeFiles;
      }
    }
  }
  return location;
};

getInstalledApps().then(async (apps) => {
  Promise.all(
    apps.filter(o => o.appPublisher && !o.appPublisher.includes('Microsoft')).map(async (o) => {
      const appLocation = await getAppLocation(o);
      return {
        ...o,
        appLocation,
      };
    })
  ).then((res) => {
    console.log(res);
  });
});
