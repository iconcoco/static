<template>
    <div class="fadeIn">
        <div class="complate-name">
            <h2 v-if="!INCOM" class="banner-module-title">实名认证</h2>

            <div v-if="RefuseReason.length" class="refuse-reason">
                <p>因为以下原因，您的实名认证审核未通过：</p>
                <ul>
                    <li class="no" v-for="(item,index) in RefuseReason" :key="index">
                        <i class="point no"></i> {{item.remark}}
                    </li>
                </ul>
            </div>

            <p class="warning-notice">根据相关金融监管要求及保障您的账户安全，CaresPAY需收集用户的真实身份信息并进行验证。CaresPAY承诺将对您提供的实名信息严格保密。</p>

            <div class="complate-name-item clearfix">
                <label class="fl">用户类型</label>
                <div class="fl authenType">
                     <template v-if="canISelect">
                        <label :class="{active:AuthenType=='CHN'}" for="AUTHEN_DL">大陆个人</label>
                        <!-- <label :class="{active:AuthenType=='HKG'}" for="AUTHEN_HK">香港个人</label> -->
                    </template>
                    <template v-else>
                        <span class="AuthentypeSpan">{{AuthenType=='CHN'?'大陆个人':'香港个人'}}</span>
                    </template>

                    <input type="radio" id="AUTHEN_DL" value="CHN" v-model="AuthenType">
                    <input type="radio" id="AUTHEN_HK" value="HKG" v-model="AuthenType">

                    <p v-if="!INCOM"> <i class="el-icon-info"></i> <span><b>{{AuthenType=='CHN'?'大陆个人':'香港个人'}}</b>：可提现至个人银行卡</span></p>
                </div>
            </div>

            <component :is="AuthenType=='CHN' ? 'AuthenDL':'AuthenHK'"
                :INCOM="INCOM"
                :data="componentsData"
                @watchIsFillDone="bindGetIsDone"
                :AfterJumpFn="AfterJumpFn"
            >
            </component>
        </div>

        <AuthenticationWarning 
        v-model="authentyWarning"
        @exit="canIleaveNow"
        txt="您的实名认证资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！"
        paint="right"
        >
        </AuthenticationWarning>
    </div>
</template>

<script>
import AuthenDL from './__AuthenPersonal_DL.vue';
import AuthenHK from './__AuthenPersonal_HK.vue';

import AuthenticationWarning from './../Other/AuthenticationWarning.vue';

import {
    queryCustomerBindInfo ,  
    saveUrlDataLog ,  
} from './../../../../js/api.js';


export default {
    data(){
        return{
            AuthenType: 'CHN' ,          //CHN.中国大陆   HKG.中国香港
            ISDONE:false,           //用于标识是否可已经完成实名认证 以便做组件离开时的提示

            componentsData:{},     //在当前组件更改子组件的回显数据

            canISelect:true,

            RefuseReason:[],


            authentyWarning:false,
            NextTo:null,
        }
    },
    props:["INCOM","data"],
    components:{
        AuthenDL,
        AuthenHK,
        AuthenticationWarning
    },
    created(){
        this.initPageData();
    },
    watch:{
        "data"(){
            this.initPageData();
        }
    },
    mounted(){
        !(this.INCOM) && saveUrlDataLog({
                /** 1.活动H5页点击量 
                 * 2."点击分享"按钮的点击量
                 * 3.通过H5进入注册页面的点击量
                 * 4.注册成功回到H5活动页的点击量
                 * 5.通过H5预注册用户数量
                 * 6.注册页的访问量
                 * 7.绑定邮箱页面访问量
                 * 8.绑定店铺页访问量 
                 * 9.实名认证页访问量 */
                type:'9'
        });
    },
    methods:{
        initPageData(){
            this.componentsData = this.data;
            this.AuthenType =(this.data && this.data.businessLocation) || 'CHN';
             //1. 实名认证是否可以选择中国大陆还是香港
            this.INCOM=='R_NAME' && (this.canISelect = false);

            //3.审核失败原因显示出来  2019-3-11
            this.filterErrorReason(this.data);

        },
        bindGetIsDone(bol){
            this.ISDONE = bol;
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
        },
        AfterJumpFn(){
            // console.log(111);
            queryCustomerBindInfo().then(res=>{
                if(res.code==0){
                    //2. 假如没有收款店铺 跳转到添加店铺的页面
                    if(!res.data['storeInfo']) return this.$router.push({name:'AddShop'});
                    //1. 假如没有银行卡 添加提现银行卡
                    if(!res.data['holderInfo']) return this.$router.push({name:'CashAccountContainer'});
                    //3. 否者跳转到提示成功的页面
                    this.$router.push({
                        name:"AuthenticationDone",
                        params:{
                            source:'Authentication',
                        }
                    });

                }else{
                    this.$Message.error(res.msg)
                }
            });
        },
        filterErrorReason(data){
            if(!data || Object.keys(data).length==0) return;

             //1. 法人审核失败原因
            data.status==3 && data.auditInfoVoList && data.auditInfoVoList.forEach(item=>{
                if(item.auditStatus==3) this.RefuseReason.push(item);
            });
        },
    },
    beforeRouteLeave(to,from,next){
        if(this.ISDONE){
            next();
        }else{
            this.authentyWarning = true;
            this.NextTo = to;
            next(false);
        }
    },
}
</script>

<style lang="scss" scoped>
.AuthentypeSpan{
    line-height: 33px;
    font-size: 14px;
}

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
</style>



<style lang="scss">
@import "./../../../../css/common/theme.scss";

    .complate-name .authenType{
        padding-top: 5px;
        p{
            height: auto;
            width: 100%;
            margin-top: 20px;
            background-color: #e5e5e5;
            padding-left: 20px;
            padding-right: 20px;
            i{
                font-size: 16px;
                color: $--color-primary-two;
                vertical-align: middle;
                margin-right: 5px;
            }
            span{
                vertical-align: middle;
                b{
                    color: #333;
                }
            }
        }
        >label{
            display: inline-block;
            height: 30px;
            padding: 0 20px;
            line-height: 30px;
            border-radius: 15px;
            border: 1px solid #e5e5e5;
            width: 80px;
            text-align: center;
            font-size: 14px;
            margin-right: 20px;
            transition: all .2s;
            cursor: pointer;
            &.active{
                border-color: $--color-primary-two;
                color: #fff;
                background-color: $--color-primary-two;
                &:hover{
                    box-shadow: 0 4px 4px $--color-primary-two-hover;
                }
            }
        }

        input{
            display: none;
        }
    }

</style>

