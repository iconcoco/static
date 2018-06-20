// components/imageDetail/imageDetail.js
var next = false
var prev = false
var App = getApp()
Page({
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
  onSlideChangeEnd: function (e) {
    this.setData({
      currentPage: e.detail.current +1
    })
  },
  bindanimationfinish: function (e) {
    var detail = e.detail
    if (detail.current == this.data.showImages.sub_images.length - 1 && next) {
      this.getNext()
    } else if (detail.current == this.data.showImages.sub_images.length - 1 ) {
      next = true
    } else if (detail.current == 0 && prev) {
      this.getPrev()
    }  else if (detail.current == 0) {
      prev = true
    }
  },
  //立即计算
  toPrice: function () {
    wx.navigateTo({
      url: '/pages/price/price',
    })
  },
  myCatchTouch: function (e) {
    e.preventdefault()
  },
  close: function () {
    wx.navigateBack()
  },
  getNext: function () {
    next = false
    prev = false
    var nextIndex = ++this.data.index
    if (nextIndex >= this.data.imageList.length) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return
    }
    this.setData({
      showImages: this.data.imageList[nextIndex],
      index: nextIndex,
      current: 0
    })
  },
  getPrev: function () {
    var nextIndex = this.data.index - 1
    if (nextIndex < 0) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return
    }
    this.setData({
      showImages: this.data.imageList[nextIndex],
      index: nextIndex,
      current: 0
    })
    prev = false
  },
  getId: function (currentId) {
    var position = 0
    for (var i = 0; i < this.data.imageList.length; i++) {
      if (this.data.imageList[i].id == currentId) {
        console.log(i, this.data.imageList[i].id, currentId)
        position = i
        break
      }
    }
    return i
  },
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'taoTuImageList',
      success: function (res) {
        that.setData({
          imageList: res.data
        })
        wx.getStorage({
          key: 'taoTuImageListIndex',
          success: function ($res) {
            that.setData({
              index: $res.data,
              showImages: res.data[$res.data],
              current: 0
            })
          }
        })
      }
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
