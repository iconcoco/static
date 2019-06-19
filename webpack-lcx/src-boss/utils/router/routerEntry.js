import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgressbar from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

import { routes } from './router.js';
import store from '../store/storeEntry.js';         //引入状态管理


let appTabName = ['index'];                         //能用tab切换的组件的name

const RM = new VueRouter({routes,mode:'hash'});

RM.beforeEach((to,from,next)=>{
    NProgressbar.start();
    //1. 如果访问的路由不存在
    if(!to.name){ next({name:'page404'}) };


    //2. 如果是后台系统
    if(/\/admin\//.test(to.path)){
        //2.1 后台系统页面的权限
        let Authority = store.state.Authority;
        if(Authority.indexOf(to.name)>-1){
            let TabData = store.state.TabData;
            TabData.forEach(item=>{
            //2.1 当前打开的页面是否可以通过tab切换,可以使用tab切换将页面的路径存起来
                (item.name == to.name) && store.commit('setTabList',item);
                appTabName.indexOf(to.name)<0 && appTabName.push(item.name);
            });
            //2.2 设置当前活动组件的名字 当前组件的名字是tab中的才改变当前活动tab的组件名字
            appTabName.indexOf(to.name)>-1 && store.commit('setCurrentView',to.name);
            next();
        }else{
            //2.3 跳转到后台404页面
            store.commit('setCurrentView','index');
            next({name:'index'})
        }

    }else{
        next();
    }
 
    
});


RM.afterEach((to) => {  
    NProgressbar.done();
});

export default RM;