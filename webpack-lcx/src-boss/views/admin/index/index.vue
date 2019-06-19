<template>
    <div class="index-container fadeIn">
        <div class="index-max">
             <div class="admin-tab-title">每月入账走势</div>
             <div class="map">
                 <FoldLine :data="P_CSD"></FoldLine>
             </div>
        </div>
        <div class="index-min">
             <div class="admin-tab-title">本月入账统计
                 <a @click="bindToReadMore(`TMonthCSD`)" href="javascript:;">查看更多</a>
             </div>
             <div class="map">
                 <BarSingle :matter="true" TID="T_CSD" :data="T_CSD"></BarSingle>
             </div>
        </div>

        <div class="index-max">
             <div class="admin-tab-title">每月用户统计</div>
             <div class="map">
                  <Bars TID="P_USER" :data="P_USER"></Bars>
             </div>
        </div>
        <div class="index-min">
             <div class="admin-tab-title">本月用户统计
                 <a @click="bindToReadMore(`TMouthUSER`)" href="javascript:;">查看更多</a>
             </div>
             <div class="map">
                  <BarSingle :matter="true" TID="T_USER" :data="T_USER"></BarSingle>
             </div>
        </div>

        <div class="index-max">
             <div class="admin-tab-title">每月店铺统计</div>
             <div class="map">
                  <Bars TID="P_STORE" :data="P_STORE"></Bars>
             </div>
        </div>
        <div class="index-min">
             <div class="admin-tab-title">本月店铺统计
                 <a @click="bindToReadMore(`TMouthSTORY`)" href="javascript:;">查看更多</a>
             </div>
             <div class="map">
                 <BarSingle  :matter="true"  TID="T_STORE" :data="T_STORE"></BarSingle>
             </div>
        </div>

        <div class="index-max marginBTM">
             <div class="admin-tab-title">注册用户来源统计统计</div>
             <div class="map">
                 <Pie TID="P_SOURCE" :data="P_SOURCE" :text="{
                    title:'注册用户来源统计',
                    tip:'注册用户来源'
                 }"></Pie>
             </div>
        </div>
        <div class="index-min marginBTM">
             <div class="admin-tab-title">有效用户来源统计
                  <a @click="bindToReadMore(`TMouthSOURCE`)" href="javascript:;">查看更多</a>
             </div>
             <div class="map">
                 <Pie TID="T_SOURCE" :data="T_SOURCE" :text="{
                    title:'有效用户来源统计',
                    tip:'有效用户来源'
                 }"></Pie>
             </div>
        </div>


    </div>
</template>

<script>

    import FoldLine from './../DashBoard/FoldLine.vue';
    import BarSingle from './../DashBoard/BarSingle.vue';
    import Bars from './../DashBoard/Bars.vue';
    import Pie from './../DashBoard/Pie.vue';

    import { custemerSource } from '../../../ext/localBase.js';

    import { 
        queryCSDByMonthly,          //每月入账走势
        queryCSDByDailyThisMonth,   //本月入账走势
        queryUserDailiesByMonthly,   //每月用户统计
        queryUserDailiesByTheMonth,     //本月入账统计
        queryStoreDailiesByMonthly,     //每月店铺统计
        queryStoreDailiesByMonth,     //本月店铺统计
        queryUserStaticList,     //每月注册来源
         } from '../../../utils/axios/api.js';

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                P_CSD:{},
                T_CSD:{},
                P_USER:{},
                T_USER:{},
                P_STORE:{},
                T_STORE:{},
                P_SOURCE:{},
                T_SOURCE:{},
                custemerSource:{}
            }
        },
        components:{
            FoldLine,
            BarSingle,
            Bars,
            Pie,
        },
        methods:{
            __LOADING(){
                this.loadingQuery(),
                custemerSource().then(res=>{ this.custemerSource = res; })
            },
            loadingQuery(){
                Promise.all([
                 queryCSDByMonthly(),
                 queryCSDByDailyThisMonth(),
                 queryUserDailiesByMonthly(),
                 queryUserDailiesByTheMonth(),
                 queryStoreDailiesByMonthly(),
                  queryStoreDailiesByMonth(),     //本月店铺统计
                  queryUserStaticList(),            //每月注册来源
                ]).then(results=>{

                    results.map((res,index)=>{
                        if(res.code==0){
                            switch(index){
                                case 0:
                                {   //P_CSD  每月入账
                                    let P_CSD = {};
                                    res.data.map(item=>{
                                        if(!P_CSD.hasOwnProperty(item.month)){
                                            P_CSD[item.month] = [{"EUR":0},{"USD":0},{"JPY":0}];
                                        }; 

                                        let index = null;

                                        item.currency==`EUR` &&  (index=0);
                                        item.currency==`USD` &&  (index=1);
                                        item.currency==`JPY` &&  (index=2);

                                        // console.log(P_CSD);
                                        P_CSD[item.month][index][item.currency] = item.amount;
                                    });

                                    /**
                                     * {
                                     *  2018-10:[ {OY:188 },{USD:200} ],
                                     *  2018-11:[ {OY:181 },{USD:120} ],
                                     * }
                                    */
                                    this.P_CSD = P_CSD
                                }
                                break;
                                case 1:
                                {   //T_CSD 本月入账统计
                                    let T_CSD = {};
                                    res.data.map(item=>{
                                        T_CSD[item.currency] = {};
                                        for (const key in item) {
                                            T_CSD[item.currency][`${key=='amount'?'value':key}`] = item[key];

                                            delete T_CSD[item.currency]["currency"];
                                        }
                                    });

                                    this.T_CSD = T_CSD;
                                }
                                break;
                                case 2:
                                {   //P_USER 每月用户统计
                                    // console.log(res.data);
                                    let P_USER = {};

                                     res.data.map(item=>{

                                        if(!P_USER.hasOwnProperty(item.month)){
                                            P_USER[item.month] = [
                                                    {},  //总流失
                                                    {},  // 总注册
                                                    {}, // 总有效用户
                                                    {},   // 待唤醒
                                                    {},    //新增
                                                    {},       //新增有效
                                                ];
                                        }; 

                                        for (const k in item) {

                                            let index = null;
                                            let key_CN = null;
                                        
                                            k==`allLoss` &&  (index=0 , key_CN=`总流失用户`);
                                            k==`allUser` &&  (index=1 , key_CN=`总注册用户`);
                                            k==`allValid` &&  (index=2 , key_CN=`总有效用户`);
                                            k==`applicantcount` &&  (index=3 , key_CN=`待唤醒客户`);
                                            k==`registercount` &&  (index=4 , key_CN=`新增客户`);
                                            k==`validcount` &&  (index=5 , key_CN=`新增有效客户`);

                                           index != null && (P_USER[item.month][index][key_CN] = item[k]);
                                        //    index != null && (P_USER[item.month][index][k] = item[k]);
                                            // ;
                                        }
                                       
                                    });

                                    /**
                                     * {
                                     *  2018-10:[ {allLoss:188 },{allUser:200} ],
                                     *  2018-11:[ {allLoss:181 },{allUser:120} ],
                                     * }
                                    */

                                    this.P_USER = P_USER;

                                }
                                break;
                                case 3:
                                {   //T_USER 本月用户统计
                                    let T_USER = {};

                                    let k_name = ["allUserMoth","allloss","applicantcount","partloss","registercount","validcount"];
                                    for (const key in res.data) {
                                        if(k_name.indexOf(key)>-1){
                                            let t_name = null;

                                            key=="allUserMoth" && (  t_name="截止本月总有效用户数" );
                                            key=="allloss" && (  t_name="本月完全流失客户数" );
                                            key=="applicantcount" && (  t_name="本月新增实名认证客户数" );
                                            key=="partloss" && (  t_name="本月部分流失客户数" );
                                            key=="registercount" && (  t_name="本月新增注册用户数" );
                                            key=="validcount" && (  t_name="本月新增有效客户数" );

                                            T_USER[t_name] = {
                                                value: res.data[key],
                                                // month:res.data[`month`],
                                                "同比":res.data[`tb_${key}`],
                                                "环比":res.data[`hb_${key}`],
                                                };
                                        }
                                    }

                                    this.T_USER = T_USER;
                                }
                                break;
                                case 4:
                                {   //P_STORE 每月店铺统计
                                    let P_STORE = {};

                                     res.data.map(item=>{

                                        if(!P_STORE.hasOwnProperty(item.month)){
                                            P_STORE[item.month] = [
                                                    {},  //总店铺数量
                                                    {},  // 总有效店铺数
                                                    {}, // 新增店铺数
                                                    {},   // 新增有效店铺数
                                                    {},    //新增带唤醒店铺数
                                                    {},       //流失店铺数
                                                ];
                                        }; 

                                        for (const k in item) {

                                            let index = null;
                                            let key_CN = null;
                                        
                                            k==`allStore` &&  (index=0 , key_CN=`总店铺数量`);
                                            k==`allValidStore` &&  (index=1 , key_CN=`总有效店铺数`);
                                            k==`newStore` &&  (index=2 , key_CN=`新增店铺数`);
                                            k==`validStore` &&  (index=3 , key_CN=`新增有效店铺数`);
                                            k==`wakeStore` &&  (index=4 , key_CN=`新增带唤醒店铺数`);
                                            k==`wastageStore` &&  (index=5 , key_CN=`流失店铺数`);

                                           index != null && (P_STORE[item.month][index][key_CN] = item[k]);
                                        //    index != null && (P_STORE[item.month][index][k] = item[k]);
                                            // ;
                                        }
                                       
                                    });

                                    /**
                                     * {
                                     *  2018-10:[ {allLoss:188 },{allUser:200} ],
                                     *  2018-11:[ {allLoss:181 },{allUser:120} ],
                                     * }
                                    */

                                    this.P_STORE = P_STORE;
                                }
                                break;
                                case 5:
                                {   //T_STORE 本月店铺统计
                                    let T_STORE = {};

                                    let k_name = ["allValidStore",
                                                    "authStore",
                                                    "platformValidBM",
                                                    "platformValidEB",
                                                    "validStoreMonthBM",
                                                    "validStoreMonthEB",
                                                    "wastageStoreMonthBM",
                                                    "wastageStoreMonthEB",
                                                ];
                                    for (const key in res.data) {
                                        if(k_name.indexOf(key)>-1){
                                            let t_name = null;

                                            key=="allValidStore" && (  t_name="总有效店铺" );
                                            key=="authStore" && (  t_name="新绑定店铺" );
                                            key=="platformValidBM" && (  t_name="Amezon有效店铺" );
                                            key=="platformValidEB" && (  t_name="eBay有效店铺" );
                                            key=="validStoreMonthBM" && (  t_name="新增Amezon店铺" );
                                            key=="validStoreMonthEB" && (  t_name="新增eBay店铺" );
                                            key=="wastageStoreMonthBM" && (  t_name="Amezon流失店铺" );
                                            key=="wastageStoreMonthEB" && (  t_name="eBay流失店铺" );

                                            T_STORE[t_name] = {
                                                value: res.data[key],
                                                "同比": res.data[`tb_${key}`],
                                                "环比": res.data[`hb_${key}`],
                                            };
                                        }
                                    }

                                    this.T_STORE = T_STORE;
                                }
                                break;
                                case 6:
                                {   //P_SOURCE 每月注册来源 and 有效用户来源
                                    let P_SOURCE = {};
                                    let T_SOURCE = {}; //有效用户来源
                                    
                                    res.data.map(item=>{
                                        let k_name = null;

                                       k_name = this.custemerSource[item.source];

                                        k_name != null &&  (
                                            P_SOURCE[k_name] = {
                                                value:item.newsuer,
                                                name:k_name
                                            },
                                            T_SOURCE[k_name]={
                                                value:item.validuser,
                                                name:k_name
                                            });
                                    });

                                    this.P_SOURCE = P_SOURCE;
                                    this.T_SOURCE = T_SOURCE;

                                }
                                break;
                            }
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                });
            },
            //查看更多
            bindToReadMore(name){
                this.$router.push({
                    name,
                    params:{ flag:true }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

 @import './../../../css/element-variables.scss';

    .index-container{
        // height: 100%;
        >div{
            display: inline-block;
            background-color: #fff;
            padding: 10px;
            margin-bottom: 10px;
            vertical-align: top;
            .admin-tab-title{
                a{
                    float: right;
                    color: $--color-primary;
                    font-size: 12px;
                }
            }
            &.index-max{
                width: 59.5%;
                // margin-right:0.5%;
            }
            &.index-min{
                width: 40%;
                float: right;
            }
            .map{
                height: 300px;
            }
            &.marginBTM{
                margin-bottom: 0;
            }
        }
    }
    // .admin-index{
        // height: 100%;
        // background: #fff;
    //     font-size: 60px;
    //     padding-top: 300px;
    //     text-align: center;
    //     background: url('./../../../image/login/loginBg.png') no-repeat center center fixed;
    //     // background-size: 100%;
    // }
</style>
