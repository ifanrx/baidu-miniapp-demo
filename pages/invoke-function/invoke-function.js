import {showModalText, showFailToast} from '../../utils/interface-feedback'
import {BAAS_ERROR_CODE} from "../../utils/constant"

const app = getApp()

Page({
  data: {
    length: 0,
    height: 0,
  },
  
  helloWorld: function() {
    app.BaaS.invokeFunction('sdktest-hello-world').then(res => {
      showModalText(JSON.stringify(res.data))
    }, err => {
      console.log('err', err)
      if (err.code === BAAS_ERROR_CODE.USER_UNAUTHORIZED) {
        showFailToast('请登录后操作')
      } else {
        showModalText(JSON.stringify(err))
      }
    })
  },

  bindLengthChanged(e) {
    this.setData({
      length: e.detail.value,
    })
  },

  bindHeightChanged(e) {
    this.setData({
      height: e.detail.value,
    })
  },

  calculateArea: function() {
    const {length, height} = this.data
    app.BaaS.invokeFunction('calculateArea', {length, height}).then(res => {
      showModalText(JSON.stringify(res.data))
    }, err => {
      console.log('err', err)
      if (err.code === BAAS_ERROR_CODE.USER_UNAUTHORIZED) {
        showFailToast('请登录后操作')
      } else {
        showModalText(JSON.stringify(err))
      }
    })
  },
})
