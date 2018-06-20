// pages/kalDetail/kanDetail.js
import { kananliDetail } from '../../api/kananli'
import { pubOrder } from '../../api/pub_order'
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    detailData: {},
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    display: 3
  },
  //案例详情数据
  kananliDetail: function (data) {
    wx.showLoading({
      title: '正在加载...',
    })
    kananliDetail(data).then(res => {
      wx.hideLoading()
      if (res.status === 200) {
        this.setData({
          detailData: res.data
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '服务器异常',
      })
    })
  },
  //或许你还想看
  toCare: function (e) {
    var id = e.currentTarget.dataset.id
    this.kananliDetail({
      token: App.globalData.token,
      id: id
    })
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  toMianFeiSheJi: function (e) {
    wx.navigateTo({
      url: '/pages/mianfeisheji/mianfeisheji?detail=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  toPrice: function () {
    wx.navigateTo({
      url: '/pages/price/price',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail = JSON.parse(options.detail)
    this.kananliDetail({
      token: App.globalData.token,
      id: detail.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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