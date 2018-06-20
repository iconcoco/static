'use strict'
import config from './config'

const DEFAULT_REQUEST_OPTIONS = {
    url: '',
    method: 'GET',
    data: {},
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

let util = {
    request(opt, doComplete) {
        let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
        let { url, method, data, header} = options
        let self = this
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                data,
                header,
                method,
                success(res) {
                    let data = res.data;
                    resolve(data)
                },
                fail(err) {
                    reject(err)
                },
                complete() {
                    if (typeof doComplete == "function") {
                        doComplete();
                    }
                }
            })
        })
    },
    validate: function (value, type) {
        var value = value.trim();
        if ('require' === type) {
          return !!value;
        }
        if ('num' === type) {
          return parseInt(value)> 0;
        }
        // 匹配非中文
        if ('chinese' === type) {
          return /[^\u4E00-\u9FA5]/g.test(value);
        }
        if ('phone' === type) {
          return /^1[3-9][0-9]{9}$/.test(value);
        }
    },
    getCurrentPageUrl: function () {
        let page = getCurrentPages();
        let current = page[page.length - 1];
        let params = '';
        for (let k in current.options) {
            params += k + '=' + current.options[k] + '&'
        }
       
        let url = current.route + '?' + params;
        return url;
    }
}

export default util