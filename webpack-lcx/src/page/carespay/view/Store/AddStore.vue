<template>
    <div class="shopcontainer fadeIn" v-show="ING">
        <div class="platformcode platform-container" style="padding-bottom: 0;">
            <h2 class="banner-module-title">所属平台</h2>
            <ul v-if="!ISEDIT">
                <li> <label :class="{active:PLATFORMCODE=='BM'  }" for="P_BM"><span  class="amazon-logo"></span> 北美站</label> </li>
                <li> <label :class="{active:PLATFORMCODE=='EU'  }" for="P_EU"><span  class="amazon-logo"></span> 欧洲站</label> </li>
                <li> <label :class="{active:PLATFORMCODE=='YD'  }" for="P_YD"><span  class="amazon-logo"></span> 印度站</label> </li>
                <li> <label :class="{active:PLATFORMCODE=='EBAY'}" for="P_EBAY"><span  class="ebay-logo"></span></label> </li>
                <li> <label :class="{active:PLATFORMCODE=='WISH'}" for="P_WISH"><span  class="wish-logo"></span> </label> </li>
            </ul>
            <ul v-else>
                <li> <label v-if="PLATFORMCODE=='BM'  " :class="{active:PLATFORMCODE=='BM'  }" for="P_BM"><span  class="amazon-logo"></span> 北美站</label> </li>
                <li> <label v-if="PLATFORMCODE=='EU'  " :class="{active:PLATFORMCODE=='EU'  }" for="P_EU"><span  class="amazon-logo"></span> 欧洲站</label> </li>
                <li> <label v-if="PLATFORMCODE=='YD'  " :class="{active:PLATFORMCODE=='YD'  }" for="P_YD"><span  class="amazon-logo"></span> 印度站</label> </li>
                <li> <label v-if="PLATFORMCODE=='EBAY'" :class="{active:PLATFORMCODE=='EBAY'}" for="P_EBAY"><span  class="ebay-logo"></span></label> </li>
                <li> <label v-if="PLATFORMCODE=='WISH'" :class="{active:PLATFORMCODE=='WISH'}" for="P_WISH"><span  class="wish-logo"></span> </label> </li>
            </ul>

            <input type="radio" v-model="PLATFORMCODE"  value="BM" id="P_BM" />
            <input type="radio" v-model="PLATFORMCODE"  value="EU" id="P_EU" />
            <input type="radio" v-model="PLATFORMCODE"  value="YD" id="P_YD" />
            <input type="radio" v-model="PLATFORMCODE"  value="EBAY" id="P_EBAY" />
            <input type="radio" v-model="PLATFORMCODE"  value="WISH" id="P_WISH" />
        </div>

        <div class="fill-form-container">
            <div :class="{hasBannerAd:isShowBannerAD}">
                <div class="fastArrivalBanner" v-if="isShowBannerAD">
                    <span>{{flashWithdraw.startTime | formatData}}~{{flashWithdraw.finishTime | formatData}}</span>  
                    您绑定的Amazon店铺享有180天免费闪提宝服务
                    <router-link class="cares-color fr" to="/FlashWithdraw">点此查看更多详情</router-link>
                </div>
                <h2 class="banner-module-title">
                    <template v-if="ISEDIT && ['EU','YD','AE'].indexOf(PLATFORMCODE)>-1">
                        {{TOP_EDIT_TAB=='1'?'编辑收款账号':'收款账号企业信息'}}
                        <!-- <a @click="bindChangeTopTab(1)" :class="{active:TOP_EDIT_TAB=='1'}" href="javascript:;">编辑店铺</a>
                        <a @click="bindChangeTopTab(2)" :class="{active:TOP_EDIT_TAB=='2'}" href="javascript:;">绑定店铺企业信息</a> -->
                    </template>
                    <template v-else>
                        {{ISEDIT?"编辑":"申请"}}收款账号
                    </template>

                    <p class="small">
                        为您的
                        <span class="cares-color" v-if="PLATFORMCODE =='BM'  ">亚马逊 北美站</span>
                        <span class="cares-color" v-if="PLATFORMCODE =='EU'  ">亚马逊 欧洲站</span>
                        <span class="cares-color" v-if="PLATFORMCODE =='YD'  ">亚马逊 印度站</span>
                        <span class="cares-color" v-if="PLATFORMCODE =='EBAY'">eBay</span>
                        <span class="cares-color" v-if="PLATFORMCODE =='WISH'">Wish</span>
                        <span class="cares-color" v-if="PLATFORMCODE =='AE'  ">AliExpress</span>
                        店铺收款完善信息
                    </p>
                </h2>

                <el-form class="addshop-el-form">
                    <component 
                    :is="COMPONENTID" 
                    :isEdit="ISEDIT"
                    :platCode="PLATFORMCODE"
                    :topTab="TOP_EDIT_TAB"
                    :data="DATA"

                    :STORESTATUS="STORE_STATUS"
                    @transparams="getParamsByChild"
                    :AfterJumpFn="addStoreAfterJump"

                    :ebayAuth="eBayAuthToken"
                    :eBayAuthLink="eBayAuthLink"

                    :wishAuthTokenCode="wishAuthToken"
                    :wishAuthLink="wishAuthLink"
                    ></component>
                </el-form>

                <div class="guide">
                    <p>为什么进行店铺绑定？</p>
                    <p>1.绑定店铺是为了满足监管部门的合规要求；</p>
                    <p>2.您绑定的店铺所提供的所有商业信息， CaresPAY承诺会予以严格保密，不会将资料提供给收款服务无关的任何单位或者个人，也不会将商业信息用于收款外的任何商业用途。详情您可参阅 <a target="_blank" class="cares-color" :href="`${DOMAINT.login}/#/privacyAgreement`">《保密协议》</a>。 </p>
                </div>

                <AuthenticationWarning 
                    v-model="authentyWarning"
                    @exit="canIleaveNow"
                    txt="您的店铺资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！"
                    paint="right"
                    >
                </AuthenticationWarning>
            </div>
        </div>
    </div>
</template>

<script>
import DOMAINT from '../../../../js/domain.js';

import Amazon from './__Add_Amazon.vue';
import Ebay from './__Add_Ebay.vue';
import Wish from './__Add_Wish.vue';
import AliExpress from './__Add_AliExpress.vue';

    import AuthenticationWarning from './../Other/AuthenticationWarning.vue';

 import {
     getflashWithdrawNotice,
     queryStoreDetail,
     queryCustomerBindInfo,
     storeInfo
 } from '../../../../js/api.js';

 import { formatTimer } from './../../../../js/common.js';

export default {
    data(){
        return{
            DOMAINT:DOMAINT,
            ISEDIT:false,           //是否为编辑页面
            TOP_EDIT_TAB:'1',       // 当店铺有企业信息的时候  顶部的tab切换
            PLATFORMCODE:'BM',      //平台
            STORE_STATUS:'1',       //店铺状态
            DATA:{},                //店铺数据

            //ebay
            eBayAuthToken:3,             //ebay店铺认证的结果  3.未认证 1. 成功； 0 认证失败；
            eBayAuthLink:'',

            //wish
            wishAuthToken:null,             //wish店铺返回的code；
            wishAuthLink:'',

            flashWithdraw:{
                startTime:'',
                finishTime:'',
                activatDay:'',
                isShow:false
            },


            COMPONENTID:'Amazon',   //子组件的名称

            ING:false,

            authentyWarning:false,              //温馨提示
            ISDONE:false,                       //是否完成
            NextTo:null,                        //是否完成
        }
    },
    watch:{
      PLATFORMCODE(code){
          this.__changeComponents(code);
      }  
    },
    created(){
        let QUERY = this.$route.query; //get请求的参数

            QUERY.type == 2 ? (this.ISEDIT=true) : (this.ISEDIT=false);
         //如果是编辑
        if(this.ISEDIT){
           //请求店铺信息
            queryStoreDetail({id:QUERY.id}).then(res=>{
                this.ING = true;
                if(res.code==0){
                    this.DATA = res.data;

                    this.PLATFORMCODE = res.data.platformCode;
                    //店铺审核状态
                    this.STORE_STATUS = (res.data.status == 0 )? 3 : res.data.status;

                    // ebay
                    if(this.PLATFORMCODE == 'EBAY'){
                        //ebay店铺认证的结果  3.未认证 1. 成功； 0 认证失败；
                        this.eBayAuthToken = 1;
                    }

                     //2. EU YD
                    if(['EU','YD','AE'].indexOf(this.PLATFORMCODE)>-1){
                        //1. 审核中  2. 审核通过  3. 审核失败
                        this.STORE_STATUS = (res.data.ownStatus ==0 )? 3 : res.data.ownStatus;

                        this.STORE_STATUS !=3 && this.bindChangeTopTab(2);
                    }

                    //选择回显的组件
                    this.__changeComponents(this.PLATFORMCODE);
                }else{
                    this.$Message.error(res.msg);
                }
            });

        }else{

            this.ING = true;
            //非编辑，既添加店铺页面
             //2.ebay认证返回的链接  ?platformCode=ebay&result=1 eBayAuthToken
             if(QUERY.platformCode && QUERY.platformCode.toUpperCase() == "EBAY"){
                 this.PLATFORMCODE = 'EBAY';
                 //ebay店铺认证的结果
                 this.eBayAuthToken = QUERY.result; 
             }

            //2.wish认证返回的链接  ?platformCode=wish&code=xxx wishAuthToken
             if(QUERY.platformCode && QUERY.platformCode.toUpperCase() == "WISH"){
                 this.PLATFORMCODE = 'WISH';
                 //wish店铺认证的结果
                 this.wishAuthToken = QUERY.code; 
             }

        }
    },
    mounted(){
        getflashWithdrawNotice({type:2}).then(res=>{
            if(res.code==0){
               res.data && (this.flashWithdraw = res.data);
            }else{
                this.$Message.error(res.msg);
            }
        });
    },
    computed:{
        isShowBannerAD(){
            return this.flashWithdraw.isShow && ['BM','EU','YD'].indexOf(this.PLATFORMCODE)>-1
        }
    },
    methods:{
        bindChangeTopTab(index){
            this.TOP_EDIT_TAB = index;
        },
        getParamsByChild(params){
            switch(params.name.toUpperCase()){
                case 'TAB' :{ this.bindChangeTopTab(params.value); }break;
                case 'EBAYLINK' :{ this.eBayAuthLink = params.value; }break;
                case 'WISHLINK' :{ this.wishAuthLink = params.value; }break;
                case 'FILLDONE' :{ this.ISDONE = params.value; }break;
            }
        },

        //添加店铺成功之后的跳转
        addStoreAfterJump(){
            queryCustomerBindInfo().then(res=>{
                if(res.code==0){
                     //1. 假如没有添加银行卡
                    if(!res.data['holderInfo']) return this.$router.push({name:'CashAccountContainer'});
                     //2.否者跳转到成功提示页
                     this.$router.push({
                         name:"AuthenticationDone",
                         params:{
                             source:'AddStore',
                         }
                     });
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },

        //选择子组件
        __changeComponents(code){
            switch(code){
              case 'BM':
              case 'EU':
              case 'YD':
              {
                    this.COMPONENTID = "Amazon";
              }
              break;
              case 'EBAY':
              { this.COMPONENTID = "Ebay"; }
              break;
              case 'WISH':{  this.COMPONENTID = "Wish"; }break;
              case 'AE':{ this.COMPONENTID = "AliExpress"; }break;
          }
        },
         canIleaveNow(bol){
            bol && (
                this.ISDONE=true,
                this.$router.push({
                    name:this.NextTo.name,
                    query:this.NextTo.query,
                    params:this.NextTo.params
                })
            );
        }
    },
    filters:{
        formatData(value){
            return formatTimer(value,true)
        },
    },
    components:{
        AuthenticationWarning,
        AliExpress,
        Amazon,
        Wish,
        Ebay
    },
    beforeRouteLeave(to,from,next){
        queryCustomerBindInfo().then(res=>{
            if(res.code==0){

                if(this.ISDONE || res.data['storeInfo']){
                    next();
                }else{
                    this.authentyWarning = true;
                    this.NextTo = to;
                    next(false);
                };

            }else{
                this.$Message.error(res.msg);
            }
        });
        
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .shopcontainer{
        // padding-bottom: 70px;
        //title
        .banner-module-title{
            font-size: 20px;
            color: #666;
            font-weight: 600;
            a{
                color:#666;
                margin-right: 10px;
                display: inline-block;
                height: 34px;
                line-height: 34px;
                padding: 0 10px;
                vertical-align: middle;
                border-radius: 19px;
                border: 1px solid #fff;
                font-weight: normal;
                &:hover,
                &.active{
                    color:#333;
                    border-color:$--color-primary-two;
                }
            }

            p{
                display: inline-block;
                font-size: 12px;
                color: #666;
                font-weight: normal;
            }
        }

        //form
        .addshop-el-form{
            margin-top: 20px;
        }

        //bottom guide
        .guide{
            padding-top: 40px;
            p{
                line-height: 23px;
                font-size: 14px;
                color: #666;
                margin-bottom: 15px;
            }
        }
    }


    // 2019-2-26  更改布局
    .shopcontainer{
        // display: flex;
        // justify-content: space-between;

        position: relative;
        min-height: 400px;

        .platform-container{
            position: absolute;
            width: 300px;
            height: 100%;
            left: 0;
            top: 0;
            // flex: 1;
            margin-right: 10px;
            text-align: center;
            padding: 0;
            
            input{
                display: none;
            }
            li{
                margin: 20px 0;
                label{
                    display: inline-block;
                    width: 140px;
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;
                    border: 1px solid #fff;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all .2s;
                     &.active{
                        color: #333;
                        border-color: $--color-primary-two;
                        box-shadow: 0 0px 5px 0px $--color-primary-two-hover;
                    }
                     &:hover{
                        box-shadow: 0 0px 5px 0px rgba(0,0,0,.3);
                    }
                }
            }
        }

        .fill-form-container{
            padding: 0;
            padding-left: 310px;
            background: transparent;
            >div{
                padding: 0 20px;
                background-color: #fff;
                padding-bottom:20px;
                min-height: 400px;
            }
        }
    }

    .hasBannerAd{
        position: relative;
        padding-top: 90px !important;
    }

    .fastArrivalBanner{
        position: absolute;
        width: 100%;
        height: 90px;
        line-height: 90px;
        color: #fff;
        left: 0;
        top: 0;
        font-size: 18px;
        padding-left: 20px;
        background: url('../../../../images/carepay/闪提宝banner.png') no-repeat center center;
        span{
            margin-right:40px;
        }
        a{
            font-size: 12px;
            margin-right: 40px;
        }
    }
</style>

<style lang="scss">
.addshop-el-form{
    color:#666;
     .form-item{
        >span{
            display: block;
        }
    }
    .form-item{
         min-height: 50px;
        line-height: 50px;
        margin-bottom:15px;
        a{
            font-size:12px;
        }
        &.platformcode{
            padding-bottom:10px;
            margin-bottom:10px;
            border-bottom:1px solid #F1F1F1;
        }
        &.channel{
            padding-top: 10px;
            margin-bottom:0px;
            border-top:1px solid #F1F1F1;
            .bold{
                width: auto;
            }
        }
        .item{
            color:#666;
        }
    }
    .small{
        font-size:14px;
    }
    .el-input,
    .el-select{
        width:247px;
    }
    .el-form-item__label{
        display: block;
        width:100%;
        text-align:left;
        position: relative;
        z-index: 1;
    }
     .el-form-item__error{
        // padding-left:134px;
        background-color: transparent;
    }
    //店铺信息选项
    .shop-information{
        background-color: #fffbf5;
        padding-left: 38px;
        font-size: 14px;
        // margin-bottom: 10px;
        // margin-top: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
        >p{
            color: #666;
            line-height: 40px;
        }
        .form-item{
            margin-bottom: 0;
        }
        div{
             background-color: #fffbf5;
        }
    }
    .el-form-item.nations{
        padding-top:10px;
        padding-bottom:0px;
        margin-bottom:20px;
        border-top:1px solid #f1f1f1;
        .el-checkbox{
            margin-right:30px;
        }
        .el-form-item__label{
            width:auto;
            font-size:18px;
            font-weight:bold;
        }
        .el-form-item__error{
            padding-left:0px;
        }
    }
    // .channelCode{
    //     margin-top:25px;
    // }
    //请阅读条款
    .line{
          height: 94px;
          font-size: 14px;
          color: #666;
          line-height: 94px;
          border-top: 1px solid #F1F1F1;
          border-bottom: 1px solid #F1F1F1;
          margin-bottom: 40px;
      }

       button{
            min-width: 133px;
            height: 38px;
            line-height: 38px;
        }


        .complate-account{
            >button,
            >.cares-button-primary{
                margin-top:40px;
            }
        }

    //条款跳跃
    .appointment-content{
        .el-popover{
            position: fixed;
            top: 10px;
            max-width: 50%;
            left: 25%;
            h2{ 
                text-align: center;
                margin: 20px 0;
            }
            p{
                line-height: 28px;
                text-indent: 2em;
            }
            .btn{
                text-align: center;
                span{
                    width:80px;
                    height: 34px;
                    line-height: 34px;
                    border-radius:17px;
                    margin-top:40px;
                    margin-right:10px;

                }
            }
        }
    }

    // ebay渠道界面
    .ebay-auth-success{
        border-bottom:1px solid #f1f1f1;
        margin-bottom:10px;
        p{
            // line-height:100px;
            padding-bottom:20px;
            font-size:22px;
            color:#666;
        }
        h3{
            font-weight:normal;
            font-size: 16px;
            color:#666;
            line-height:60px;
        }
    }

      .ebay-yes{
        display:inline-block;
        width:38px;
        height:38px;
        vertical-align:middle;
        background:url('./../../../../images/carepay/chenggong.svg') no-repeat center center;
        background-size:100% 100%;
        margin-right :10px;
    }

     .ebay-no{
        display:inline-block;
        width:38px;
        height:38px;
        vertical-align:middle;
        background:url('./../../../../images/carepay/ebay-no.png') no-repeat center center;
        background-size:100% 100%;
        margin-right :10px;
    }

     .ebay-form-item{
        .el-form-item__label{
            width:100%;
        }
        button{
            margin-top:0px;
        }
    }
    //上传
     .upload-container{
        display:inline-block;
        width:120px;
        vertical-align:top;
    }

    //aliexpress
      .aliexpress-store-item{
        .el-form-item__label{
            width:190px;
        }
    }


    .cares-button-primary,.cares-button-info{
        min-width: 80px;
    }

    //2019-2-26
    .el-form-item{
        margin-bottom:18px;
    }

    //店铺审核失败原因
    .refuse-reason{
        margin: 10px 0;
        padding: 10px;
        font-size: 12px;
        background-color: #F2F8FC;
        >p{
            line-height: 30px;
        }
        .point{
                margin-top: -3px;
        }
    }
}
</style>
