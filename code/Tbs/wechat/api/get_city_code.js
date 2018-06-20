import config from '../utils/config'
import util from '../utils/index';

export function getCityCode(params, curCity) {
  let domain = config.domain
  let opt = {
    url: '' + domain + '/tapi/passport/m_get_city_code?cityname=' + curCity,
    method: 'GET',
    data: params
  }
  return util.request(opt);
}
