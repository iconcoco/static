import {adminOther} from '../router/router.js';

let Authority = [];
//不需要权限的路由
adminOther.forEach(item=>{
    item.children.forEach(innerItem=>{
        Authority.push(innerItem.name);
    });
});

export default {
    state:{
       
        TabCurrentName:'',                             //Admin 当前浏览的组件名字
        TabData:[],                                    //tab切换的数据
        TabList:[],                                    //当前活动的组件的数据
        Authority,                                      //权限列表
        Memory:{ },                                      //各页面需要保存状态的对象数据
        baseData:{ },                                   //基本数据
    },
    mutations:{
         /**
         * 6. 还换仓库到初始状态
         */
        clearState(state){
            for (const k in state) {
                // console.log(typeof(state[k]=='string',state[k])
                if(k=="Authority") {    //权限，有默认访问不需要请求的目录
                    let Auth= [];
                    adminOther.map(item=>{
                        item.children.map(innerItem=>{
                            Auth.push(innerItem.name);
                        });
                    });
                    state[k] = Auth;
                 continue;
                };

                if(k=="TabCurrentName") continue;

                if(typeof(state[k])=='string'){
                    state[k] = "";
                }else{
                    Object.prototype.toString.call(state[k]).slice(8,-1)=='Array' && (state[k] = []);
                    Object.prototype.toString.call(state[k]).slice(8,-1)=='Object' && (state[k] = {});
                }
            };
        },
        /**
         * 1. 设置当前活动组件的tab
         * @param {*} state 
         * @param {*} params 
         */
        setTabList(state,params){//{name,page}
            //1. 设置当前的活动组件名称
            // state.TabCurrentName = params.name;
            //2. 当前活动组件数据添加
            if(state.TabList.length){
                let flag = true;
                state.TabList.forEach(item=>{
                    if(item.name == params.name){
                        return flag = false;   
                    }
                });
                flag && state.TabList.push(params);
            }else{
                state.TabList.push(params);
            }
        },
        /**
         * 2. 设置当前活动的组件
         * @param {*} state 
         * @param {*} name 
         */
        setCurrentView(state,name){
            state.TabCurrentName = name;
        },
         /**
         * 3. 设置tab活动的数据来源
         * @param {*} state 
         * @param {*} item 
         */
        setTabData(state,item){
            state.TabData.push(item);
        },
        /**
         * 4. 各模块需要储存的数据
         * @param {*} state 
         * @param {*} params 
         */
        setModelRecordData(state,params){
            state.Memory[params.key] = params.data;
        },
        /**
         * 5. 基础数据
         * @param {*} state 
         * @param {*} params 
         */
        setBaseData(state,params){
            state.baseData[params.key] = params.data;
        },
       
    }
}