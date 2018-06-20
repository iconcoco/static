import config from '../utils/config'
import util from '../utils/index';
function clickCount(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/DataRecord/click_count',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function labelClickCount(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/DataRecord/label_click_count',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
exports.clickCount = clickCount
exports.labelClickCount = labelClickCount