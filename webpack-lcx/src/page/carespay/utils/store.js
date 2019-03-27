import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let config = {
    state:{
        base:{},                    //基本数据保存
        cityData:{},                //城市列表的数据缓存
        RealNamePop:false,
        AuthentyIsError:false,        //实名认证是失败的
        AppAutoPayPop:false,
        notifyData:[],

        BankCark:{},                //银行卡id对应的详细信息 


        STOREMODLE:null,          //店铺管理模块数据
        WITHDRAWMODLE:null,       //提现账户模块数据
        CASHMODLE:null,           //提现店铺模块数据
    },
	mutations:{
        /**
         * 1.保存全局基本公共数据
         * @param {*} state 
         * @param {*} params 数据对象，key要保存的key值，data需要保存的数据 
         * Author:Lcx
         * 2018/7/30
         * 641616451@qq
         */
        setBaseDate(state,params){
            state.base[params.key] = params.data;
        },
        /**
         * 2. 各模块数据存储
         * @param {*} state 
         * @param {*} params key 保存模块的名称； data 对应模块的数据
         * Author:Lcx
         * 2018/7/31
         * 641616451@qq
         */
        saveModleData(state,params){
            state[params.key] = params.data;
        },
       /**
         * 3. 城市列表数据存储
         * @param {*} state 
         * @param {*} params key 保存省份code； data 对应的城市列表
         * Author:Lcx
         * 2018/8/1
         * 641616451@qq
         */
        cityDataCache(state,params){
            state.cityData[params.key] = params.data;
        },
         /**
         * 4. 银行卡id详细信息缓存
         * @param {*} state 
         * @param {*} params key 银行卡id； data 对应的银行卡详细信息
         * Author:Lcx
         * 2018/8/3
         * 641616451@qq
         */
        bankInfoDataCache(state,params){
            state.BankCark[params.key] = params.data;
        },
        /**
         * 5. 实名认证的消息提示框状态
         * @param {*} state 
         * @param {*} bol 布尔值
         */
        changeModleState(state,bol){
            state.RealNamePop = bol;
        },
        setNotifyData(state,data){
            state.notifyData = data;
        },

        changeAppModel(state,params){
            state[params.name] = params.value
        }
    },
}



export default new Vuex.Store(config)