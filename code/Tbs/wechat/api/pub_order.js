import config from '../utils/config'
import util from '../utils/index';

export function pubOrder(params) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/tapi/order/pub_order',
    method: 'POST',
    data: params
  }
  return util.request(opt);
}
