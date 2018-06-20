// pages/imageSingle/imageSingle.js
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    showImages: [],
    index: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 200,
    title: '简约现代三居室',
    current: 0,
    count: 8,
    startX: 0,
    endX: 0,
    currentPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  close: function () {
    wx.navigateBack()
  },
  //立即计算
  toPrice: function () {
    wx.navigateTo({
      url: '/pages/price/price',
    })
  },
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'danTuImageList',
      success: function (res) {
        res.data.forEach(item => {
          if (item.type == 3) {
            item.img_url = 'https://back.tobosu.com/new_impress_pic/small/2018-06-07/5b18ab811e404.jpg'
          }
        })
        that.setData({
          imageList: res.data
        })
        wx.getStorage({
          key: 'danTuImageListIndex',
          success: function ($res) {
            that.setData({
              current: $res.data
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: App.globalData.shear.title,
      desc: App.globalData.shear.desc,
      path: App.globalData.shear.path
    }
  }
})