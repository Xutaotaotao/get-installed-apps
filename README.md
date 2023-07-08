# Get Insatlled Apps

Get installed app using Node.js, supporting Windows and macOS.

# Installing

Via npm:

`npm install get-installed-apps`

# Examples

ES6 Module 

```
import {getInstalledApps} from 'get-installed-apps'

getInstalledApps().then(res => {
  console.log(res)
})
```

CommonJS

```
const {getInstalledApps} = require('get-installed-apps')
getInstalledApps().then(res => {
  console.log(res)
})
```

If you want to use macOS-specific methods separately, you can do it like this.


```
import {getMacInstalledApps} from 'get-installed-apps'

getMacInstalledApps().then(res => {
  console.log(res)
})
```

If you want to use windows-specific methods separately, you can do it like this.

```
import {getWinInstalledApps} from 'get-installed-apps'

getWinInstalledApps().then(res => {
  console.log(res)
})
```