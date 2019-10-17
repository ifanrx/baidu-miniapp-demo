import {
  showSuccessToast,
  showFailToast,
  showLoadingText,
  hideLoadingText
} from '../../utils/interface-feedback'
const app = getApp()

Page({
  data: {
    name: '',
    avatar: '',
    registerName: '',
    registerPassword: '',
    loginName: '',
    loginPassword: '',
    isUserLogined: false,
    baiduLinkStatus: 0,
    currentUser: null
  },

  onLoad() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const uid = app.BaaS.storage.get('uid')
    const token = app.BaaS.storage.get('auth_token')
    this.setData({
      isUserLogined: uid && token,
    })
  },

  cleanSession() {
    console.log('------- clean session start -------')
    app.BaaS.storage.set('uid', '')
    app.BaaS.storage.set('auth_token', '')
    app.BaaS.storage.set('session_expires_at', '')
    console.log('------- clean session end -------')
  },

  register() {
    showLoadingText('请稍候...')
    app.BaaS.auth.register({
      username: this.data.registerName,
      password: this.data.registerPassword,
    }).then((res) => {
      showSuccessToast()
    }, err => {
      showFailToast('注册失败')
      console.dir(err)
    })
  },

  bindRegisterName(e) {
    this.setData({
      registerName: e.detail.value,
    })
  },

  bindRegisterPassword(e) {
    this.setData({
      registerPassword: e.detail.value,
    })
  },

  login() {
    showLoadingText('请稍候...')
    this.cleanSession()
    app.BaaS.auth.login({
      username: this.data.loginName,
      password: this.data.loginPassword,
    }).then(user => {
      this.checkLoginStatus()
      hideLoadingText()
      showSuccessToast()
    }, err => {
      showFailToast('登录失败')
      hideLoadingText()
      console.log(err)
    })
  },

  bindLoginName(e) {
    this.setData({
      loginName: e.detail.value,
    })
  },

  bindLoginPassword(e) {
    this.setData({
      loginPassword: e.detail.value,
    })
  },

  signout() {
    app.BaaS.auth.logout().then((res) => {
      showSuccessToast()
      this.checkLoginStatus()
      this.setData({
        name: '',
        avatar: '',
        baiduLinkStatus: 0,
      })
    }, err => {
      showFailToast()
      console.log(err)
    })
  },

  getCurrentUser() {
    app.BaaS.auth.getCurrentUser().then(user => {
      this.setData({
        currentUser: user
      })

      const userInfo = user.toJSON()

      if (!userInfo._provider.baidu_miniapp) {
        this.setData({
          baiduLinkStatus: -1,
        })
      } else {
        this.setData({
          // 静默登录时 baidu_miniapp 对象没有 nickname / avatar，setData 不允许设置值为 undefined
          name: userInfo._provider.baidu_miniapp.nickname || '',
          avatar: userInfo._provider.baidu_miniapp.avatar || '',
          baiduLinkStatus: 1,
        })
      }
    })
  },

  resetPassword() {
    app.BaaS.auth.requestPasswordReset().then((res) => {
      showSuccessToast()
    }, err => {
      showFailToast(err.message)
      console.log(err)
    })
  },

  baiduSilentLogin() {
    this.cleanSession()
    app.BaaS.auth.loginWithBaidu().then((res) => {
      this.checkLoginStatus()
      console.log(res, res.toJSON())
      showSuccessToast()
    }, err => {
      showFailToast('静默登录失败')
      console.log(err)
    })
  },

  baiduForceLogin(data) {
    this.cleanSession()
    console.log(data)

    app.BaaS.auth.loginWithBaidu(data)
      .then(res => {
        this.checkLoginStatus()
        console.log(res)
        showSuccessToast()
      })
      .catch(err => {
        showFailToast('授权登录失败')
        console.log(err)
      })
  },

  linkBaidu() {
    const User = new app.BaaS.User
    const currentUser = User.getCurrentUserWithoutData()
    currentUser.linkBaidu()
      .then(res => {
        showSuccessToast()
        this.setData({
          baiduLinkStatus: 0,
        })
      })
      .catch(err => {
        showFailToast(err.message)
        console.log(err)
      })
  },

  forceLinkBaidu(data) {
    const currentUser = this.data.currentUser

    currentUser.linkBaidu(data)
      .then(res => {
        showSuccessToast()
        this.setData({
          baiduLinkStatus: 0,
        })
      })
      .catch(err => {
        showFailToast(err.message)
        console.log(err)
      })
  }
})