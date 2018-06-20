// pages/mianfeishej/mianfeisheji.js
import { pubOrder } from '../../api/pub_order'
import { getCurrentPageUrl } from './../../utils/util';
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: App.globalData.position,
    cellphone: '',
    city: '',
    cityId: 0,
    provinceId: 0,
    name: '',
    msg: '',
    isWrong: false,
    urlhistory: '',
    detailData: {},
    chcode: 0,
    subchannel: 0,
    pos: 0,
    channel: 0
  },
  showCity: function (e) {
    this.choseCity.showList();
  },
  //初始化数据
  init: function () {
    this.setData({
      cellphone: '',
      name: ''
    })
  },
  component_city: function (e) {
    var position = App.globalData.position
    if (position[0].province_id && position[1].city_id) {
      this.setData({
        city: position[0].full_name + ' ' + position[1].full_name,
        cityId: position[1].city_id,
        provinceId: position[0].province_id
      })
    }
  },
  //提交
  submitFn: function () {
    // 匹配非中文
    var reg1=  /[^\u4E00-\u9FA5]/g
    var reg2= /^1[3-9][0-9]{9}$/g
    var that =this
    if (that.data.name  == '') {
      wx.showToast({
        title: '请输入称呼!',
        icon: 'none'
      })
      return
    }
    if (reg1.test(that.data.name)) {
      this.setData({
        msg: '称呼请输入中文',
        isWrong: true
      })
      setTimeout(() => {
        this.setData({
          msg: '',
          isWrong: false
        })
      }, 2000)
      return
    }
    if (that.data.provinceId == 0 || that.data.provinceId == '') {
      wx.showToast({
        title: '请选择城市!',
        icon: 'none'
      })
      return
    }
    if (that.data.cellphone === '') {
      this.setData({
        msg: '请输入手机号码',
        isWrong: true
      })
      setTimeout(() => {
        this.setData({
          msg: '',
          isWrong: false
        })
      }, 2000)
      return
    } 
    if (!reg2.test(that.data.cellphone)) {
      this.setData({
        msg: '请输入正确的手机号码',
        isWrong: true
      })
      setTimeout(() => {
        this.setData({
          msg: '',
          isWrong: false
        })
      }, 2000)
      return
    }
    wx.showLoading({
      title: '正在申请...',
    })
    var that = this
    pubOrder({
      province: that.data.provinceId,
      city: that.data.cityId,
      ownername: that.data.name,
      cellphone: that.data.cellphone,
      source: 1229,
      urlhistory: that.data.urlhistory,
      chcode: that.data.chcode || 0,
      subchannel: that.data.subchannel || 0,
      pos: that.data.pos || 0,
      channel: that.data.channel || 0
    }).then(res => {
      wx.hideLoading()
      this.diaLog.showDialog()
      this.init()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '服务器异常',
      })
    })
  },
  //inputBlur
  inputBlur: function (e) {
    let currentIndex = e.target.dataset.index
    let value = e.detail.value
    let index = parseInt(currentIndex)
    if (index == 1) {
      this.setData({
        name: value
      })
    } else if (index == 3) {
      this.setData({
        cellphone: value
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      detailData: JSON.parse(options.detail),
      urlhistory: getCurrentPageUrl()
    })
    options && this.setData({
      chcode: options.chcode || 0,
      subchannel: options.subchannel || 0,
      pos: options.pos || 0,
      channel: options.channel || 0,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.choseCity = this.selectComponent('#chose_city');
    this.diaLog = this.selectComponent('#diaLog');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(App.globalData.position)
    var position = App.globalData.position
    if (position[0].province_id && position[1].city_id) {
      this.setData({
        city: position[0].full_name + ' ' + position[1].full_name,
        cityId: position[1].city_id,
        provinceId: position[0].province_id
      })
    }
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