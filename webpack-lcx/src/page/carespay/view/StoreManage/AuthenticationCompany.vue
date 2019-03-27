<template>
    <div class="fadeIn">
        <div class="complate-name">
            <h2 v-if="!INCOM" class="banner-module-title">实名认证</h2>

            <div v-if="RefuseReason.length" class="refuse-reason">
                <p>因为以下原因，您的{{this.INCOM=='R_NAME'?'实名认证':'店铺企业资料'}}审核未通过：</p>
                <ul>
                    <li class="no" v-for="(item,index) in RefuseReason" :key="index">
                        <i class="point no"></i> {{item.remark}}
                    </li>
                </ul>
            </div>

            <p class="warning-notice" v-if="!hideIntro">
                <template v-if="['ADD_EU','ADD_AE'].indexOf(this.INCOM)>-1">
                    根据相关金融监管合规要求，请您提供申请{{PLATFORM=='EU'?'欧洲站':'印度站'}}店铺时绑定的企业信息。CaresPAY承诺将对您提供的信息严格保密。
                </template>
                <template v-else>
                    根据相关金融监管要求及保障您的账户安全，CaresPAY需收集用户的真实身份信息并进行验证。CaresPAY承诺将对您提供的实名信息严格保密。
                </template>
            </p>

            <div class="enterprise-type" v-show="EnterpriseIsFirst">
                <h4> 欧洲站店铺绑定的企业信息
                    <el-radio v-model="EnterpriseSource" label="0">与实名认证的企业信息一致</el-radio>
                    <el-radio v-model="EnterpriseSource" label="1">完善店铺绑定的企业信息</el-radio>
                </h4>
            </div>

            <div class="complate-name-item clearfix" v-show="EnterpriseSource==1">
                <label class="fl">{{(['ADD_EU','ADD_AE'].indexOf(this.INCOM)>-1) ?'企业类型':'用户类型'}}</label>
                <div class="fl authenType">
                    <template v-if="canISelect">
                        <label :class="{active:AuthenType=='CHN'}" for="AUTHEN_DL">大陆企业</label>
                        <label :class="{active:AuthenType=='HKG'}" for="AUTHEN_HK">香港企业</label>
                    </template>
                    <template v-else>
                        <span class="AuthentypeSpan">{{AuthenType=='CHN'?'大陆企业':'香港企业'}}</span>
                    </template>
                  

                    <input type="radio" id="AUTHEN_DL" value="CHN" v-model="AuthenType">
                    <input type="radio" id="AUTHEN_HK" value="HKG" v-model="AuthenType">


                    <p v-if="!INCOM"> <i class="el-icon-info"></i> <span><b>{{AuthenType=='CHN'?'大陆企业':'香港企业'}}</b>：可提现至企业对公账户</span></p>
                </div>
            </div>

            <component
                :is="AuthenType=='CHN'?'AuthenticaDL':'AuthenticaHK'"
                :INCOM="INCOM"    
                :ISADD="ISADD"    
                :id="id"    
                :data="componentsData"    
                :edit="componentsEdit"  
                 @watchIsFillDone="bindGetIsDone"
                :AfterJumpFn="AfterJumpFn"
            ></component>

            <!-- 退出未完成之前的提示 -->
            <AuthenticationWarning 
            v-model="authentyWarning"
            @exit="canIleaveNow"
            txt="您的实名认证资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！"
            paint="right"
            >
            </AuthenticationWarning>

        </div>
    </div>
</template>


<script>
import AuthenticaDL from './__AuthenCompany_DL.vue';
import AuthenticaHK from './__AuthenCompany_HK.vue';
import AuthenticationWarning from './../Other/AuthenticationWarning.vue';

import { 
    queryPersonInfo ,               //实名认证信息
                
} from '../../utils/localbase.js';

  import {
        storeInfo,                  //获取店铺列表
        queryCustomerBindInfo ,  
        saveUrlDataLog ,  
    } from './../../../../js/api.js';

export default {
    props:["INCOM","id","data",'edit','PLATFORM','ISADD','hideIntro'], 
    //PLATFORM  平台站点
    data(){
        return{
            AuthenType:'',
            ISDONE:false,           //用于标识是否可已经完成实名认证 以便做组件离开时的提示

            componentsData:{},     //在当前组件更改子组件的回显数据
            componentsEdit:false,


            EnterpriseSource:"1",       //0 与实名认证一致  1. 完善店铺绑定的企业信息
            EnterpriseIsFirst:false,
            personInfo:null,
            canISelect:true,            //是否可以选择大陆与香港的切换
            


            authentyWarning:false,
            NextTo:null,

            RefuseReason:[],

           PAGESTORE:{}, 
        }
    },
    created(){
        this.initPageData();
    },
    mounted(){
         /** 1.活动H5页点击量 
                 * 2."点击分享"按钮的点击量
                 * 3.通过H5进入注册页面的点击量
                 * 4.注册成功回到H5活动页的点击量
                 * 5.通过H5预注册用户数量
                 * 6.注册页的访问量
                 * 7.绑定邮箱页面访问量
                 * 8.绑定店铺页访问量 
                 * 9.实名认证页访问量 */
        !(this.INCOM )&& saveUrlDataLog({type:'9'});
    },
    components:{
        AuthenticaDL,
        AuthenticaHK,
        AuthenticationWarning
    },
    methods:{
        initPageData(){
            this.componentsData = this.data;
            this.AuthenType =(this.data && this.data.businessLocation) || 'CHN';
            this.componentsEdit = this.edit;
            //1. 如果是添加店铺的企业信息  可以选择与实名信息一致；
            this.ISADD && ['ADD_EU','ADD_AE'].indexOf(this.INCOM)>-1 && this.isStoreEnterpriseInfo();

            //2. 实名认证是否可以选择中国大陆还是香港
            this.INCOM && ( this.INCOM=='R_NAME' ? (
                this.canISelect=false
            ):(
                this.canISelect = !(Object.keys(this.data).length>0)
            ));

            //3.审核失败原因显示出来  2019-3-11
            this.filterErrorReason(this.data);
            

            this.PAGESTORE[this.AuthenType] = this.data;
        },
        isStoreEnterpriseInfo(){
            //非欧洲站印度站  不让请求
            if(["EU","YD"].indexOf(this.PLATFORM)<0) return;
            // [客户类型为“企业类型”] && [企业实名信息状态为“待审核” or “审核通过”] && [审核中的欧洲站店铺数 < 1 or 审核通过的欧洲站店铺数 < 1 ] 
            queryPersonInfo().then(res=>{
                //实名认证信息不审核失败 且类型为企业信息
                if( (res.status !=3) && (res.type==2) ){
                    //1. 保存个人实名认证信息
                    this.personInfo = res;
                    //2. 请求店铺数量
                    return storeInfo({platformCode:this.PLATFORM});
                }else{
                    this.EnterpriseIsFirst = false;
                    return false;
                }
            }).then(res=>{
                if(!res) return;
               
                if(res.code==0){
                    let t = 0;
                    //判断审核中和审核通过的的店铺数量
                    res.data && res.data.forEach(item=>{
                        item.storeId != this.id && item != 3 && t++
                    });

                    //是否展示选择完善信息的类型
                    t==0 ? (this.EnterpriseIsFirst = true) : (this.EnterpriseIsFirst = false);

                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        //当与实名信息一致的时候需要改变审核状态才能进行编辑提交
        changePersonInfo(){
            let ot = JSON.parse(JSON.stringify(this.personInfo));

            ot.status = 3 ; //总状态

            ot["auditInfoVoList"]&& ot["auditInfoVoList"].forEach(item=>{
                item.auditStatus = 0;
            });
            //股东的审核状态
            ot['shoreHolderRespVoList'] && ot['shoreHolderRespVoList'].forEach(item=>{
                item.status=3;
                item.auditInfoVoList.forEach(innerItem=>{
                     innerItem.auditStatus = 0;
                });
            });

            return ot
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
        reset(){
            this.AuthenType="CHN";
            this.EnterpriseSource="1";
            this.EnterpriseIsFirst=false;
        },

        filterErrorReason(data){
            if( !data || Object.keys(data).length==0 ) return;

             //1. 法人审核失败原因
            data.status==3 && data.auditInfoVoList && data.auditInfoVoList.forEach(item=>{
                if(item.auditStatus==3) this.RefuseReason.push(item);
            });
            //2. 股东审核失败原因
            data.status==3 && data.shoreHolderRespVoList && data.shoreHolderRespVoList.length && data.shoreHolderRespVoList.forEach(item=>{
                item.status ==3 && item.auditInfoVoList && item.auditInfoVoList.forEach(innerItem=>{
                    if(innerItem.auditStatus==3) this.RefuseReason.push(innerItem);
                });
            });
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
                    let source = ['ADD_EU','ADD_AE'].indexOf(this.INCOM)>-1  ? "AddStore": "Authentication";

                    this.$router.push({
                        name:"AuthenticationDone",
                        params:{
                            source,
                        }
                    });

                }else{
                    this.$Message.error(res.msg)
                }
            });
        }
    },
    watch:{
        EnterpriseSource(n){
            n==0 && (
                this.PAGESTORE[this.personInfo.businessLocation] = this.changePersonInfo(),
                this.componentsData = this.PAGESTORE[this.personInfo.businessLocation],
                this.AuthenType=this.personInfo.businessLocation || 'CHN'
            );

            this.componentsEdit = n==0;
        },
        "data"(){
            this.reset();
            this.initPageData();
        },
        "AuthenType"(code){
            // this.componentsData = this.data;
            this.componentsData = this.PAGESTORE[code] || {};
        }
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
.enterprise-type{
   h4{
        margin-top: 20px;
        padding-bottom: 10px;
   }
    .el-radio{
        margin-left: 20px;
    }
}

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

