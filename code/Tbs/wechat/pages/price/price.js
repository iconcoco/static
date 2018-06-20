import { getCityData } from '../../api/get_city_data'
import { pubOrder } from '../../api/pub_order'
import {u} from '../../lib/imageUlr.js'
import util from '../../utils/index'
import { getCurrentPageUrl } from './../../utils/util';

let App = getApp();
Page({
  data: {
    img1: u + 'tbs_bj_03.jpg',
    img2: u + 'tbs-num.gif',
    img3: u + 'm-bg01.jpg',
    img4: u + 'm-bg02.png',
    info: [1, 2, 3, 4, 5],
    isWrong: true,
    msg: '',
    flag: true,
    formdata: {
      housearea: "",
      cellphone: ""
    },
    status1: 0,
    status2: 0,
    status3: 0,
    status4: 0,
    status5: 0,
    state1: false,
    state2: false,
    position: App.globalData.position,
    decorate_price: '',
    urlhistory: '/pages/price/price',
    submitBtn: true,
    currentCity: '',
    currentCityCode: '',
    currentprovince: '',
  },
  onLoad: function (options) {
    this.setData({
      urlhistory: getCurrentPageUrl()
    });
  },
  onReady: function () {
    wx.hideLoading();
    this.getCity()
    this.diaLog = this.selectComponent('#diaLog');
    this.choseCity = this.selectComponent('#chose_city');
  },
  component_city: function () {
    this.setData({
      position: App.globalData.position
    });
  },
  getCity: function () {
    var that = this
    wx.getStorage({
      key: 'code',
      success: function (res) {
        that.setData({
          currentCityCode: res.data
        })
      }
    })
  },
  showHouseType: function () {
    this.diaLog.showDialog()
  },
  tips: function (msg) {
    var that = this;
    if (!this.data.flag) return;
    this.setData({
      isWrong: false,
      msg: msg,
      flag: false
    });
    setTimeout(function () {
      that.setData({
        isWrong: true,
        flag: true
      })
    }, 1200);
  },
  inptArea: function (e) {
    let that = this,
      area = e.detail.value,
      dot = area.indexOf(".");
    if (dot != -1) {
      let dotCnt = area.substring(dot + 1, area.length);
      if (dotCnt.length > 2) {
        let val = parseFloat(area).toFixed(2);
        that.setData({
          formdata: {
            housearea: val
          }
        })
      }
    }
    if (area >= 0 && area <= 59) {
      that.setData({
        status1: 0,
        status2: 0,
        status3: 0,
        status4: 0,
        status5: 0
      })
    }
    if (area >= 60 && area <= 89) {
      that.setData({
        status1: 1,
        status2: 0,
        status3: 0,
        status4: 0,
        status5: 0
      })
    }
    if (area >= 90 && area <= 149) {
      that.setData({
        status1: 2,
        status2: 1,
        status3: 0,
        status4: 1,
        status5: 0
      })
    }
    if (area >= 150) {
      that.setData({
        status1: 3,
        status2: 1,
        status3: 0,
        status4: 1,
        status5: 1
      })
    }
    that.setData({
      formdata: {
        housearea: area
      }
    })
  },
  calculate: function () {
    let that = this,
      city_grade = App.globalData.city_grade,
      area = parseInt(that.data.formdata.housearea);
    let money, areas, livingRoom, bedroom, kitchen, toilet, balcony, other, moneys;
    if (city_grade == 4) {
      money = 550
    } else if (city_grade == 3) {
      money = 480
    } else if (city_grade == 2) {
      money = 440
    } else {
      money = 380
    }
    if (!area) {
      return false
    }
    areas = area * money;
    livingRoom = Math.round(areas * 0.2281)
    bedroom = Math.round(areas * 0.2637)
    kitchen = Math.round(areas * 0.0919)
    toilet = Math.round(areas * 0.1263)
    balcony = Math.round(areas * 0.09)
    other = Math.round(areas * 0.2)
    moneys = Math.round(areas)

    App.globalData.livingRoom = livingRoom
    App.globalData.bedroom = bedroom
    App.globalData.kitchen = kitchen
    App.globalData.toilet = toilet
    App.globalData.balcony = balcony
    App.globalData.other = other
    App.globalData.moneys = moneys
    that.setData({
      decorate_price: moneys
    })
  },
  showCity: function (e) {
    this.choseCity.showList();
  },
  chooseHosue: function (e) {
    let that = this;
    let key = parseInt(e.currentTarget.dataset.key);
    let type = parseInt(e.currentTarget.dataset.type);
    switch (type) {
      case 1:
        that.setData({
          status1: key
        })
        break;
      case 2:
        that.setData({
          status2: key
        })
        break;
      case 3:
        that.setData({
          status3: key
        })
        break;
      case 4:
        that.setData({
          status4: key
        })
        break;
      case 5:
        that.setData({
          status5: key
        })
        break;
    }
  },
  formValidate: function (formData) {
    let that = this,
      result = {
        status: false,
        msg: ''
      };
    if (!util.validate(formData.city, 'require')) {
      result.msg = '请选择城市';
      return result;
    }
    if (!util.validate(formData.housearea, 'num')) {
      result.msg = '请输入正确房屋面积';
      return result;
    }
    if (!util.validate(formData.cellphone, 'phone')) {
      result.msg = '请输入正确的手机号码';
      return result;
    }
    result.status = true;
    return result;
  },
  formSubmit: function (e) {
    let that = this,
      value = e.detail.value,
      formData = value,
      res = that.formValidate(formData)
      if (res.status !== true) {
        this.tips(res.msg)
        return
      }
      wx.showLoading({
        title: '正在计算...',
      });
      this.calculate()
      pubOrder(formData).then(res => {
        wx.hideLoading();
        if (res.error_code == 0) {
        that.setData({
          formdata: {
            housearea: "",
            cellphone: ""
          },
          status1: 0,
          status2: 0,
          status3: 0,
          status4: 0,
          status5: 0,
          submitBtn: true,
          position: [
            { full_name: App.globalData.position[0].full_name, province_id: App.globalData.position[0].province_id },
            { full_name: '选择城市', city_id: 0 }
          ]
        });
          wx.navigateTo({
            url: '/pages/priceDetail/priceDetail'
          })
        }
      })
  },
  inputFocus: function (e) {
  },
  inputBlur: function (e) {
  },
  onShareAppMessage: function () {
    return {
      title: App.globalData.shear.title,
      desc: App.globalData.shear.desc,
      path: App.globalData.shear.path
    }
  }
})
