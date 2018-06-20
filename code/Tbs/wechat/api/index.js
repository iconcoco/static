import config from '../utils/config'
import util from '../utils/index'
function getToken(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/token/get_token',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function index(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/index/index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function change_batch(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/ImpressionSuite/change_batch',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
exports.getToken = getToken
exports.index = index
exports.change_batch = change_batch