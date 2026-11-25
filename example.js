import { getInstalledApps } from "./dist/index.js";

(async () => {
  const apps = await getInstalledApps();
  console.log(apps);
})();
