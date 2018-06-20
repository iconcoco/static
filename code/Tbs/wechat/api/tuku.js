import config from '../utils/config'
import util from '../utils/index';

function getTitleInfo(params) {
  let domain = config.domain
  var url = ''
  if (params.type==1) {
    url = '/applets/impressionClass/suite_class'
  } else {
    url = '/applets/impressionClass/single_class'
  }
  let opt = {
    url: '' + domain + url,
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
//http://www.dev.tobosu.com/applets/Impression/index
//http://www.dev.tobosu.com/applets/ImpressionSingle/index
function getSuite(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/applets/ImpressionSuite/index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
function getSingle(params) {
  let domain = config.domain
  var url = ''
  let opt = {
    url: '' + domain + '/applets/ImpressionSingle/index',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
exports.getTitleInfo = getTitleInfo
exports.getSuite = getSuite
exports.getSingle = getSingle
