import config from '../utils/config'
import util from '../utils/index';

export function getCityData(params, complete) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/tapi/smallprogram/getCityData',
    method: 'POST',
    data: params
  }
  return util.request(opt, complete);
}
var provinceList = [{ provinceid: 0, order: "", full_name: "选择省份" },
{ provinceid: 33, order: "A", full_name: "澳门" },
{ provinceid: 12, order: "A", full_name: "安徽省" },
{ provinceid: 1, order: "B", full_name: "北京市" },
{ provinceid: 22, order: "C", full_name: "重庆市" },
{ provinceid: 13, order: "F", full_name: "福建省" },
{ provinceid: 19, order: "G", full_name: "广东省" },
{ provinceid: 20, order: "G", full_name: "广西壮族自治区" },
{ provinceid: 24, order: "G", full_name: "贵州省" },
{ provinceid: 28, order: "G", full_name: "甘肃省" },
{ provinceid: 3, order: "H", full_name: "河北省" },
{ provinceid: 16, order: "H", full_name: "河南省" },
{ provinceid: 8, order: "H", full_name: "黑龙江省" },
{ provinceid: 17, order: "H", full_name: "湖北省" },
{ provinceid: 18, order: "H", full_name: "湖南省" },
{ provinceid: 21, order: "H", full_name: "海南省" },
{ provinceid: 7, order: "J", full_name: "吉林省" },
{ provinceid: 10, order: "J", full_name: "江苏省" },
{ provinceid: 14, order: "J", full_name: "江西省" },
{ provinceid: 6, order: "L", full_name: "辽宁省" },
{ provinceid: 5, order: "N", full_name: "内蒙古自治区" },
{ provinceid: 30, order: "N", full_name: "宁夏回族自治区" },
{ provinceid: 29, order: "Q", full_name: "青海省" },
{ provinceid: 9, order: "S", full_name: "上海市" },
{ provinceid: 15, order: "S", full_name: "山东省" },
{ provinceid: 4, order: "S", full_name: "山西省" },
{ provinceid: 23, order: "S", full_name: "四川省" },
{ provinceid: 27, order: "S", full_name: "陕西省" },
{ provinceid: 2, order: "T", full_name: "天津市" },
{ provinceid: 34, order: "T", full_name: "台湾" },
{ provinceid: 32, order: "X", full_name: "香港" },
{ provinceid: 26, order: "X", full_name: "西藏自治区" },
{ provinceid: 31, order: "X", full_name: "新疆维吾尔族" },
{ provinceid: 25, order: "Y", full_name: "云南省" },
{ provinceid: 11, order: "Z", full_name: "浙江省" }
]
exports.provinceList = provinceList
exports.provinceId = function (name) {
  var item = {}
  for (var i = 0; i < provinceList.length; i++) {
    if (provinceList[i].full_name == name) {
      item = provinceList[i]
      break
    }
  }
  return { "province_id": item.provinceid, full_name: item.full_name}
}