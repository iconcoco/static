<template>
    <div class="fadeIn">
        <h2 class="banner-module-title">
             <template v-if="DATA.isApply">申请注册</template>
             <template v-else>申请详情</template>
              <!-- v-if="!DATA.isApply"  -->
            <a href="javascript:;" class="fr fontnormal cares-color"  @click="jumpToAplly('applyList')">返回我的申请列表</a>

            <p class="status-box" v-if="!DATA.isApply">
                <span>审核状态：</span>
                <span v-if="DATA.status==0" class="cares-color">审核中</span>
                <span v-if="DATA.status==1" class="yes">申请成功</span>
                <span v-if="DATA.status==2" class="no">申请异常</span>
                <span v-if="DATA.status==3" class="ING">待支付</span>
                <span v-if="DATA.status==4" class="cares-color">支付中</span>
                <span v-if="DATA.status==5" class="no">支付失败</span>
                <span v-if="DATA.status==8" class="cares-color">申请中</span>

                <a href="javascript:;" v-if="DATA.status==5" class="cares-button-primary"  @click="jumpToAplly('PayVatService')">重新发起支付</a>

                <span class="ING" v-if="DATA.status==0">（CaresPAY工作人员将在1-2个工作日内与您取得联系，请及时准备申请资料）</span>
                <span class="ING" v-if="DATA.status==2">（CaresPAY工作人员将在1-2个工作日内与您取得联系，或电话咨询400-887-0201）</span>
                <span class="ING" v-if="DATA.status==8">（预计{{handleTime(form.nation)}}申请成功，若遇节假日会延期）</span>
            </p>
         </h2>
        
        <div class="refuse-reason" v-if="!DATA.isApply && [2,5].includes(DATA.status)">
            <p>因为以下原因，{{DATA.status == 5 ? '您支付失败了' : '您的申请发生异常'}}：</p>
            <ul>
                <li>
                    <i class="point no"></i> {{DATA.data.remark}}
                </li>
            </ul>
        </div>

         <el-form :model="form" class="Apply-vat-form">
            <el-form-item label="申报国家">
                <el-select v-model="form.nation" placeholder="请选择申报国家" v-if="DATA.isApply">
                  <el-option v-for="(item,index) in NationCode" :key="index"
                    v-if="item.platformCode == 'EU'"
                    :label="item.nation"
                    :value="item.code"
                  ></el-option>
                </el-select>
                <span v-else>{{fineValName(form.nation,NationCode,'nation','code')}}</span>
            </el-form-item>

            <el-form-item v-if="DATA.isApply" label="代理机构">CaresPAY</el-form-item>

            <el-form-item v-if="DATA.isApply" label="收款人">凯蓝仕金融服务（深圳）有限公司</el-form-item>

            <el-form-item label="服务类型">
                <template v-if="DATA.isApply">
                    <el-radio v-model="form.type" label="1" name="holderType">注册+首年申报</el-radio>
                    <el-radio v-if="['GB','DE','IT','ES'].includes(form.nation)"  v-model="form.type" label="0" name="holderType">单次注册</el-radio>
                </template>
                <template v-else>
                    <span v-if="form.type==1">注册+首年申报</span>
                    <span v-if="form.type==0">单次注册</span>
                </template>
            </el-form-item>

            <div class="form-item" :class="{line:DATA.isApply}">
                <span>{{DATA.isApply?'预计费用':'服务费用'}}</span><div class="item">
                    <b class="cares-color fs20">{{(PRICE.price)/100}}￥</b> 
                    <template v-if="DATA.isApply && (PRICE.marketPrice>PRICE.price)">
                        (<del class="ING">{{(PRICE.marketPrice)/100}}￥</del>) 
                        <router-link v-if="['GB','DE','IT','ES'].includes(form.nation)" 
                        class="cares-color use-cares" to="/addshop">使用CaresPAY收款，立减￥{{(PRICE.marketPrice-PRICE.price)/100}}</router-link>
                    </template>
                </div>
            </div>

            <p class="title" v-if="DATA.isApply">请确认申请人的基本信息</p>

            <el-form-item label="申请人电话" name="phoneNo">
                 <el-input 
                     v-if="DATA.isApply"
                    type="number"
                    v-model="form.phoneNo" 
                    name="phoneNo"  
                    @blur="bindIptBlur('phoneNo')" placeholder="请输入手机号码"></el-input>
                <span v-else>{{form.phoneNo}}</span>

                 <span v-if="DATA.isApply" class="ING mgl5">该手机号用于CaresPAY工作人员线下联系客户，请保持手机畅通</span>
            </el-form-item>

            <el-form-item label="申请人邮箱" name="email">
                 <el-input v-model="form.email" 
                 v-if="DATA.isApply"
                 name="email"  @blur="bindIptBlur('email')"  placeholder="请输入申请人邮箱"></el-input>
                 <span v-else>{{form.email}}</span>

                 <span v-if="DATA.isApply" class="ING mgl5">该邮箱地址将用于VAT相关资料的接受，请注意及时查收</span>
            </el-form-item>

            <div class="form-item" v-if="DATA.isApply || DATA.status == 2">
                <span>所需材料</span><div class="item">
                    <a :href="`${DOMAIN.login}#/vat/${form.nation}`" target="__blank" class="cares-color">点击查看</a>
                </div>
            </div>

            <div class="form-item line" v-if="DATA.isApply">
                <div class="item">
                    <el-checkbox v-model="isRead">我已阅读并同意</el-checkbox><a href="javascript:;" @click="changeServiceModel(true)" class="cares-color">《VAT服务条款》</a> 
                </div>
            </div>

            <a v-if="DATA.isApply" :class="isRead ? 'cares-button-primary' : 'cares-button-info'" href="javascript:;"
                @click="toSubmitAplly"
            >提交申请</a>

            <template  v-if="!DATA.isApply && [4,5,8].includes(DATA.status)" >
                <div class="form-item lineTop">
                    <span>VAT号码</span><div class="item">
                        <template v-if="DATA.status == 8">已提交申请资料至税局，预计{{handleTime(form.nation)}}下发税号</template>
                        <template v-else>待支付成功后，提交VAT申请至税局</template>
                    </div>
                </div>

                <div class="form-item" v-if="DATA.status == 5">
                    <span>VAT申报税率</span><div class="item">
                        正常税率
                    </div>
                </div>
            </template>
            
            <template  v-if="!DATA.isApply && (DATA.status == 1)" >

                <div class="form-item lineTop" v-if="['IT','ES'].includes(form.nation)">
                    <span>欧盟内部增值税税号</span><div class="item">{{DATA.data.dutyEuNumber}}</div>
                </div>
                <div class="form-item lineTop" v-else>
                    <span>增值税/商品和服务税登记号</span><div class="item">{{DATA.data.dutyServiceNumber}}</div>
                </div>

                <div class="form-item" v-if="['DE'].includes(form.nation)">
                    <span>Steuernummer（税务识别号）</span><div class="item">{{DATA.data.dutySteuernummer}}</div>
                </div>

                <div class="form-item" v-if="['IT','ES'].includes(form.nation)">
                    <span>本地增值税号</span><div class="item">{{DATA.data.dutyLocalNumber}}</div>
                </div>

                <div class="form-item" v-if="form.nation == 'GB'">
                    <span>税号生效时间</span><div class="item">{{formatTimer(DATA.data.dutyEffectTime)}}</div>
                </div>

                 <div class="form-item" v-if="['DE','ES'].includes(form.nation)">
                    <span>税务副本</span><div class="item">
                        <a target="_blank" v-if="DATA.data.dutyTaxCopy" :href="`${downloadfile}${DATA.data.dutyTaxCopy}`">下载税务副本</a>
                        <!-- <a href="javascript:;">点击下载</a> -->
                    </div>
                </div>

                <div class="form-item">
                    <span>EORI号码</span><div class="item">{{DATA.data.dutyEoriNumber || '税号下发后预计1~2个月内下发'}}</div>
                </div>

                <div class="form-item" v-if="DATA.data.type==1">
                    <span>服务有效期</span><div class="item">{{formatTimer(DATA.data.finishTime,true)}}</div>
                </div>
            </template>
         </el-form>

         <VatService 
            v-model="flag"
            :buttonEvent="serviceButtonEvent"
         ></VatService>

    </div>
</template>

<script>
import domain from './../../../../../js/domain.js'
import {NationCode} from './../../../utils/localbase.js';
import verification from './../../../../../js/verification.js';
// import AdminModel from './../../../../../components/adminModel.vue';

import VatService from './../VATServiceAgreement.vue';
import { formatTimer } from './../../../../../js/common.js';
import { 
    downloadfile,
    vatrecordGetPayMoney,
    vatrecordSave } from './../../../../../js/api.js';

 import {
        queryCustomerInfo,      //客户信息
    } from './../../../utils/localbase.js';

export default {
    data(){
        let AllNationCode = NationCode.concat([
            {
                nation:'波兰',
                code:'PL',
                platformCode:'EU',
            },
            {
                nation:'捷克',
                code:'CZ',
                platformCode:'EU',
            },
        ]);

        return {
            form:{
                nation:'GB',
                type:'1',
                phoneNo:'',
                email:'',
            },

            PRICE:{
                price:0,
                marketPrice:0
            },


            flag:false,
            isRead:false,
            DOMAIN:domain,
            downloadfile:downloadfile,
            NationCode:AllNationCode,

            ING:false
        }
    },
    props:['DATA'],
    created(){

        if(this.DATA.isApply){
            //申请页面
            queryCustomerInfo().then(res=>{
                this.form.phoneNo = res.phoneNo;
                this.form.email = res.email;
            }),
            this.getVatMoney();
        }else{
            //详情页面.
            this.form.nation = this.DATA.data.declaredCountry;
            this.form.type = this.DATA.data.type;
            this.form.phoneNo = this.DATA.data.phone;
            this.form.email = this.DATA.data.email;
        }
    },
    methods:{
        getVatMoney(){
            vatrecordGetPayMoney({
                nationalCode:this.form.nation,
                type:this.form.type,
            }).then(res=>{
                if(res.code==0){
                    this.PRICE = res.data
                }else{
                    this.$Message.error(res.code);
                }
            })
        },

        jumpToAplly(page){
            this.$emit('jumpPage',{
                page,
                data:this.DATA.data
            });
        },

        bindIptBlur(name){
            let value;
            value = this.form[name];
           return verification(name,value);
        },

        toSubmitAplly(){
            let must = ['phoneNo','email'];
            let flag = true;

            must.forEach(key =>{
               if(!this.bindIptBlur(key)) flag = false;
            });

            if(!flag) return;

            if(!this.isRead) return this.changeServiceModel(true);

            if(this.ING) return;
            this.ING = true;
            //发起注册
            let { 
                nation:declaredCountry,
                type,
                phoneNo:phone,
                email,
            } = this.form;

            vatrecordSave({
                declaredCountry,
                type,
                phone,
                email
            }).then(res=>{
                this.ING = false;
                if(res.code==0){
                     this.$router.push({
                        name:'AuthenticationDone',
                        params:{
                            source:'VATRegistDone'
                        }
                    })
                }else{
                    this.$Message.error(res.msg);
                }

            });

        },

        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
        serviceButtonEvent(bol){
            this.isRead = bol;
            this.changeServiceModel(false);
        },
        changeServiceModel(bol){
            this.flag = bol;
        },
        formatTimer(code,bol){
            return formatTimer(code,bol);
        },
        handleTime(code){
            let msg = null;
            switch(code){
                case 'GB':{ msg='1~6周内' }break;
                case 'DE':{ msg='1~5个月内' }break;
                case 'FR':{ msg='3~4个月内' }break;
                case 'IT':{ msg='1~2周内' }break;
                case 'ES':{ msg='1.5个月左右' }break;
                case 'CZ':
                case 'PL':
                { msg='2个月左右' }break;
            }

            return msg;
        }
    },
    watch:{
        'form.nation'(code){
            !['GB','DE','IT','ES'].includes(code) && (this.form.type='1');

            this.getVatMoney();
        },
        "form.type"(){
             this.getVatMoney();
        }
    },
    components:{
        VatService
    }
}
</script>


<style lang="scss" scoped>
    form{
        padding-top: 20px;
        padding-bottom: 20px;
        .fs20{
            font-size: 20px;
        }
        .mgl5{
            margin-left: 5px;
            font-size: 12px;
        }

        .el-select,
        .el-input{
            width: 300px;
        }

        .use-cares{
            font-size: 12px;
            margin-left: 20px;
            text-decoration: underline;
        }

        .title{
            margin-bottom: 20px;
        }
    }

    .form-item{
        margin-bottom: 20px;
        &.line{
            padding:20px 0;
            border-top: 1px solid #f1f1f1;
            border-bottom: 1px solid #f1f1f1;
        }
        &.lineTop{
            padding-top: 20px;
            border-top: 1px solid #f1f1f1;
        }   
    }

      //审核失败
    .refuse-reason{
        margin-top: 10px;
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

.banner-module-title{
    height: auto;
    line-height: normal;
    font-weight:bold;
    padding: 20px 0;
    font-size: 18px;

    .fontnormal{
        font-weight: normal;
        font-size: 16px;
    }
    p{
        margin-top: 5px;
        font-size: 14px;
        font-weight: normal;
    }
}
</style>

<style lang="scss">
    .Apply-vat-form{
        .el-form-item__label{
            min-width:250px;
            text-align:left;
        }
        .el-form-item__error{
            left: 250px;
        }
        .el-form-item__content p{
            padding-left:250px;
            font-size:12px;
            color:#999;
            line-height:24px;
            // padding-top:10px;
        }
        .form-item{
            >span{
                min-width:250px;
                text-align:left;
                margin-right:0px;
            }
        }
    }
</style>
