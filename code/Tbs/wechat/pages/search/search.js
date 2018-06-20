import { getlabel, getSearch } from '../../api/search'
import { clickCount, labelClickCount } from '../../api/click_count'
var App = getApp()
var timer = null;
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    label: [],
    nodata: false,
    searchData: [],
    pageNo: 1,
    pageSize: 10,
    searchText: '',
    id: 0,
    type: 0,
    showSearch: true,
    showClear: false
  },
  bindinput: function (e) {
    this.setData({
      pageNo: 1,
      searchData: [],
      id: 0,
      type: 0,
      searchText: e.detail.value
    })
    var text = e.detail.value
    if (text.length <=0) {
      this.setData({
        showClear: false,
        showSearch: true
      })
    } else {
      this.setData({
        showClear: true,
        showSearch: false
      })
    }
    this.getSearch({
      title: text,
      token: App.globalData.token,
      page:1,
      pageSize: 10
    })
  },
  clears: function () {
    this.setData({
      searchText: '',
      searchData: [],
      showSearch: true,
      showClear: false
    })
  },
  back: function () {
    wx.navigateBack()
  },
  getSearch: function (data) {
    clearTimeout(timer)
    timer = setTimeout (()=> {
      wx.showLoading({
        title: '正在加载',
        icon: 'none'
      })
        getSearch(data).then(res => {
          wx.hideLoading()
          if (res.status == 200) {
            this.setData({
              nodata: false,
              searchData: this.data.searchData.concat(res.data)
            })
          } else if (res.status == 201) {
            if (this.data.searchData.length <= 0) {
              this.setData({
                nodata: true
              })
            }
            wx.showToast({
              title: '没有更多了',
              icon: 'none'
            })
          }
        })
    }, 300)
  },
  getlabel: function (e) {
    getlabel({
      token: App.globalData.token
    }).then(res => {
      if (res.status===200) {
        this.setData({
          label: res.data
        })
      }
    })
  },

  toimagesLibrary: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.type === 1) { //1：套图；3：广告图
      wx.setStorage({
        key: "taoTuImageList",
        data: this.data.searchData
      })
      wx.setStorage({
        key: "taoTuImageListIndex",
        data: e.currentTarget.dataset.index
      })
      wx.navigateTo({
        url: '/pages/imageLibrary/imageLibrary?index=' + e.currentTarget.dataset.index,
      })
    } else if (item.type == 2) {
      wx.setStorage({
        key: "danTuImageList",
        data: this.data.searchData
      })
      wx.setStorage({
        key: "danTuImageListIndex",
        data: e.currentTarget.dataset.index
      })
      wx.navigateTo({
        url: '/pages/imageSingle/imageSingle?index=' + e.currentTarget.dataset.index,
      })
    } 
    else if (item.type === 3) {
      try {
        clickCount({
          token: App.globalData.token,
          id: item.id
        })
      } catch (err) { }
      if (item.original_type == 1) {
        wx.switchTab({
          url: '/pages/sj/sj',
        })
      } else {
        wx.navigateTo({
          url: '/pages/price/price',
        })
      }
    }
  },
  labelSearch: function (e) {
    var item = e.currentTarget.dataset.item
    try {
      labelClickCount({
        token: App.globalData.token,
        id: item.id
      })
    }catch(err){
      console.log(err)
    } 
    var that = this
    this.setData({
      showSearch: false,
      showClear: true,
      searchText: item.name,
      pageNo: 1,
      id: item.id,
      type: item.type
    })
    var data = {
      token: App.globalData.token,
      page: 1,
      pageSize: that.data.pageSize,
      id: item.id,
      type: item.type
    }
    this.getSearch(data)
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
  onShow: function () {
    this.getlabel()
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
  bindscrolltolower: function (e) {
    var that = this
    this.setData({
      pageNo: that.data.pageNo += 1
    })
    if (this.data.id == 0) {
      this.getSearch({
        title: that.data.searchText,
        token: App.globalData.token,
        page: that.data.pageNo,
        pageSize: that.data.pageSize
      })
    } else {
      this.getSearch({
        id: this.data.id,
        type: this.data.type,
        token: App.globalData.token,
        page: that.data.pageNo,
        pageSize: that.data.pageSize
      })
    }
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