import {BAAS_CLIENT_ID} from './env.js'

//app.js
App({
  onLaunch() {
    this.initBaaS()
  },

  initBaaS() {
      this.BaaS = require('./utils/sdk-baidu.2.8.1.js')
      this.BaaS.init(BAAS_CLIENT_ID)
  }
})
