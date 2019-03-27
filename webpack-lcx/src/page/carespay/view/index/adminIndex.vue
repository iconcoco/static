<template>
    <div class="fadeIn">
        <div class="AdminPlate index-notice"  v-if="msgInfo.length" :style="`height:${showAllNews?40*msgInfo.length+'px':'40px'}`">
            <span 
            v-if="msgInfo.length>1"
            class="cares-color el-icon-arrow-down" 
            @click="bindToShowAllNews"
            :class="{active:showAllNews}"
            ></span>
            <ul>
                <li v-for="(item,index) in msgInfo" :key="index" v-html="item"></li>
            </ul>
        </div>
        <div class="AdminPlate AdminAccount-Info-container">
            <ul class="AdminAccount-List">
                <li v-for="(value,key,index) in AccountInfo" :key="index">
                    <div class="currency-name clearfix">
                        <h3>{{CodeToCn(key)}}信息({{key}})</h3>
                        <a href="javascript:;" 
                            v-if="AccountInfo[key].store>0"
                            @click="bindShowPlatBalanceInfo(key)"
                            class="cares-color">
                            {{AccountStoreShow[key]?'收起':'查看'}}该币种下平台金额信息
                        </a>
                    </div>
                    <div class="clearfix account-detaile-container">
                        <div class="fl">
                            <p>可提现金额</p>
                            <p>
                                <span class="money">{{FormatPrice(Number(value.balance).toFixed(2))}}</span>
                                <span v-if="value.balance>0" class="cares-button-primary" @click="bindWithdrawCash(key)">立即提现</span>
                            </p>
                        </div>
                        <div class="fr">
                            <p>
                                <span>预入账金额</span>
                                <span>{{FormatPrice(Number(value.preInbound).toFixed(2))}}</span>
                            </p>
                            <p>
                                <span>待处理金额</span>
                                <span>{{FormatPrice(Number(value.preInbound_WE).toFixed(2))}}</span>
                            </p>
                            <p>
                                <span>提现中金额</span>
                                <span>{{FormatPrice(Number(value.frozen).toFixed(2))}}</span>
                            </p>
                        </div>
                    </div>

                    <div class="plat-balance-info" v-show="AccountStoreShow[key]">
                        <CTable>
                            <table :class="{fadeIn:AccountStoreShow[key]}">
                                <thead>
                                    <tr>
                                        <th>平台</th>
                                        <th>预入账金额</th>
                                        <th>待处理金额</th>
                                        <th>提现中金额</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,innerInder) in AccountInfoStore" :key="innerInder" v-if="item.currency==key && item.platformCode">
                                        <td>{{PlatformCode(item.platformCode)}}</td>
                                        <td>{{ ['WISH','EBAY'].indexOf(item.platformCode)>-1 ? '0.00' : FormatPrice(Number(item.preInbound).toFixed(2))}}</td>
                                        <td>{{ ['WISH','EBAY'].indexOf(item.platformCode)>-1 ? FormatPrice(Number(item.preInbound).toFixed(2)):'0.00'}}</td>
                                        <td>{{FormatPrice(Number(item.frozen).toFixed(2))}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CTable>
                    </div>
                </li>
            </ul>
            <!-- 轮播图与实时汇率 -->
            <div class="swiper-info">
                <!-- 轮播图  v-if="!bannerAD.length"-->
                <div class="swiper-container">
                    <ul class="tbs-swiper">
                        <li class="tbs-swiper-items" v-if="!bannerAD.length">
                            <Calendar
                                :lunar="false"
                                :value="Calendar.value"
                                >
                            </Calendar>
                        </li>
                        <li class="tbs-swiper-items" v-for="(item,index) in bannerAD" :key="index">
                            <a :href="item.advertisementUrl">
                                <img :src="`/general/download?fileId=`+item.advertisementImg" :alt="item.advertisementName">
                            </a>
                        </li>
                    </ul>

                     <div class="tbs-sign sign">

                    </div>

                    <div class="arrow"  v-show="bannerAD.length>1">
                        <a href="javascript:;" class="pre"><span class="el-icon-arrow-left"></span></a>
                        <a href="javascript:;" class="next"><span class="el-icon-arrow-right"></span></a>
                    </div>

                </div>
                
                <!-- 实时汇率展示 -->
                <div class="exchange-rate">
                    <h3> 实时汇率
                        <el-tooltip effect="dark" content="实时汇率由合作伙伴提供，仅供参考" placement="top-end">
                            <span class="el-icon-question fr"></span>
                        </el-tooltip>
                    </h3>
                    <ul>
                        <li class="clearfix" v-for="(item,index) in ExchangeRate" :key="index">
                            <div class="fl">
                                <p class="bold">
                                    <template v-if="item.sourceCurrency=='USD'">美元</template>
                                    <template v-if="item.sourceCurrency=='EUR'">欧元</template>
                                    <template v-if="item.sourceCurrency=='GBP'">英镑</template>
                                </p>
                                <p>{{item.sourceCurrency}}/{{item.targetCurrency}}</p>
                            </div>
                            <div class="fr">
                                <p class="bold">{{item.buyExchangeRate}}</p>
                                <p>{{FormatTime(item.releaseTime)}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    Pricemoney,
    formatTimer
 } from './../../../../js/common.js';
import { 
    queryIndexBanner,
    queryExchangeRateAll,       //查询所有币种的汇率   
    messageInfo,
    AmountInfoByPlatform,
} from './../../../../js/api.js';

import Calendar from '../../../../components/calendar/calendar.vue';
import CTable from '../../../../components/CTable.vue';

import $ from 'jquery';

let _val = {
        _event:{
            bannerSwiper:function(){
                $(".swiper-container").fadeSwiper({
                    speed: 500,
                    looper: 3000
                });
            },
        }
    };

export default {
    data(){
        return{
            Calendar:{
                value:[],               //日期插件默认选中的地方
            },
            bannerAD:[],                 // banner图广告
            ExchangeRate:[],            //实时汇率
            AccountInfo:{
                USD:{
                    balance:0,
                    preInbound:0,
                    preInbound_WE:0,
                    frozen:0,
                    store:0,
                },
                EUR:{
                    balance:0,
                    preInbound:0,
                    preInbound_WE:0,
                    frozen:0,
                    store:0,
                },
                GBP:{
                    balance:0,
                    preInbound:0,
                    preInbound_WE:0,
                    frozen:0,
                    store:0,
                },
            },
            AccountInfoStore:[],

            AccountStoreShow:{},

            showAllNews:false,

            msgInfo:[],

        }
    },
    created(){
        let Time = new Date();
        this.Calendar.value = [Time.getFullYear(),Time.getMonth()+1,Time.getDate()];

        //消息盒子
        messageInfo().then(res=>{
           if(res.code==0){
               this.msgInfo  = res.data;
           }else{
               this.$Message.error(res.msg);
           }
        });
        AmountInfoByPlatform().then(res=>{
            if(res.code==0){
                
                // if(!Object.keys(res.data).length) return;

                this.AccountInfoStore = res.data;

                let CurrencyInfo = {}; //{ used: }
                res.data.forEach(item=>{
                    if(!(item.currency in CurrencyInfo)){
                        CurrencyInfo[item.currency]={
                            preInbound:0,//预入账待处理金额
                            preInbound_WE:0,//处理金额
                            frozen:0,  //提款中
                            balance:0, //可提现金额
                            store:0     //对应币种下店铺的个数
                        };

                        this.$set(this.AccountStoreShow,item.currency,false);
                    };

                    CurrencyInfo[item.currency].store += 1;

                    ['WISH','EBAY'].indexOf(item.platformCode)>-1 ? 
                    (CurrencyInfo[item.currency].preInbound_WE += Number(item.preInbound))
                    :(CurrencyInfo[item.currency].preInbound += Number(item.preInbound));

                    CurrencyInfo[item.currency].frozen += Number(item.frozen);
                    CurrencyInfo[item.currency].balance += Number(item.balance);
                });

            //    this.AccountInfo = CurrencyInfo;
               for (const key in CurrencyInfo) {
                  this.AccountInfo[key] = CurrencyInfo[key];
               };

            }else{
                this.$Message.error(res.msg);
            }
        });
        //获取实时汇率
        queryExchangeRateAll().then(res=>{
            if(res.code==0){
                this.ExchangeRate = res.data;
            }else{
                this.$Message.error(res.msg);
            }
        });
    },
    mounted(){
           //2018-12-17 流程优化增加banner轮播广告图
        queryIndexBanner().then(res=>{
            if(res.code==0){
                this.bannerAD = res.data;
                setTimeout(()=>{
                     _val._event.bannerSwiper();
                },500);
            }else{
                this.$Message.error(res.msg);
            }
        });
    },
    methods:{
        //展开对应的账号余额信息
        bindShowPlatBalanceInfo(key){
            for (const K in this.AccountStoreShow) {
                key != K && (this.AccountStoreShow[K] = false);
            };

            this.AccountStoreShow[key] = !this.AccountStoreShow[key];
        },
        bindToShowAllNews(){
            this.showAllNews = !this.showAllNews;
        },
        FormatPrice(num=0){
            return Pricemoney(String(num));
        },
        FormatTime(t){
            return formatTimer(t)
        },
        bindWithdrawCash(currency){
            this.$router.push({
                    name:'Cash',
                    params:{
                        currency
                    }
                });
        },
        CodeToCn(c){
            let s='';
            switch(c){
                case 'USD':{s="美元";} break;
                case 'EUR':{s="欧元";} break;
                case 'GBP':{s="英镑";} break;
            }
            return s
        },
        PlatformCode(c){
            let s='';
            switch(c){
                case 'BM':{s="亚马逊北美站";} break;
                case 'EBAY':{s="ebay";} break;
                case 'EU':{s="亚马逊欧洲站";} break;
                case 'YD':{s="亚马逊印度站";} break;
                case 'AE':{s="AliExpress";} break;
                case 'WISH':{s="Wish";} break;
            }
            return s
        },
    },
    components:{
        Calendar,
        CTable
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .index-notice{
        height: 40px;
        line-height: 40px;
        text-align: center;
        border:1px solid $--color-primary-danger;
        font-size: 14px;
        overflow: hidden;
        position: relative;
        transition: all  .5s;
        >span{
            position: absolute;
            right: 30px;
            bottom: 2px;
            font-size: 30px;
             transition: all  .5s;
             cursor: pointer;
             &.active{
                 transform: rotate(180deg);
             }
        }
    }

     .AdminAccount-Info-container{
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
        ul.AdminAccount-List{
            flex: 1;
            margin-right: 20px;
            li{
                padding: 0 20px;
                border:1px solid #f4f5f9;
                margin-bottom: 20px;
                position: relative;
                .currency-name{
                    padding: 20px 0;
                    h3{
                        font-size: 18px;
                        float: left;
                        color: #333;
                    }
                    a{
                        float: right;
                        font-size: 14px;
                    }
                }

                .account-detaile-container{
                    padding-bottom: 20px;
                    p{
                        font-size: 14px;
                        .money{
                            display: inline-block;
                            min-width: 100px;
                            margin-right: 10px;
                            font-weight: bold;
                            font-size: 16px;
                            color: $--color-primary-three;
                        }
                    }
                    .fl{
                        p{
                            margin-bottom: 5px;
                        }
                    }
                    .fr{
                        p{
                            display: inline-block;
                            width: 130px;
                            border: 1px solid #f4f5f9;
                            text-align: left;
                            padding: 10px 0 10px 5px;
                            margin-left: 5px;
                            span{
                                display: inline-block;
                                width: 100%;
                            }
                        }
                    }
                }

                .plat-balance-info{
                    position: absolute;
                    width: 100%;
                    left: 0;
                    top: 50px;
                    box-shadow: 0 0 8px 0 rgba(0,0,0,.3);
                    padding: 5px 10px;
                    // &.fadeIn{
                        z-index: 2;
                    // }
                    &::before{
                        content:"";
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background-color: #fff;
                        box-shadow: 3px -3px 5px 0.1px rgba(0,0,0,.3);
                        right: 105px;
                        top: -5px;
                        transform: rotate(-45deg);
                    }
                }
            }
        }

        //实时汇率展示
        .exchange-rate{
            border: 1px solid #f4f5f9;
            padding: 10px 20px;
            // box-shadow: 0 0 8px 0 rgba(0,0,0,.3);
            h3{
                color: #333;
                span{
                    margin-top: 5px;
                }
            }
            ul{
                li{
                    border-bottom: 1px solid #f4f5f9;
                    padding: 10px 0;
                    .fr{
                        text-align: right;
                    }
                    p{
                        font-size: 12px;
                        height: 20px;
                        line-height: 20px;
                    }
                    .bold{
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                    }
                }
            }
        }
     }

</style>

<style lang="scss">
@import './../../../../css/common/theme.scss';
 .AdminAccount-Info-container{
        .swiper-info{
            width: 302px;
           
            .swiper-container{
                height: 186px;
                position: relative;
                 border:1px solid #f4f5f9;
                 margin-bottom:20px;
                 overflow: hidden;
                >ul{
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 1;
                    li{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: none;
                        a{
                            display: inline-block;
                            width:100%;
                            height:100%;
                            vertical-align:center;
                            overflow: hidden;
                            img{
                                vertical-align:center;  
                            }
                        }
                    }
                    li:first-child{
                        display: block;
                    }
                }

                .sign{
                    position: absolute;
                    width: 100%;
                    bottom: 5px;
                    height: 12px;
                    line-height: 12px;
                    text-align: center;
                    z-index: 20;
                    background-color:transparent;
                    a{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        margin: 0 5px;
                        border-radius: 50%;
                        // background-color: rgba(255,255,255,.5);
                        background-color: rgba(0,0,0,.5);
                        &.active{
                            background-color:$--color-primary-three;
                        }
                    }
                }

                 .arrow{
                    display:none;
                    >a{
                        position: absolute;
                        width:24px;
                        height:34px;
                        top:50%;
                        margin-top:-17px;
                        z-index: 2;
                        font-size:26px;
                        color:#fff;
                        background-color: rgba(0,0,0,0.1);
                        &:hover{
                            background-color: rgba(0,0,0,0.5);
                        }
                    }
                    .next{
                        right:0px;
                    }
                }

                 &:hover{
                    .arrow{ display:block; }
                }
            }
        }
    }
</style>

