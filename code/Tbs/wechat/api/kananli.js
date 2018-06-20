import config from '../utils/config'
import util from '../utils/index'
function kananli(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/case/index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function kananliDetail(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/case/detail',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
exports.kananli = kananli
exports.kananliDetail = kananliDetail