import { getCityData, provinceList} from '../../api/get_city_data'
import { getCityCode } from '../../api/get_city_code'
const App = getApp();

Component({
    data: {
        isModal: true,
        isShow: false,
        current_p: App.globalData.position[0] || { full_name: '选择省份', province_id: 0 },
        current_c: App.globalData.position[1] || { full_name: '选择城市', city_id: 0 },
        cityArray: [{ city_id: 0, full_name: "选择城市" }],
        provinceArray: provinceList,
        cityGrade: 0
    },
    created: function () {
    },
    methods: {
      getCity: function () {
        let that = this;
        wx.showLoading({
          title: '正在加载',
        });
        let province_id = that.data.current_p.province_id;
        if (!province_id) {
          wx.hideLoading()
          return that.setData({
            cityArray: [{ city_id: 0, full_name: "选择城市" }]
          });
        }
        let params = {
          id: province_id
        }, complete = function () {
          wx.hideLoading();
        }
        getCityData(params, complete).then(response => {
          let res = response;
          if (res.error_code == 0) {
            that.setData({
              cityArray: res.cityData
            });
          }
        })
      },
      getGrade: function () {
        let that = this;
        let params = {};
        let curCity = App.globalData.position[1].full_name;
        getCityCode(params, curCity).then(response => {
          let res = response;
          let citygrade = null;
          if (res.error_code == 0) {
            citygrade = res.data.city_grade;
          }
          that.setData({
            cityGrade: citygrade
          })
          App.globalData.city_grade = citygrade
        })
      },
      choseProvince: function (e) {
        if (this.data.current_p.province_id == e.currentTarget.dataset.id) return;
        this.setData({
          current_p: { full_name: e.currentTarget.dataset.name, province_id: e.currentTarget.dataset.id }
        });
        App.globalData.position[0] = this.data.current_p;
        this.getCity();
      },
      choseCity: function (e) {
        this.setData({
          current_c: { full_name: e.currentTarget.dataset.name, city_id: e.currentTarget.dataset.id }
        });
        App.globalData.position[1] = this.data.current_c;
        this.getGrade()
        this.hideList();
        this.triggerEvent('choseCityEvent');
      },
      showList: function () {
        var that = this;
        this.setData({
          isModal: false
        });
        setTimeout(function () {
          that.setData({
            isShow: true
          })
        }, 100);
      },
      hideList: function () {
        var that = this;
        this.setData({
          isShow: false
        });
        setTimeout(function () {
          that.setData({
            isModal: true
          })
        }, 300);
      }
    }
});