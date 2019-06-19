import Axios from 'axios';
import { Message } from 'element-ui';
import NProgressbar from 'nprogress';
import 'nprogress/nprogress.css';

//请求拦截--请求之前的拦截
Axios.interceptors.request.use(function(config) {
    NProgressbar.start();
    // 在发送请求之前做些什么
    //数据已formData传输到后台

    !config.JSON && (config.headers["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8");

    !config.JSON && (config['transformRequest'][0] = function(data){
        if(config.JSON){
            return data;
        }else{
            let ret = ''
            for (let it in data) { 
                ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])=='null'?'':encodeURIComponent(data[it])}&`
            };
            return ret 
        }
    })

    return config;
});

//请求拦截--请求回来对响应体的拦截
Axios.interceptors.response.use(function(res) {
    NProgressbar.done();
    //对请求回来的错误码进行判断处理
    // console.log(res);
    return res.data;

}, function(res) {
    NProgressbar.done();
    // 对响应错误做点什么 比如接口不存在等
    // console.log(`---------------------`);
    // console.log(res);
    if(res.response){
        let r = res.response;
        switch(r.status){
            case 401:
                {// 无权限
                    Message.error(`对不起，您暂无权限做此操作，请联系管理员！`);
                }
                break;
            case 403:
                {// 未登陆 跳转到登陆页
                    location.hash = `/index/login`;
                }
                break;
            case 500:
                {//
                    Message.error(`系统繁忙，请稍后重试`);
                }
                break;
            default:
                {
                    Message.error(r.data.msg || `Error Code：${r.status}` );
                }
        }

    }else{
        Message.error(`服务器繁忙！`)
    }
    // return Promise.reject(error);
});

module.exports = Axios;
