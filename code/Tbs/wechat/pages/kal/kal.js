// pages/kal/kal.js
import { kananli, kananliDetail } from '../../api/kananli'
import { clickCount } from '../../api/click_count'
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefesh: false,
    page: 1,
    page_size: 10,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.kananli({
      token: App.globalData.token,
      page: this.data.page,
      page_size: this.data.page_size
    })
  },
  jump: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.type == 1) {
      wx.navigateTo({
        url: '/pages/kalDetail/kalDetail?detail=' + JSON.stringify(item)
      })
    } else if (item.type == 3) {
      if (item.jump_type == 1) { //链接
        wx.navigateTo({
          url: '/pages/web/web?url=' + encodeURIComponent(item.jump_url),
        })
      } else if (item.jump_type == 2) {
        try {
          clickCount({
            token: App.globalData.token,
            id: item.id
          })
        } catch (err) { }
        if (item.original_type == 2) {
          wx.navigateTo({
            url: '/pages/price/price',
          })
        } else if (item.original_type == 1) {
          wx.navigateTo({
            url: '/pages/sjPage/sjPage',
          })
        }
      }
    }
  },
  //看案例数据
  kananli: function (data) {
    wx.showLoading({
      title: '正在加载...',
    })
    kananli(data).then(res => {
      if (res.status === 200) {
        this.data.dataList = this.data.dataList.concat(res.data)
        this.setData({
          dataList: this.data.dataList,
          isRefesh: false
        })
        wx.hideLoading()
      } else if (res.status == 201){
        wx.hideLoading()
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '服务器异常',
        icon: 'none'
      })
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  bindscrolltolower: function () {
    this.setData({
      page: ++this.data.page
    })
    this.kananli({
      token: App.globalData.token,
      page: this.data.page,
      page_size: this.data.page_size
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.stopPullDownRefresh()
    that.setData({
      isRefesh: true,
      dataList: []
    })
    this.kananli({
      token: App.globalData.token,
      page: 1,
      page_size: this.data.page_size
    })
  },
  onShareAppMessage: function () {
    return {
      title: App.globalData.shear.title,
      desc: App.globalData.shear.desc,
      path: App.globalData.shear.path
    }
  }
})