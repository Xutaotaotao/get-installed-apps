# Get Insatlled Apps

Get installed app using Node.js, supporting Windows and macOS.

# 👨‍💻 Install

Via npm:

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

If you want to use windows-specific methods separately, you can do it like this.

```
import {getWinInstalledApps} from 'get-installed-apps'

getWinInstalledApps().then(apps => {
  console.log(apps)
})
```

# ✅ OUTPUT

Return an array.

- macOS

This is the return value for Visual Studio Code,the properties appName, appIdentifier, appInstallDate, and appVersion are overridden.

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

# 🤔 How it works

- macOS
Retrieve the software file directory under 'Applications', use 'mdls' to fetch relevant information about the software files, and then extract the corresponding information.
- Windows
Retrieve software information by reading data from the registry.

# 🛠 Development
```
git clone https://github.com/Xutaotaotao/get-installed-apps.git

cd get-installed-apps

npm i

npm run test

```