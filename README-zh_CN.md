<div align="center">
  <p>
    <img src="https://img.shields.io/badge/version-1.1.0-blue.svg" alt="Version 1.2.1"/>
    <!-- <a href="https://github.com/jbrink90/get-installed-apps/actions/workflows/main.yml"><img src="https://github.com/jbrink90/get-installed-apps/actions/workflows/main.yml/badge.svg" alt="build status"></a> -->
    <img src="https://img.shields.io/npm/dt/get-installed-apps" alt="downloads" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-success.svg" alt="Platform: Windows | macOS | Linux"/>
  </p>
</div>
<div align="center">

简体中文 | [English](https://github.com/jbrink90/get-installed-apps/blob/master/README.md)

</div>

# Get Installed Apps (Linux 支持/发布)

该工具使用 Node.js 获取计算机上已安装的软件列表，并支持 Windows、Linux 和 Mac 平台。

# 👨‍💻 安装

`npm install get-installed-apps-linux`

# 🔌 用法

ES6 Module

```
import {getInstalledApps} from 'get-installed-apps-linux'

getInstalledApps().then(apps => {
  console.log(apps)
})
```

CommonJS

```
const {getInstalledApps} = require('get-installed-apps-linux')
getInstalledApps().then(apps => {
  console.log(apps)
})
```

如果你只想在 mac 平台上使用，可以这么做：

```
import {getMacInstalledApps} from 'get-installed-apps-linux'

getMacInstalledApps().then(apps => {
  console.log(apps)
})
```

`getMacInstalledApps` 有一个可选参数 directory, 默认是'/Applications',你如果还需要获取其他目录的 app,可以自己设置。

如果你只想在 windows 平台上使用，可以这么做：

```
import {getWinInstalledApps} from 'get-installed-apps-linux'

getWinInstalledApps().then(apps => {
  console.log(apps)
})
```

对于特定于 Linux 的方法

```
import {getLinuxInstalledApps} from 'get-installed-apps-linux'

getLinuxInstalledApps().then(apps => {
  console.log(apps)
})
```

# ✅ 输出

返回一个数组。

下面是一个 vscode 的软件信息返回值， appName, appIdentifier, appInstallDate, appVersion 这四个值是新的属性，主要保证双端统一。

- macOS

```
  [{
    _kMDItemDisplayNameWithExtensions: 'Visual Studio Code.app',
    appName: 'Visual Studio Code',
    kMDItemAppStoreCategory: '开发者工具',
    kMDItemAppStoreCategoryType: 'public.app-category.developer-tools',
    kMDItemCFBundleIdentifier: 'com.microsoft.VSCode',
    appIdentifier: 'com.microsoft.VSCode',
    kMDItemContentCreationDate: '2023-06-07 21:45:16 +0000',
    kMDItemContentCreationDate_Ranking: '2023-06-07 00:00:00 +0000',
    kMDItemContentModificationDate: '2023-06-07 21:45:16 +0000',
    kMDItemContentType: 'com.apple.application-bundle',
    kMDItemCopyright: 'Copyright',
    kMDItemDateAdded: '2023-06-20 11:13:54 +0000',
    appInstallDate: '2023-06-20 11:13:54 +0000',
    kMDItemDisplayName: 'Visual Studio Code',
    kMDItemDocumentIdentifier: '0',
    kMDItemFSContentChangeDate: '2023-06-07 21:45:16 +0000',
    kMDItemFSCreationDate: '2023-06-07 21:45:16 +0000',
    kMDItemFSFinderFlags: '0',
    kMDItemFSInvisible: '0',
    kMDItemFSIsExtensionHidden: '1',
    kMDItemFSLabel: '0',
    kMDItemFSName: 'Visual Studio Code.app',
    kMDItemFSNodeCount: '1',
    kMDItemFSOwnerGroupID: '20',
    kMDItemFSOwnerUserID: '501',
    kMDItemFSSize: '544298942',
    kMDItemInterestingDate_Ranking: '2023-07-06 00:00:00 +0000',
    kMDItemKind: '应用程序',
    kMDItemLastUsedDate: '2023-07-06 09:53:00 +0000',
    kMDItemLastUsedDate_Ranking: '2023-07-06 00:00:00 +0000',
    kMDItemLogicalSize: '544298942',
    kMDItemPhysicalSize: '546988032',
    kMDItemUseCount: '9',
    kMDItemVersion: '1.79.0',
    appVersion: '1.79.0'
  }],
```

- Windows

```
[
  {
    appIdentifier: '{771FD6B0-FA20-440A-A002-3B3BAC16DC50}_is1',
    'Inno Setup: Setup Version': '6.0.5 (u)',
    'Inno Setup: App Path': 'D:\\software\\Microsoft VS Code',
    InstallLocation: 'D:\\software\\Microsoft VS Code\\',
    'Inno Setup: Icon Group': 'Visual Studio Code',
    'Inno Setup: User': 'CYJ',
    'Inno Setup: Selected Tasks': 'associatewithfiles,addtopath,runcode',
    'Inno Setup: Deselected Tasks': 'desktopicon,addcontextmenufiles,addcontextmenufolders',
    'Inno Setup: Language': 'simplifiedChinese',
    DisplayName: 'Microsoft Visual Studio Code (User)',
    appName: 'Microsoft Visual Studio Code (User)',
    DisplayIcon: 'D:\\software\\Microsoft VS Code\\Code.exe',
    UninstallString: '"D:\\software\\Microsoft VS Code\\unins000.exe"',
    QuietUninstallString: '"D:\\software\\Microsoft VS Code\\unins000.exe" /SILENT',
    DisplayVersion: '1.80.0',
    appVersion: '1.80.0',
    Publisher: 'Microsoft Corporation',
    appPublisher: 'Microsoft Corporation',
    URLInfoAbout: 'https://code.visualstudio.com/',
    HelpLink: 'https://code.visualstudio.com/',
    URLUpdateInfo: 'https://code.visualstudio.com/',
    NoModify: '0x1',
    NoRepair: '0x1',
    InstallDate: '20230709',
    appInstallDate: '20230709',
    MajorVersion: '0x1',
    MinorVersion: '0x50',
    VersionMajor: '0x1',
    VersionMinor: '0x50',
    EstimatedSize: '0x55f14'
  }
]
```

- Linux

```
[
  {
    name: 'fail2ban',
    packageId: 'fail2ban',
    version: '1.0.2-2',
    type: 'dpkg',
    architecture: 'all',
    maintainer: 'Debian Python Team <team+python@tracker.debian.org>',
    section: 'net',
    description: 'ban hosts that cause multiple authentication errors',
    installed_size: 2180096,
    repository: null,
    license: null,
    install_date: null,
    is_system_package: 0,
    is_auto_installed: 0
  }
]
```

# 🤔 原理

- macOS
  通过获取 Applications 文件夹下所有的文件，然后通过 mdls 获取文件的属性，然后解析相应的信息，形成结构的 app 信息的对象。

- Windows
  主要是读取注册表的数据，然后解析相应的信息，形成结构的 app 信息的对象。

- Linux
  通过查询 DPKG、APT、SNAP 和 Flatpak 中列出的条目来检索软件信息。

# 🛠 本地开发

```
git clone https://github.com/jbrink90/get-installed-apps.git

cd get-installed-apps

npm i

npm start

```

# 🙏 特别感谢

感谢 <a href="https://github.com/Xutaotaotao/">Xutaotaotao</a> 启动了这个项目。
<br/>
<a href="https://github.com/Xutaotaotao/get-installed-apps">[原始分支]</a>
