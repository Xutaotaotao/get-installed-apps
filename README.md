<div align="center">
  <p>
    <img src="https://img.shields.io/badge/version-1.1.0-blue.svg" alt="Version 1.1.0"/>
    <a href="https://github.com/Xutaotaotao/get-installed-apps/actions/workflows/main.yml"><img src="https://github.com/Xutaotaotao/get-installed-apps/actions/workflows/main.yml/badge.svg" alt="build status"></a>
    <img src="https://img.shields.io/npm/dt/get-installed-apps" alt="downloads" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey.svg" alt="Platform: Windows | macOS"/>
  </p>
</div>
<div align="center">

  English | [简体中文](https://github.com/Xutaotaotao/get-installed-apps/blob/master/README-zh_CN.md)
  
</div>

# Get Insatlled Apps


Get installed app using Node.js, supporting Windows and macOS.

# 👨‍💻 Install

`npm install get-installed-apps`

# 🔌 Usage

ES6 Module 

```
import {getInstalledApps} from 'get-installed-apps'

getInstalledApps().then(apps => {
  console.log(apps)
})
```

CommonJS

```
const {getInstalledApps} = require('get-installed-apps')
getInstalledApps().then(apps => {
  console.log(apps)
})
```

If you want to use macOS-specific methods separately, you can do it like this.


```
import {getMacInstalledApps} from 'get-installed-apps'

getMacInstalledApps().then(apps => {
  console.log(apps)
})
```

`getMacInstalledApps` has a optional parameter directory, defalut is '/Applications',you can set it what you need.

If you want to use windows-specific methods separately, you can do it like this.

```
import {getWinInstalledApps} from 'get-installed-apps'

getWinInstalledApps().then(apps => {
  console.log(apps)
})
```

# ✅ OUTPUT

Return an array.

This is the return value for Visual Studio Code,the properties appName, appIdentifier, appInstallDate, and appVersion are overridden.

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


# 🤔 How it works

- macOS
Retrieve the software file directory under 'Applications', use 'mdls' to fetch relevant information about the software files, and then extract the corresponding information.
- Windows
Retrieve software information by reading data from the registry.

# 📱 Contact me

Use WeChat to contact me

<img src="https://xutaotaotao.github.io/wx_qr.jpg" />

# 🛠 Development
```
git clone https://github.com/Xutaotaotao/get-installed-apps.git

cd get-installed-apps

npm i

npm start

```