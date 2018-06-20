import config from '../utils/config'
import util from '../utils/index';

export function getQrcodeRalation(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/tapi/wechat/get_qrcode_ralation',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
