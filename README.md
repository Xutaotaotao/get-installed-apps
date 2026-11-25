<div align="center">
  <p>
    <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version 2.0.0"/>
    <img src="https://img.shields.io/npm/dt/node-get-installed-apps" alt="downloads" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-success.svg" alt="Platform: Windows | macOS | Linux"/>
  </p>
</div>
<div align="center">

English | [简体中文](https://github.com/grayhatdevelopers/node-get-installed-apps/blob/master/README-zh_CN.md)

</div>

# Get Installed Apps

Get installed apps and packages using Node.js. Supports Windows, macOS, and Linux.

> **Note:** This operation is intensive due to heavy file I/O. We recommend caching the retrieved information instead of calling these functions repeatedly.

# 👨‍💻 Installation

`npm install node-get-installed-apps`

# 🔌 Usage

ES6 Module

```js
import {getInstalledApps} from 'node-get-installed-apps'

getInstalledApps().then(apps => {
  console.log(apps)
})
```

CommonJS

```js
const {getInstalledApps} = require('node-get-installed-apps')
getInstalledApps().then(apps => {
  console.log(apps)
})
```

If you want to use macOS-specific methods separately, you can do it like this.

```js
import {getMacInstalledApps} from 'node-get-installed-apps'

getMacInstalledApps().then(apps => {
  console.log(apps)
})
```

`getMacInstalledApps` has a optional parameter directory. The default is '/Applications', you can set it to what you need.

If you want to use Windows-specific methods separately, you can do it like this.

```js
import {getWinInstalledApps} from 'node-get-installed-apps'

getWinInstalledApps().then(apps => {
  console.log(apps)
})
```

And for Linux-specific methods:

```js
import {getLinuxInstalledApps} from 'node-get-installed-apps'

getLinuxInstalledApps().then(apps => {
  console.log(apps)
})
```

# ✅ OUTPUT

Returns an array of applications or packages and their identifying attributes.

To standardize types across all operating, this package returns data in a structure like:
```ts
type ReturnData = {
  appName: string;
  appIdentifier: string;
  appVersion: string | null;
  installPath?: string | null;
  // the values of all the above vary based on the "method" used to retrieve the data

  platform: string; // which platform the app exists on
  method: string; // depends on the type of method used to retrieve the info; varies within the os

  metadata: object; // the raw metadata returned by the "method"
}
```

This is the return value for Visual Studio Code, the properties appName, appIdentifier, appInstallDate, and appVersion are overridden.


## macOS

```ts
[
  {
    appName: "Visual Studio Code",
    appIdentifier: "com.microsoft.VSCode",
    appVersion: "1.79.0",
    installPath: "/Applications/Visual Studio Code.app",
    platform: "macOS",
    method: "mdls",
    metadata: {
      _kMDItemDisplayNameWithExtensions: "Visual Studio Code.app",
      kMDItemCFBundleIdentifier: "com.microsoft.VSCode",
      kMDItemVersion: "1.79.0",
      kMDItemKind: "应用程序",
      kMDItemContentType: "com.apple.application-bundle",
      kMDItemDateAdded: "2023-06-20 11:13:54 +0000",
      kMDItemLastUsedDate: "2023-07-06 09:53:00 +0000",
      kMDItemPhysicalSize: "546988032",
      kMDItemUseCount: "9"
    }
  }
]
```

## Windows

```ts
[
  {
    appName: "Microsoft Visual Studio Code (User)",
    appIdentifier: "{771FD6B0-FA20-440A-A002-3B3BAC16DC50}_is1",
    appVersion: "1.80.0",
    installPath: "D:\\software\\Microsoft VS Code\\",
    platform: "Windows",
    method: "registry",
    metadata: {
      DisplayName: "Microsoft Visual Studio Code (User)",
      DisplayVersion: "1.80.0",
      Publisher: "Microsoft Corporation",
      InstallLocation: "D:\\software\\Microsoft VS Code\\",
      DisplayIcon: "D:\\software\\Microsoft VS Code\\Code.exe",
      UninstallString: "\"D:\\software\\Microsoft VS Code\\unins000.exe\"",
      InstallDate: "20230709",
      URLInfoAbout: "https://code.visualstudio.com/"
    }
  }
]
```

## Linux

```ts
[
  {
    appName: "fail2ban",
    appIdentifier: "fail2ban",
    appVersion: "1.0.2-2",
    installPath: null,
    platform: "Linux",
    method: "dpkg",
    metadata: {
      packageId: "fail2ban",
      version: "1.0.2-2",
      architecture: "all",
      maintainer: "Debian Python Team <team+python@tracker.debian.org>",
      section: "net",
      description: "ban hosts that cause multiple authentication errors",
      installed_size: 2180096,
      is_system_package: 0,
      is_auto_installed: 0
    }
  }
]
```


# 🤔 How it works

- macOS
  Scans 'Applications' for .app bundles. Uses 'mdls' (Spotlight) to fetch relevant information about each bundle. Any app missing from the Spotlight index or all apps, if 'mdls' fails entirely, then resolved by reading its Info.plist via 'plutil' instead.
- Windows
  Retrieves software information by reading data from the registry.
- Linux
  Retrieves software information by querying entries listed in DPKG, APT, SNAP, and Flatpak.

# 🛠 Development

```bash
git clone https://github.com/grayhatdevelopers/node-get-installed-apps.git
cd get-installed-apps
npm i
npm start
```

# 🙏 Special Thanks

Thank you to:

- <a href="https://github.com/Xutaotaotao/">Xutaotaotao</a> for kicking off this project.
<br/> <a href="https://github.com/Xutaotaotao/get-installed-apps">[Original branch]</a>

- [jbrink90](https://github.com/jbrink90) for the Linux support
