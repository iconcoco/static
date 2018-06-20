import config from '../utils/config'
import util from '../utils/index';
function getlabel(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/SearchLabel/index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function getSearch(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/ImpressionSuite/search_index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
exports.getlabel = getlabel
exports.getSearch = getSearch