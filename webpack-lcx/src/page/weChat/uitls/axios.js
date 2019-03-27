import Axios from 'axios';
import {Message,Loading } from 'element-ui';
import NProgressbar from 'nprogress';
import 'nprogress/nprogress.css';


// Axios.defaults.baseURL = DOMAIN.url;
let weChatLoading = null;

//请求拦截--请求之前的拦截
Axios.interceptors.request.use(function(config) {
    // NProgressbar.start();
    weChatLoading = Loading.service({
        lock: true,
        text: 'Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    // 在发送请求之前做些什么
    //数据已formData传输到后台
    config['transformRequest'][0] = function(data){
        let ret = ''
        for (let it in data) { 
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        };
        return ret 
    }
    return config;
});

//请求拦截--请求回来对响应体的拦截
Axios.interceptors.response.use(function(res) {
    // NProgressbar.done();
    weChatLoading.close();
    //对请求回来的错误码进行判断处理
    // console.log(res);
    return res.data;

}, function(res) {
    weChatLoading.close();
    // NProgressbar.done();
    // 对响应错误做点什么 比如接口不存在等
    if(res.response){
        let r = res.response;

        switch(r.status){
            case 500:
                {//
                    Message.error(`系统繁忙，请稍后重试`);
                }
                break;
            default:
            {
                Message.error(r.data.msg)
            }
        }

    }else{
        Message.error(`服务器繁忙！`)
    }
    // return Promise.reject(error);
});

module.exports = Axios;
