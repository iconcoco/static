import { u } from '../../lib/imageUlr.js'
let App = getApp();
Page({
  data: {
    livingRoom: 0,
    bedroom: 0,
    kitchen: 0,
    toilet: 0,
    balcony: 0,
    other: 0,
    moneys: 0,
    img1: u + 'tbs_bj_03.jpg',
    t_price_img1: u + 't_price_img1.jpg',
    t_price_img2: u + 't_price_img2.jpg',
    t_price_img3: u + 't_price_img3.jpg',
  },
  onLoad: function (options) {
    let moneys = (App.globalData.moneys / 10000).toFixed(1);
    this.setData({
      livingRoom: App.globalData.livingRoom,
      bedroom: App.globalData.bedroom,
      kitchen: App.globalData.kitchen,
      toilet: App.globalData.toilet,
      balcony: App.globalData.balcony,
      other: App.globalData.other,
      moneys: moneys
    })
  },
  onReady: function () {
    this.diaLog = this.selectComponent('#diaLog');
    this.showCity()
  },
  showCity: function (e) {
    this.diaLog.showDialog();
  },
  onShareAppMessage: function () {
    return {
      title: App.globalData.shear.title,
      desc: App.globalData.shear.desc,
      path: App.globalData.shear.path
    }
  }
})
