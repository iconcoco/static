// pages/tuku/tuku.js
import { getSuite, getSingle, getTitleInfo } from '../../api/tuku'
import { clickCount } from '../../api/click_count'
var App = getApp()
var choose = App.globalData.choose
Page({
  data: {
    pageSize: 10,
    tabType: -1, // 0 套图风格 1 户型 2面积 3套图颜色 4 单图风格 5 局部 6 空间 7 单图颜色
    showTabItem: false, //显示模态框
    taotuActive: true, //显示套图
    dantuActive: false,//显示单图
    taoTuPageNo: 1, //套图page
    danTuPageNo: 1,//单图page
    taotuStyleDataTxt: '风格',
    taotuLayoutDataTxt: '户型',
    taotuAreaDataTxt: '面积',
    taotuColorDataTxt: '颜色',
    dantuSpaceDataTxt: '空间',
    dantuPartDataTxt: '局部',
    dantuStyleDataTxt: '风格',
    dantuColorDataTxt: '颜色',
    taoTuStyleDataId: 0,
    danTuStyleDataId: 0,
    taoTuLayoutDataId: 0,
    taoTuAreaDataId: 0,
    dantuSpaceDataId: 0,
    taoTuColorDataId: 0,
    danTuColorDataId: 0,
    danTuPartDataId: 0,
    taotu: [], 
    dantu: [],
    taotuList: [],//套图数据
    dantuList: [],//单图数据
    lastX: 0, //滑动X
    lastY: 0, //滑动Y
    moveY: 0, //滑动的距离
    text : 0, // 1 左边 2 右边 0 没有滑动
  },
  //切换套图
  switchTaoTu: function () {
    this.setData({
      taotuActive: true,
      dantuActive: false,
      showTabItem: false,
      tabType: -1
    })
    if (this.data.taotuList.length > 0) return
    this.getSuite({
      token: App.globalData.token,
      page: this.data.taoTuPageNo,
      pageSize: this.data.pageSize,
      layout_id: this.data.taoTuLayoutDataId,
      color_id: this.data.taoTuColorDataId,
      style_id: this.data.taoTuStyleDataId,
      area_id: this.data.taoTuAreaDataId
    })
  },
   //切换单图
  switchDanTu: function (data) {
    this.setData({
      taotuActive: false,
      dantuActive: true,
      showTabItem: false,
      tabType: -1
    })
    if (this.data.dantuList.length > 0) return
    this.getSingle({
      token: App.globalData.token,
      page:1,
      pageSize: this.data.pageSize,
      space_id: this.data.taoTuSpaceDataId,
      color_id: this.data.taoTuColorDataId,
      part_id: this.data.taoTuPartDataId,
      style_id: this.data.taoTuStyleDataId
    })
  },
  //切换类型
  itemClick: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (id === this.data.tabType) {
      this.setData({
        tabType: -1,
        showTabItem: false,
      })
      return
    }
    this.setData({
      tabType: id,
      showTabItem: true,
    })
  },
  //获取标题
  getTitleInfo: function (type) {
    var that = this
    getTitleInfo({
      token: App.globalData.token,
      type: type // 1套图 2单图
    }).then(res => {
      if (res.status === 200) {
        if (type === 1) {
          this.setData({
            taotu: {
              styleData: res.data.style,
              layoutData: res.data.layout,
              areaData: res.data.area,
              colorData: res.data.color,
            },
          })
        } else {
          this.setData({
            dantu: {
              spaceData: res.data.space,
              partData: res.data.part,
              styleData: res.data.style,
              colorData: res.data.color,
            },
          })
        }
      }
    }).catch(err => {

    })
  },
  //选择颜色
  chooseColor: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt = '颜色' : ''
    if (this.data.taotuActive) {
      this.setData({
        taoTuColorDataId: e.currentTarget.dataset.id,
        taotuColorDataTxt: e.currentTarget.dataset.txt,
        tabType: -1,
        showTabItem: false,
        taotuList: [],
        taoTuPageNo: 1
      })
      this.getSuite({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        layout_id: this.data.taoTuLayoutDataId,
        color_id: this.data.taoTuColorDataId,
        style_id: this.data.taoTuStyleDataId,
        area_id: this.data.taoTuAreaDataId
      })
    } else {
      this.setData({
        danTuColorDataId: e.currentTarget.dataset.id,
        dantuColorDataTxt: e.currentTarget.dataset.txt,
        danTuPageNo: 1,
        tabType: -1,
        showTabItem: false,
        dantuList: [],
        page: 1
      })
      this.getSingle({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        space_id: this.data.dantuSpaceDataId,
        color_id: this.data.danTuColorDataId,
        part_id: this.data.danTuPartDataId,
        style_id: this.data.danTuStyleDataId
      })
    }
  },
  //选择风格
  chooseStyle: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt = '风格' : ''
    if (this.data.taotuActive) {
      this.setData({
        taoTuStyleDataId: e.currentTarget.dataset.id,
        taotuStyleDataTxt: e.currentTarget.dataset.txt,
        taoTuPageNo: 1,
        tabType: -1,
        showTabItem: false,
        taotuList: []
      })
      this.getSuite({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        layout_id: this.data.taoTuLayoutDataId,
        color_id: this.data.taoTuColorDataId,
        style_id: this.data.taoTuStyleDataId,
        area_id: this.data.taoTuAreaDataId
      })
    } else {
      this.setData({
        danTuStyleDataId: e.currentTarget.dataset.id,
        dantuStyleDataTxt: e.currentTarget.dataset.txt,
        danTuPageNo: 1,
        tabType: -1,
        showTabItem: false,
        dantuList: []
      })
      this.getSingle({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        space_id: this.data.dantuSpaceDataId,
        color_id: this.data.danTuColorDataId,
        part_id: this.data.danTuPartDataId,
        style_id: this.data.danTuStyleDataId
      })
    }
  },
  //选择局部
  choosePart: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt='局部': ''
    this.setData({
      danTuPartDataId: e.currentTarget.dataset.id,
      dantuPartDataTxt: e.currentTarget.dataset.txt,
      danTuPageNo: 1,
      tabType: -1,
      showTabItem: false,
      dantuList: []
    })
    this.getSingle({
      token: App.globalData.token,
      page: 1,
      pageSize: this.data.pageSize,
      space_id: this.data.dantuSpaceDataId,
      color_id: this.data.danTuColorDataId,
      part_id: this.data.danTuPartDataId,
      style_id: this.data.danTuStyleDataId
    })
  },
  //选择空间
  chooseSpace: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt = '空间' : ''
    this.setData({
      dantuSpaceDataId: e.currentTarget.dataset.id,
      dantuSpaceDataTxt: e.currentTarget.dataset.txt,
      danTuPageNo: 1,
      tabType: -1,
      showTabItem: false,
      dantuList: []
    })
    this.getSingle({
      token: App.globalData.token,
      page: 1,
      pageSize: this.data.pageSize,
      space_id: this.data.dantuSpaceDataId,
      color_id: this.data.danTuColorDataId,
      part_id: this.data.danTuPartDataId,
      style_id: this.data.danTuStyleDataId
    })
  },
  //选择户型
  chooseLayout: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt = '户型' : ''
      this.setData({
        taoTuLayoutDataId: e.currentTarget.dataset.id,
        taotuLayoutDataTxt: e.currentTarget.dataset.txt,
        taoTuPageNo: 1,
        tabType: -1,
        showTabItem: false,
        taotuList: []
      })
      this.getSuite({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        layout_id: this.data.taoTuLayoutDataId,
        color_id: this.data.taoTuColorDataId,
        style_id: this.data.taoTuStyleDataId,
        area_id: this.data.taoTuAreaDataId
      })
  },
  //选择面积
  chooseArea: function (e) {
    e.currentTarget.dataset.id == 0 ? e.currentTarget.dataset.txt = '面积' : ''
    this.setData({
      taoTuAreaDataId: e.currentTarget.dataset.id,
      taotuAreaDataTxt: e.currentTarget.dataset.txt,
      taoTuPageNo: 1,
      tabType: -1,
      showTabItem: false,
      taotuList: []
    })
    this.getSuite({
      token: App.globalData.token,
      page: 1,
      pageSize: this.data.pageSize,
      layout_id: this.data.taoTuLayoutDataId,
      color_id: this.data.taoTuColorDataId,
      style_id: this.data.taoTuStyleDataId,
      area_id: this.data.taoTuAreaDataId
    })
  },
  //获取套图
  getSuite: function (data) {
    wx.showLoading({
      title: '正在加载...',
    })
    this.hide()
    getSuite(data).then(res => {
      if (res.status === 200) {
        res.data.forEach(item => {
          if (item.sub_images == undefined) {
            item.sub_images = [{ id: item.id, img_url: 'https://back.tobosu.com/new_impress_pic/small/2018-06-07/5b18ab811e404.jpg' }]
          }
        })
        this.setData({
          isRefesh: false,
          taotuList: this.data.taotuList.concat(res.data)
        })
        wx.hideLoading()
      } else if (res.status === 201) {
        wx.hideLoading()
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log('' + err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败！',
      })
    })
  },
   //获取单图
  getSingle: function (data) {
    wx.showLoading({
      title: '正在加载...',
    })
    getSingle(data).then(res => {
      if (res.status === 200) {
        res.data.forEach((item, i) => {
          if(item.sub_images == undefined) {
            item.sub_images = [{ id: item.id, img_url: 'https://back.tobosu.com/new_impress_pic/small/2018-06-07/5b18ab811e404.jpg'}]
          }
        })
        this.setData({
          isRefesh: false,
          dantuList: this.data.dantuList.concat(res.data)
        })
        wx.hideLoading()
      } else if (res.status === 201) {
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
        wx.hideLoading()
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败！',
      })
    })
  },
  tosj: function (e) {
    wx.navigateTo({
      url: '/pages/sjPage/sjPage',
    })
  },
  //单图预览
  toImageSingle: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.type === 3) { //1：套图；3：广告图
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
        } catch (err) { 
          console.log(err)
        }
        if (item.original_type==2) {
          wx.navigateTo({
            url: '/pages/price/price',
          })
        } else if (item.original_type == 1) {
          wx.navigateTo({
            url: '/pages/sjPage/sjPage',
          })
        }
      }
      return
    }
    //优化 图片加载太多的话小程序性能太差 固定取点击的图片前后20张到详情页，
    var prev = []
    var next = []
    var data = []
    var length = 20 //截取长度  可以修改
    var index = e.currentTarget.dataset.index
    var prevPosition = index - length //往上截取的位置 往下直接从index开始
    prev = this.data.dantuList.slice(prevPosition < 0 ? 0 : prevPosition, index)
    next = this.data.dantuList.slice(index, index + length)
    console.log(index, prevPosition, this.data.dantuList, prev,next)
    data =prev.concat(next)
      wx.setStorage({
        key: "danTuImageList",
        data: data
      })
      wx.setStorage({
        key: "danTuImageListIndex",
        data: index >= length ? length : index  //点击的位置小于截取的位置 就用点击的位置，否则就用截取的next数组第一个元素
      })
      wx.navigateTo({
        url: '/pages/imageSingle/imageSingle?index=' + e.currentTarget.dataset.index,
      })
  },
  toimagesLibrary: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.type == 1) { //1：套图；3：广告图
      wx.setStorage({
        key: "taoTuImageList",
        data: this.data.taotuList
      })
      wx.setStorage({
        key: "taoTuImageListIndex",
        data: e.currentTarget.dataset.index
      })
        wx.navigateTo({
          url: '/pages/imageLibrary/imageLibrary?index=' + e.currentTarget.dataset.index,
        })
    } else if (item.type ==3) {
      if (item.jump_type == 1) { //链接
        wx.navigateTo({
          url: '/pages/web/web?url=' + encodeURIComponent(item.jump_url)
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
  hide: function () {
    this.setData({
      tabType: -1,
      showTabItem: false
    })
  },
  onShow: function () {
    var tukuType = App.globalData.tukuType
    if (tukuType.reflash) { //首页点击来的类型，是否要刷新图库页面的数据
      if (tukuType.type == 'kj') {  // 点击了空间  切换到单图
        this.setData({
            taotuActive: false,
            dantuActive: true,
            showTabItem: false,
            dantuPartDataTxt: '局部',
            dantuStyleDataTxt: '风格',
            dantuColorDataTxt: '颜色',
            danTuStyleDataId: 0,
            danTuColorDataId: 0,
            danTuPartDataId: 0,
            dantuSpaceDataId: tukuType.typeId,
            dantuSpaceDataTxt: tukuType.txt
        })
          this.getSingle({
            token: App.globalData.token,
            page: 1,
            pageSize: this.data.pageSize,
            space_id: this.data.dantuSpaceDataId,
            color_id: 0,
            part_id: 0,
            style_id: 0,
            dantuList: []
          })
      } else if (tukuType.type == 'fg') {  // 点击了风格  切换到套图
        this.setData({
          taotuActive: true,
          dantuActive: false,
          showTabItem: false,
          taoTuLayoutDataId: 0,
          taoTuAreaDataId: 0,
          taoTuColorDataId: 0,
          taotuLayoutDataTxt: '户型',
          taotuAreaDataTxt: '面积',
          taotuColorDataTxt: '颜色',
          taoTuStyleDataId: tukuType.typeId,
          taotuStyleDataTxt: tukuType.txt,
          taotuList: []
        })
        this.getSuite({
          token: App.globalData.token,
          page: 1,
          pageSize: this.data.pageSize,
          layout_id: 0,
          color_id: 0,
          style_id: this.data.taoTuStyleDataId,
          area_id: 0
        })
      } else if (tukuType.type == 'hx') { // 点击了风格  切换到套图
        this.setData({
          taotuActive: true,
          dantuActive: false,
          showTabItem: false,
          taoTuStyleDataId: 0,
          taoTuAreaDataId: 0,
          taoTuColorDataId: 0,
          taotuStyleDataTxt: '风格',
          taotuAreaDataTxt: '面积',
          taotuColorDataTxt: '颜色',
          taoTuLayoutDataId: tukuType.typeId,
          taotuLayoutDataTxt: tukuType.txt,
          taotuList: []
        })
        this.getSuite({
          token: App.globalData.token,
          page: 1,
          pageSize: this.data.pageSize,
          layout_id: this.data.taoTuLayoutDataId,
          color_id: 0,
          style_id: 0,
          area_id: 0
        })
      }
    }
    App.globalData.tukuType = {}
  },
  onLoad:  function () {
    this.getTitleInfo(1)
    this.getTitleInfo(2)
    if (!App.globalData.tukuType.reflash) {
      this.getSuite({
        token: App.globalData.token,
        page: this.data.taoTuPageNo,
        pageSize: this.data.pageSize
      })
    }
  },
  bindscrolltolower: function (e) {
   if (this.data.taotuActive) {
     this.setData({
       taoTuPageNo: ++this.data.taoTuPageNo
     })
     this.getSuite({
       token: App.globalData.token,
       page: this.data.taoTuPageNo,
       pageSize: this.data.pageSize,
       layout_id: this.data.taoTuLayoutDataId,
       color_id: this.data.taoTuColorDataId,
       style_id: this.data.taoTuStyleDataId,
       area_id: this.data.taoTuAreaDataId
     })
   } else {
     this.setData({
       danTuPageNo: this.data.danTuPageNo +=1
     })
      this.getSingle({
       token: App.globalData.token,
       page: this.data.danTuPageNo,
       pageSize: this.data.pageSize,
       space_id: this.data.dantuSpaceDataId,
       color_id: this.data.danTuColorDataId,
       part_id: this.data.danTuPartDataId,
       style_id: this.data.danTuStyleDataId
     })
   }
  },
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletouchmove: function (event) {
    this.data.moveY = Math.abs(this.data.lastX - event.touches[0].pageX)
  },
  handletouchend: function (event) {
    if (event.changedTouches[0.].clientX - this.data.lastX < 0 && this.data.moveY > 60) {//左滑并且距离大于60
      if (this.data.taotuActive) { //如果显示的套图 就切换单图
        this.switchDanTu()
      } else if (this.data.dantuActive) {
        this.switchTaoTu()
      }
    } else if (event.changedTouches[0.].clientX - this.data.lastX > 0 && this.data.moveY > 60) {  //右滑并且距离大于60
      if (this.data.taotuActive) { //如果显示的套图 就切换单图
        this.switchDanTu()
      } else if (this.data.dantuActive) {
        this.switchTaoTu()
      }
    }
    this.data.moveY = 0
  },
  //下拉刷新 判断当前是单图还是套图
  onPullDownRefresh: function (e) {
    this.setData({
      isRefesh: true,
      taotuList: []
    })
    wx.stopPullDownRefresh()
    if (this.data.taotuActive){
      this.getSuite({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        layout_id: this.data.taoTuLayoutDataId,
        color_id: this.data.taoTuColorDataId,
        style_id: this.data.taoTuStyleDataId,
        area_id: this.data.taoTuAreaDataId
      })
    } else if (this.data.dantuActive) {
      this.getSingle({
        token: App.globalData.token,
        page: 1,
        pageSize: this.data.pageSize,
        space_id: this.data.dantuSpaceDataId,
        color_id: this.data.danTuColorDataId,
        part_id: this.data.danTuPartDataId,
        style_id: this.data.danTuStyleDataId
      })
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: App.globalData.shear.title,
      desc: App.globalData.shear.desc,
      path: App.globalData.shear.path
    }
  }
})