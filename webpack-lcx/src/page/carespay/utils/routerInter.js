import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgressbar from 'nprogress';
import 'nprogress/nprogress.css';
// import Vuex from 'vuex';


Vue.use(VueRouter);

import routes from './route.js';
import store from './store.js';

import {
    AutoPayIsAvailable,
} from '../../../js/api.js';

import { queryPersonInfo } from './localbase.js';
import { format } from 'path';

const RM = new VueRouter({routes});
// const store = new Vuex.Store(stores);

let RouterState = {
    flag:false,
}

RM.beforeEach((to,from,next)=>{
    NProgressbar.start();

    
   if(!to.name) next({name:'P404'});

    switch(to.name){
        //只有实名认证而且实名认证不失败才能访问
        case 'CashAccountContainer':    //提现账户
        case 'AutoPay':                  //自动提现页面
        case 'Cash':                    //提现页面
        case 'AddShop':                 //添加店铺
        case 'RealName':                //账户中心--实名认证展示
        {

             queryPersonInfo().then(res=>{

                if(res){
                    return res
                }else{
                    store.commit('changeModleState',true),next(false)
                };
               
                       
            }).then(res=>{

                if(!res) return;

                if(to.name=='RealName') return next()

                res.status==3 ? (
                    store.commit('changeAppModel',{
                        name:'AuthentyIsError',
                        value:true
                    }),next(false)
                ):(
                    store.commit('changeAppModel',{
                        name:'AuthentyIsError',
                        value:false
                    }),next()
                )

            });
        }
        break;
        // 完善实名认证的页面--如已经实名认证 不让其访问
        case 'CompleteAccount':
        case 'CompleteName':
        case 'CompleteCompany':
        case 'CompleteHK':
        {
            RouterState.flag?
            (next({name:'P404'})):
            (
                queryPersonInfo().then(res=>{
                    res?
                        (
                            RouterState.flag = true,
                            next({name:'P404'})
                        ):
                        (next());
                })
            );
        }
        break;
        //自动提现的页面
        case 'AutoPay':
        {
            queryPersonInfo().then(res=>{
                res?
                    (
                        //实名认证的标识
                        RouterState.flag = true,

                        AutoPayIsAvailable().then(iRes=>{
                            if(iRes.code==0){
                                iRes.data==1 ? (
                                    next()
                                ):(
                                    store.commit('changeAppModel',{
                                        name:'AppAutoPayPop',
                                        value:true
                                    })
                                )
                            }else{
                                console.log('请求报错了');
                            }
                        })
                    ):
                    (
                        //实名认证提示
                        store.commit('changeModleState',true),next(false)
                    );
            })
        }
        break;
        default :
        {
            next();
        }
        break
    }
    
});

RM.afterEach(to=>{
    NProgressbar.done();
    // document.scrollTop = "0px";
    window.scrollTo(0,0);
});

export default RM;