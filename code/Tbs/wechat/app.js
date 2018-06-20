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
  globalData: {
    choose: {
      taotu: {},
      dantu: {}
    },
    shear: {
      title: '10万套效果图，你想看的这都有，点击查看->',
      desc: '',
      path: '/pages/index/index'
    },
    token: '',
    userInfo: null,
    tukuType: {},
    position: [{ full_name: '选择省份', province_id: 0 }, { full_name: '选择城市', city_id: 0 }],
    city_grade: 0,
    livingRoom: '1',
    bedroom: '2',
    kitchen: '3',
    toilet: '4',
    balcony: '5',
    other: '6',
    moneys: '7'
  }
})