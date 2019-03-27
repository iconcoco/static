import Axios from 'axios';
import {Message } from 'element-ui';
import DOMAIN from './domain.js';
import NProgressbar from 'nprogress';
import 'nprogress/nprogress.css';


Axios.defaults.baseURL = DOMAIN.url;

//请求拦截--请求之前的拦截
Axios.interceptors.request.use(function(config) {
    NProgressbar.start();
    // 在发送请求之前做些什么

    !config.JSON && (config.headers["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8");

    !config.JSON && (config['transformRequest'][0] = function(data){
        if(config.JSON){
            return data;
        }else{
            let ret = ''
            for (let it in data) { 
                ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
            };
            return ret 
        }
    });

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
    let msg;
    if(res.response){
        let r = res.response;
        switch(r.status){
            case 403:
                {// 未登陆 跳转到登陆页
                    // Message.error(`您还没有权限，请重新登录！`)
                    // setTimeout(()=>{
                    //     if(location.href.indexOf(`login`)>0) return;
                    location.href = `${DOMAIN.login}`;
                    // },1000);
                }
                break;
            case 500:
                {//
                    // Message.error(`系统繁忙，请稍后重试`);
                    msg=`系统繁忙，请稍后重试`;
                }
                break;
            case 404:
                {//
                    // Message.error('404');
                    msg=`404`;
                }
                break;
            default:
            {
                // Message.error(r.data.msg);
                msg=r.data.msg;
            }

        }

    }else{
        // Message.error(`服务器繁忙！`);
        msg=`服务器繁忙！`;
    }

    return  new Proxy({
        msg,
        code:res.response.status
    },{
        get(target,prop){
            return target[prop];
        }
    });
});

module.exports = Axios;
