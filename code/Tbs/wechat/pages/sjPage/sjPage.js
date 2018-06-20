//index.js
//获取应用实例
const App = getApp();
import { getCurrentPageUrl } from './../../utils/util'
import { pubOrder } from '../../api/pub_order'
// 获取需要用的公共函数模块



Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWrong: true,
    num: {
      ten: null,
      per: null
    },
    scrollTop: {
      isShow: false,
      value: 0
    },
    scrollAnimate: {
      isShow: false,
      value: 0
    },
    isRun: false,
    formdata: {
      name: "",
      cellphone: ""
    },
    broadTxt: {
      city: "",
      gentle: '',
      timer: '',
      name: ''
    },
    flag: true,
    msg: "",
    isModal: false,
    backToTop: 0,
    position: App.globalData.position //当前选中的城市信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });

    this.setData({
      urlhistory: getCurrentPageUrl()
    });
    // 入口渠道码
    options && this.setData({
      chcode: options.chcode || 0,
      subchannel: options.subchannel || 0,
      pos: options.pos || 0,
      channel: options.channel || 0,
    });



    //获取当前时间
    let timer = new Date().getHours(),
      num = null;

    if (timer < 8) {
      num = 98;
    } else if (timer < 12) {
      num = Math.floor(Math.random() * 20) + 40;
    } else if (timer < 16) {
      num = Math.floor(Math.random() * 20) + 20;
    } else if (timer < 21) {
      num = Math.floor(Math.random() * 10) + 10;
    } else {
      num = Math.floor(Math.random() * 10) + 1;
    }
    // 设置设计剩余的名额
    this.setData({
      num: {
        ten: Math.floor(num / 10),
        per: num % 10
      }
    });

    //设置播报动画
    setTimeout(function () {
      //1.onload change broadcast  text
      this.broad();
      //2.add animate
      this.setData({
        isRun: true
      });

    }.bind(this), 3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
    // 成功之后的提示组件
    this.sucessPop = this.selectComponent('#sucess_pop');
    //选择城市的组件
    this.choseCity = this.selectComponent('#chose_city');


    //获取设备的可视高度 -- 设置动画用的
    let windowheight = 400;
    wx.getSystemInfo({
      success: function (res) {
        windowheight = res.windowHeight;
      }
    });

    // 获取 滚屏首屏的高度
    if (wx.createSelectorQuery) {
      let that = this,
        query = wx.createSelectorQuery();
      query.select('#intro').boundingClientRect()
      query.select('#pro_design').boundingClientRect()
      query.select('#place_name').boundingClientRect()
      query.exec(function (res) {
        console.log(res)
        //设置高度
        that.setData({
          scrollTop: {
            isShow: false,
            value: res[0].top
          },
          scrollAnimate: {
            isShow: false,
            value: (res[1].top - windowheight)
          },
          backToTop: res[2].top - 10
        });

      });

    } else {
      that.setData({
        scrollTop: {
          isShow: false,
          value: 700
        },
        scrollAnimate: {
          isShow: false,
          value: 1118
        }
      });
    }

  },
  /**
   *页面滚动的时候触发的函数 -- 如果组件为scroll-view则没有效果
   */
  onPageScroll: function (e) {
    // console.log(e);
    let scrollTop = e.scrollTop;
    // console.log(this.data.scrollTop.value);
    if (scrollTop > this.data.scrollTop.value) {
      this.setData({
        scrollTop: {
          isShow: true,
          value: this.data.scrollTop.value
        }
      });
    } else {
      this.setData({
        scrollTop: {
          isShow: false,
          value: this.data.scrollTop.value
        }
      });
    }

    if (scrollTop > this.data.scrollAnimate.value) {
      !this.data.scrollAnimate.isShow && this.setData({
        scrollAnimate: {
          isShow: true,
          value: this.data.scrollAnimate.value
        }
      });
    }
  },
  /**
   * 首页滚动
   */
  pageScroll: function (e) {
    // console.log(e.detail.scrollTop);
    let scrollTop = e.detail.scrollTop;
    // console.log(this.data.scrollTop.value);
    if (scrollTop > this.data.scrollTop.value) {
      this.setData({
        scrollTop: {
          isShow: true,
          value: this.data.scrollTop.value
        }
      });
    } else {
      this.setData({
        scrollTop: {
          isShow: false,
          value: this.data.scrollTop.value
        }
      });
    }

    if (scrollTop > this.data.scrollAnimate.value) {
      !this.data.scrollAnimate.isShow && this.setData({
        scrollAnimate: {
          isShow: true,
          value: this.data.scrollAnimate.value
        }
      });
    }

  },
  /**
   * 提交表单--发单了
   */
  formSubmit: function (e) {
    let m = e.detail.value, //表单中的数据
      f = true,
      that = this;

    //循环遍历必填项
    for (let k in m) {
      let msg = null;
      switch (k) {
        case 'ownername':

          {
            if (!m[k].trim()) {
              msg = "请输入您的称呼";
              f = false;
              break;
            }

            var reg = /[^\u4E00-\u9FA5]/g;
            if (reg.test(m[k]) && typeof (m[k]) != 'undefined') {
              msg = "称呼只允许输入中文";
              f = false;
              break;
            }

          }
          break;
        case 'cellphone':
          {
            if (!m[k].trim()) {
              msg = "请输入手机号码"
              f = false;
              break;
            }
            var reg = /^1[3-9][0-9]{9}$/;
            if (!reg.test(m[k])) {
              msg = "请填写正确的手机号码";
              f = false;
              break;
            }
          }
          break;
        case 'city':
          {
            if (m[k] == 0) {
              msg = "请选择城市"
              f = false;
            }
          }
          break;
      };
      //出错就提示
      if (!f) {
        return this.promp(msg);
      }
    }

    if (f) {
      //如果都填写了就发送发单的请求
      wx.showLoading({
        title: '正在申请...',
      });
      //请求发单接口
      pubOrder(m).then(res => {
        wx.hideLoading()
        if (!res.error_code) {
          that.setData({
            formdata: {
              name: '',
              cellphone: ''
            },
            position: [that.data.position[0], { full_name: '请选择城市', city_id: 0 }]
          });
          //3.公共数据中的也要回到初始状态
          App.globalData.position = [that.data.position[0], { full_name: '请选择城市', city_id: 0 }];
          that.sucessPop.setData({
            isShow: true
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
          })
        }
      })
    }
  },
  /**
   * 输入框获取焦点的时候触发的事件
   */
  iptfocus: function (e) {

    let index = e.target.dataset.index;

    switch (index) {
      case '1':
        {
          this.setData({
            holder: true
          })
        }
        break;
      case '2':
        {
          this.setData({
            holder_2: true
          })
        }
        break;
    }


  },
  /**
   * 输入框失去焦点触发的事件
   */
  iptblur: function (e) {
    let index = e.target.dataset.index
    switch (index) {
      case '1':
        {
          this.setData({
            holder: false
          })
        }
        break;
      case '2':
        {
          this.setData({
            holder_2: false
          })
        }
        break;
    }
  },
  /**
   * 点击展示城市选择
   */
  showCity: function (e) {
    this.choseCity.showList();
    this.setData({
      isModal: true
    });
  },
  /**
   * 当前页面发单的错误提示窗口
   */
  promp: function (msg) {

    if (!this.data.flag) return;

    this.setData({
      isWrong: false,
      msg: msg,
      flag: false
    });

    setTimeout(function () {
      this.setData({
        isWrong: true,
        flag: true
      });
    }.bind(this), 1000);
  },
  /**
   * 改变播报广告的内容
   */
  animationend: function () {
    this.broad();
  },
  broad: function () {
    let time = Math.ceil(Math.random() * 60),
      city = [
        '北京', '天津', '石家庄', '唐山', '秦皇岛', '太原', '大同', '长治', '呼和浩特', '包头', '沈阳', '大连', '长春',
        '哈尔滨', '上海', '南京', '无锡', '徐州', '常州', '苏州', '南通', '扬州', '杭州', '宁波', '温州',
        '嘉兴', '湖州', '绍兴', '金华', '台州', '合肥', '芜湖', '福州', '厦门', '南昌', '济南', '青岛', '烟台', '潍坊', '威海',
        '郑州', '武汉', '长沙', '广州', '深圳', '珠海', '佛山', '东莞', '中山', '南宁', '重庆', '成都', '贵阳', '昆明', '西安',
        '兰州', '江阴', '宜兴', '昆山', '张家港', '余姚', '慈溪'
      ],
      name = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '章', '苏', '潘', '葛', '奚', '范', '彭', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '齐', '黄', '萧', '尹', '姚', '祁', '宋', '熊', '舒', '屈', '项', '祝', '董', '梁', '杜', '席', '贾', '江', '郭', '林', '钟', '徐', '邱', '高', '田', '胡', '邓'],
      gentle = ["先生", "女士"],
      index_c = Math.floor(Math.random() * city.length),
      index_n = Math.floor(Math.random() * name.length),
      index_g = Math.floor(Math.random() * gentle.length);

    // change broadcast text
    this.setData({
      broadTxt: {
        city: city[index_c],
        gentle: gentle[index_g],
        timer: time,
        name: name[index_n]
      },
    });

  },
  /**
   * 回到顶部
   */
  backtop: function () {
    //当前的
    this.setData({
      toView: 'main_bg',
      scrollTop: {
        isShow: false,
        value: this.data.scrollTop.value
      }
    });

    wx.pageScrollTo({

      scrollTop: this.data.backToTop
    });

  },
  /**
   * 选择城市组件选中城市之后执行的函数
   */
  component_city: function () {
    this.setData({
      position: App.globalData.position
    });
  },
  /**
   * 选择城市组件关闭时候执行的函数
   */
  close_city_component: function () {
    this.setData({
      isModal: false
    })
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