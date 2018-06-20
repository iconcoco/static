//index.js
//获取应用实例
import qqmap from '../../lib/qqmap-wx-jssdk.min'
import { u } from '../../lib/imageUlr.js'
import { provinceId } from '../../api/get_city_data'
import { getToken, index, change_batch } from '../../api/index'
import { clickCount } from '../../api/click_count'
const App = getApp()
var timer =null //timerOut控制
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menuList: [
      { text: '首页', id: 0, icon: '../../images/ahome.png', defaultIcon: '../../images/aorder.png', clicked: true },
      { text: '图库', id: 1, icon: '../../images/ahome.png', defaultIcon: '../../images/aorder.png', clicked: false },
      { text: '看案例', id: 2, icon: '../../images/ahome.png', defaultIcon: '../../images/aorder.png', clicked: false },
      { text: '0元设计', id: 3, icon: '../../images/ahome.png', defaultIcon: '../../images/aorder.png', clicked: false },
    ],
    designList: [
      { text: '按空间', id: 0, clicked: true },
      { text: '按风格', id: 1, clicked: false },
      { text: '按户型', id: 2, clicked: false }
    ],
    curCityId: 0,
    cityGrade: 0,
    cityName: '全国',
    designType: 0,
    designScrollLeft: 0,
    background: [],
    suites: [], //效果图套图信息
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    middle_advert: {},
    duration: 500,
    hotImage: u + 'HOT@2x_03.png',
    freeImage: u + 'HOT@2x_05.png',
    adImage: u + 'ad.png',
    //id关联图片
    imagelink: {
      "客厅": 'kj-kt.jpg',
      "卧室": 'kj-ws.jpg',
      "厨房": 'kj-cf.jpg',
      "餐厅": 'kj-ct.jpg',
      "卫生间": 'kj-wsj.jpg',
      "阳台": 'kj-yt.jpg',
      "欧式": 'fg-os.jpg',
      "简约": 'fg-jy.jpg',
      "中式": 'fg-zs.jpg',
      "风格": 'fg-xd.jpg',
      "美式": 'fg-ms.jpg',
      "现代": 'fg-xd.jpg',
      "地中海": 'fg-dzh.jpg',
      "小户型": 'hx-xhx.jpg',
      "别墅": 'hx-bs.jpg',
      "复式": 'hx-fs.jpg',
      "一居室": 'hx-yjs.jpg',
      "二居室": 'hx-ejs.jpg',
      "三居室": 'hx-sjs.jpg',
      "四居室": 'hx-ssjs.jpg',
    },
    //按空间
    akj: [],
    // 按风格图片列表
    afg: [],
    // 按户型图片列表
    ahx: []
  },
  //轮播图跳转
  jump: function (e) {
    var item = e.currentTarget.dataset.item
    try {
      clickCount({
        token: App.globalData.token,
        id: item.id
      })
    } catch (err) { }
    if (item.jump_type == 1) {
      wx.navigateTo({
        url: '/pages/web/web?url=' + encodeURIComponent(item.jump_url),
      })
    } else if (item.jump_type == 2) {
      if (item.original_type == 1) {
       wx.navigateTo({
         url: '/pages/sjPage/sjPage',
       })
      } else {
        wx.navigateTo({
          url: '/pages/price/price',
        })
      }
    }
  },
  //效果图推荐跳转
  jump_2: function (e) {
    wx.setStorage({
      key: "taoTuImageList",
      data: this.data.suites
    })
    wx.setStorage({
      key: "taoTuImageListIndex",
      data: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/pages/imageLibrary/imageLibrary?index=' + e.currentTarget.dataset.index,
    })
  },
  //中部广告图跳转
  jumpad: function (e) {
    var item = e.currentTarget.dataset.item
    try {
      clickCount({
        token: App.globalData.token,
        id: item.id
      })
    } catch (err) { 
      console.log(err)
    }
    var item = this.data.middle_advert
    if (item.jump_type == 1) {
      wx.navigateTo({
        url: '/pages/web/web?url=' + encodeURIComponent(item.jump_url),
      })
    } else if (item.jump_type == 2) {
      if (item.original_type == 1) {
        wx.navigateTo({
          url: '/pages/sjPage/sjPage',
        })
      } else {
        wx.navigateTo({
          url: '/pages/price/price',
        })
      }
    }
  },
  //中部广告位
  //获取token
  token: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    getToken().then(res => {
      wx.hideLoading()
      if (res.status === 200) {
        App.globalData.token = res.data
        this.getLocation().then(r => { //获取经纬度
          this.getCityName(r).then(_res => { //获取城市名
            this.getCityId(_res) //获取城市id
            this.index({ // 获取首页数据
              token: res.data,
              city_name: _res
            })
          }).catch(r => {
            wx.showToast({
              title: r,
            })
          })
        }).catch(err => {
          this.index({
            token: res.data
          })
        })
      } else {
        wx.showToast({
          title: _res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 100000
      })
    })
  },
  //获取首页数据
  index: function (data) {
    index(data).then(res => {
      if (res.status === 200) {
        var $res = res.data
        var akj = [], afg = [], ahx = []
        //拼接 按空间图片列表
        $res.space.forEach(item => {
          akj.push(
            { type: 'kj', typeId: item.id, src: u + this.data.imagelink[item.name], txt: item.name }
          )
        })
        //拼接 按风格图片列表
        $res.style.forEach(item => {
          afg.push(
            { type: 'fg', typeId: item.id, src: u + this.data.imagelink[item.name], txt: item.name }
          )
        })
        //拼接 按户型图片列表
        $res.layout.forEach(item => {
          ahx.push(
            { type: 'hx', typeId: item.id, src: u + this.data.imagelink[item.name], txt: item.name }
          )
        })
        //拼接轮播图
        this.setData({
          akj: akj,
          afg: afg,
          ahx: ahx,
          background: $res.banners,
          suites: $res.suites,
          middle_advert: $res.middle_advert
        })
      }
    })
  },
  //换一批
  change_batch: function () {
    var that = this
    wx.showLoading({
      title: '正在加载',
    })
    change_batch({
      token: App.globalData.token,
      cityName: that.data.cityName == '全国' ? null : that.data.cityName
    }).then(res => {
      wx.hideLoading()
      if (res.status === 200) {
        this.setData({
          suites: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
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
  //跳转图库页面
  switchTuKu: function () {
    wx.switchTab({
      url: '/pages/tuku/tuku'
    })
  },
  //滑倒底部自动切换标签
  bindscrolltolower: function () {
    var type = this.data.designType
    clearTimeout(timer)  // 每次滑动清除上一个定时器
    if (type == 0) {
      timer=setTimeout(()=> {
        this.setData({
          designType: 1
        })
        this.designTabChange({ currentTarget: { dataset: { index: 1 } } })
      }, 1000)
    } else if (type == 1) {
      timer =setTimeout(() => {
        this.setData({
          designType: 1
        })
        this.designTabChange({ currentTarget: { dataset: { index: 2 } } })
      }, 1000)
    } else if (type == 2) {
      timer =setTimeout(() => {
        this.setData({
          designType: 1
        })
        this.designTabChange({ currentTarget: { dataset: { index: 0 } } })
      }, 1000)
    }
  },
  // //滑倒头部自动切换标签   不能用 和上一个方法冲突
  // bindscrolltoupper: function () {
  //   var type = this.data.designType
  //   clearTimeout(timer)
  //   if (type == 0) {
  //     timer = setTimeout(() => {
  //       this.setData({
  //         designType: 2
  //       })
  //       this.designTabChange({ currentTarget: { dataset: { index: 1 } } })
  //     }, 1000)
  //   } else if (type == 1) {
  //     timer = setTimeout(() => {
  //       this.setData({
  //         designType: 0
  //       })
  //       this.designTabChange({ currentTarget: { dataset: { index: 2 } } })
  //     }, 1000)
  //   } else if (type == 2) {
  //     timer = setTimeout(() => {
  //       this.setData({
  //         designType: 1
  //       })
  //       this.designTabChange({ currentTarget: { dataset: { index: 0 } } })
  //     }, 1000)
  //   }
  // },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    this.token()
  },
  //获取当前城市经纬度
  getLocation: function () {
    return new Promise((r, j) => {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          r({ latitude: latitude, longitude: longitude })
        },
        fail: function (res) {
          App.globalData.position[0] = { full_name: '选择省份', province_id: 0 }
          App.globalData.position[1] = { full_name: '选择城市', city_id: 0 }
          j("获取位置信息失败")
        }
      })
    })
  },
  //根据经纬度获取城市名
  getCityName: function (data) {
    var that = this
    let demo = new qqmap({
      key: '55CBZ-2V3R3-HCQ3Z-YMYFX-IDYOV-JBB2K'
    })
    return new Promise((r, j) => {
      demo.reverseGeocoder({
        location: {
          latitude: data.latitude,
          longitude: data.longitude
        },
        success: function (res) {
          r(res.result.address_component.city)
          that.setData({
            cityName: res.result.address_component.city
          })
          App.globalData.position[0] = provinceId(res.result.address_component.province)
          App.globalData.position[1] = { full_name: '选择城市', city_id: 0 }
        },
        fail: function (res) {
          j(data, res)
        }
      },
      )
    })
  },
  //根据城市名获取城市id
  getCityId: function (cityName) {
    var that = this
    wx.request({
      url: 'https://www.tobosu.com/applets/city/get_city_id',
      data: {
        token: 'MGE5MGQyMGI5NzkzYTIzNmViMzQ2MTA2NzQxMzE4YzA =',
        city_name: cityName
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(cityName, res.data.status)
        if (res.data.status == 200) {
          var cityid = res.data.data.city_id;
          var citygrade = res.data.data.city_grade
          that.setData({
            curCityId: cityid,
            cityGrade: citygrade || 2
          })
          wx.setStorage({ key: 'code', data: that.data.curCityId })
          App.globalData.position[1] = { city_id: cityid, full_name: cityName }
          App.globalData.city_grade = citygrade
        }
      }
    })
  },
  //跳转搜索页面
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 看设计类型切换
  designTabChange: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    this.data.designList.forEach(item => {
      item.clicked = false
    })
    this.data.designList[index].clicked = true
    this.setData({
      designType: this.data.designList[index].id,
      designScrollLeft: 0
    })
    this.setData({
      designList: that.data.designList
    })
  },
  //看设计 点击前往图库
  toTuKu: function (e) {
    var item = e.currentTarget.dataset.item
    item.reflash = true
    App.globalData.tukuType = item
    wx.switchTab({
      url: '/pages/tuku/tuku'
    })
  },
  //去案例页
  tokal: function () {
    wx.switchTab({
      url: '/pages/kal/kal',
    })
  },
  //去0元设计页
  tosj: function () {
    wx.navigateTo({
      url: '/pages/sjPage/sjPage',
    })
  },
  onPullDownRefresh: function () {
  },
  getUserInfo: function (e) {
    App.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
