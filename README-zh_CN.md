<div align="center">
  <p>
    <img src="https://img.shields.io/badge/version-1.1.0-blue.svg" alt="Version 1.2.1"/>
    <img src="https://img.shields.io/npm/dt/node-get-installed-apps" alt="downloads" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-success.svg" alt="Platform: Windows | macOS | Linux"/>
  </p>
</div>
<div align="center">

简体中文 | [English](https://github.com/grayhatdevelopers/node-get-installed-apps/blob/master/README.md)

</div>

# Get Installed Apps

使用 Node.js 获取已安装的应用程序和软件包。支持 Windows、macOS 和 Linux。

# 👨‍💻 安装

`npm install node-get-installed-apps`

# 🔌 使用方法

ES6 模块

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

如果您想单独使用 macOS 特定方法，可以这样做：

```js
import {getMacInstalledApps} from 'node-get-installed-apps'

getMacInstalledApps().then(apps => {
  console.log(apps)
})
```

`getMacInstalledApps` 有一个可选参数 directory，默认是 '/Applications'，您可以根据需要设置其他目录。

如果您想单独使用 Windows 特定方法，可以这样做：

```js
import {getWinInstalledApps} from 'node-get-installed-apps'

getWinInstalledApps().then(apps => {
  console.log(apps)
})
```

对于 Linux 特定方法：

```js
import {getLinuxInstalledApps} from 'node-get-installed-apps'

getLinuxInstalledApps().then(apps => {
  console.log(apps)
})
```

# ✅ 输出

返回一个应用程序或软件包数组及其识别属性。

为了在所有操作系统之间标准化类型，本包返回以下结构的数据：
```ts
type ReturnData = {
  appName: string;           // 应用程序名称
  appIdentifier: string;     // 应用程序标识符
  appVersion: string | null; // 应用程序版本
  installPath?: string | null; // 安装路径
  // 以上所有值根据检索数据使用的"方法"而有所不同

  platform: string; // 应用程序所在的平台
  method: string;   // 取决于检索信息的方法类型；在操作系统内会有所不同

  metadata: object; // "方法"返回的原始元数据
}
```

以下是针对 Visual Studio Code 的返回值示例，这些示例符合上述标准化的 `ReturnData` 结构：

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

# 🤔 工作原理

- macOS
  检索 'Applications' 下的软件文件目录。使用 'mdls' 获取软件文件的相关信息，然后提取相应的信息。如果 'mdls' 失败，则回退到 'plutil'。

- Windows
  通过读取注册表中的数据来检索软件信息。

- Linux
  通过查询 DPKG、APT、SNAP 和 Flatpak 中列出的条目来检索软件信息。

# 🛠 开发

```bash
git clone https://github.com/grayhatdevelopers/node-get-installed-apps.git
cd get-installed-apps
npm i
npm start
```

# 🙏 特别感谢

感谢：

- <a href="https://github.com/Xutaotaotao/">Xutaotaotao</a> 启动了这个项目。
<br/> <a href="https://github.com/Xutaotaotao/get-installed-apps">[原始分支]</a>

- [jbrink90](https://github.com/jbrink90) 提供的 Linux 支持