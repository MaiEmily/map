//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //获取地理位置
  getLocation: function (successCallback) {
    let that = this;
    wx.getLocation({
      //默认wgs84
      type: 'gcj02',
      success: function (location) {
        if (successCallback) {
          successCallback(location);
        }
      },
      fail: function () {
        that.showModal({
          title: '',
          content: '请允许获取您的定位',
          confirmText: '授权',
          success: function (res) {
            if (res.confirm) {
              that.openSetting();
            } else {

            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    ak: '5jqljRe04ro2Gr5l1Sqarhuj8j75QUKt', //百度地图秘钥
  }
})