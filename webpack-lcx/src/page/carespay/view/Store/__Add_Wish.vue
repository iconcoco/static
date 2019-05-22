<template>
    <div class="fadeIn">
           <!-- 未认证 -->
        <template v-if="!AuthDone">
            <a :href="URL" class="cares-button-primary pain">{{URL=='javascript:;' ? `正在生成...` : `前往Wish后台授权`}}</a>
            <span class="no authenNotice">温馨提示：请确保您在该店铺常用的IP环境进行操作，以免发生关联</span>
        </template>
        <!-- 认证失败 -->

        <template v-else>
            <div class="ebay-auth-success">
                <p class="success-fadeIn"> <span class="ebay-yes"></span> 您已成功授权！ </p>
            </div>

            <div v-if="RefuseReason.length" class="refuse-reason">
                <p>因为以下原因，您的店铺资料审核未通过：</p>
                <ul>
                    <li class="no" v-for="(item,index) in RefuseReason" :key="index">
                        <i class="point no"></i> {{item.remark}}
                    </li>
                </ul>
            </div>

            <div class="form-item" style="margin-bottom:0px;">
                    <span class="bold" style="width:auto;">店铺信息</span>
                    <!-- <div class="item">
                        <span>（请如实填写以下信息，完善您的店铺资料）</span>
                    </div> -->
            </div>
            
            <el-form-item class="ebay-form-item" label="店铺名称" name="storeName">
                <el-input :disabled="(isEdit && AuditStatus['storeName'] !=3)" type="text" name="storeName" @blur="bindIptBlur('storeName')" v-model="form.storeName" placeholder="店铺名称"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="注册邮箱" name="ebayEmail">
                <el-input :disabled="(isEdit && ReturnAuditStatus('ebayEmail'))" type="text" name="ebayEmail" @blur="bindIptBlur('ebayEmail')" v-model="form.ebayEmail" placeholder="注册邮箱"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="店铺链接" name="ebayStoreLink">
                <el-input :disabled="(isEdit && ReturnAuditStatus('storeLink'))" type="text" name="ebayStoreLink" @blur="bindIptBlur('ebayStoreLink')" v-model="form.ebayStoreLink" placeholder="店铺链接"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="绑定的PayPal账号" name="paypalAccount">
                <el-input :disabled="(isEdit && ReturnAuditStatus('paypalAccount'))" type="text" name="paypalAccount" @blur="bindIptBlur('paypalAccount')" v-model="form.paypalAccount" placeholder="店铺绑定的PayPal账号"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="PayPal账户姓名" name="paypalName">
                <el-input :disabled="(isEdit && ReturnAuditStatus('paypalName'))" type="text" name="paypalName" @blur="bindIptBlur('paypalName')" v-model="form.paypalName" placeholder="PayPal账户姓名"></el-input>
            </el-form-item>

            <!-- 提现账号与币种 -->
            <div class="form-item channel"><span class="bold">提现方式</span>
                <!-- <i class="small">（可选择提现人民币到国内银行账户、提现外币至香港银行账户）</i> -->
            </div>
            <el-form-item label="提现币种与账号" name="channelCode">
                <el-select :disabled="(isEdit && STORE_STATUS !=3)" v-model="form.channelCode" name="channelCode" placeholder="请选择提现账号与币种">
                    <el-option label="人民币至国内银行账户" value="A"></el-option>
                    <el-option label="外币至香港银行账户" value="C"></el-option>
                </el-select>
                <el-tooltip effect="dark" content="如有其它提现需求，请及时联系CaresPAY客服团队 400-887-0201" placement="top-end">
                    <i style="color:#666;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <div class="line">
                <el-checkbox v-model="isAgree">我已阅读并同意</el-checkbox>
                <a class="cares-color" @click="bindShowAppointment" href="javascript:;">《Wish店铺使用条款》</a>
            </div>

            <span  v-if="!isEdit" @click="__bindAddShopNext"  :class="isAgree?'cares-button-primary':'cares-button-info'">{{(['EU','YD'].indexOf(form.platformCode)>-1) ? "下一步":"绑定店铺"}}</span>
            <span v-if="isEdit && (STORE_STATUS==3)" @click="__bindAddShopNext" :class="isAgree?'cares-button-primary':'cares-button-info'">重新绑定</span>

        </template>

         <!-- 条款弹框 -->
        <div class="appointment-content">
            <el-popover placement="top-end" v-model="showAppiont">
                <h2>Wish店铺使用条款</h2>
                <p>
                    点击“绑定店铺”按钮，即意味着您确认当前申请店铺的经营权和所有权（包括店铺相关存货、资金等资产)属于您所有，并负责管理。您承诺不出售假冒产品或侵犯知识产权的产品，不进行其它违反CaresPAY用户协议条款及当地法律法规的行为。一切因您的不合规或不合法操作产生的责任由您承担，与CaresPAY及其关联企业无关。
                </p>
                <div class="btn">
                    <span @click="bindAppiontRes(false)" class="cares-button-danger pain">不同意</span>
                    <span  @click="bindAppiontRes(true)" class="cares-button-primary">同意</span>
                </div>
            </el-popover>
        </div>
    </div>
</template>


<script>
import VERIFICATION from '../../../../js/verification.js';
 import {
     addStoreDetail,
     getWishAuthorizeUrl,
     updateStoreDetail,
 } from '../../../../js/api.js';
export default {
    data(){
        return{
            STORE_STATUS:1,
            form:{
                platformCode:'WISH',  //平台
                nation:'US',          //国家
                storeType:2,
                storeName:'', 
                ebayEmail:'', 
                ebayStoreLink:'', 
                paypalAccount:'', 
                paypalName:'', 

                channelCode:'',
                id:'',                  //店铺ID
            },

            showAppiont:false,
            isAgree:false,
            ING:false,


            //2019-3-8 wish认证
            AuthDone:false,
            URL:'javascript:;',
            RefuseReason:[],

            //审核状态
            AuditStatus:{
                storeName:0,
                ebayEmail:0,
                storeLink:0,
                paypalAccount:0,
                paypalName:0,
            }
        }
    },
    props:["isEdit","data","STORESTATUS",'AfterJumpFn','wishAuthLink','wishAuthTokenCode'],
    created(){
        this.STORE_STATUS = this.STORESTATUS;

        if(this.isEdit){
            //编辑页面，默认wish后台已经认证
            this.AuthDone = true;
             //编辑页面           
            for (const key in this.form) {
                this.form[key] = (this.data[key] || "");
            };
        
            //2019-1-22 对应每一项的审核状态
            this.data['auditInfoVoList'] && this.data['auditInfoVoList'].forEach(item=>{
                 //店铺审核失败原因
                if(item.auditStatus==3) this.RefuseReason.push(item);
                
                if( this.AuditStatus.hasOwnProperty(item.auditField)){ 
                    this.AuditStatus[item.auditField]=item.auditStatus;
                 };
            });
        }else{
            //当前是添加店铺页面 而且没有认证之后的code  请求链接地址authCode
            !this.wishAuthTokenCode ? this.__queryWishAuthUrl() :(
                this.AuthDone = true,
                this.form.authCode = this.wishAuthTokenCode
            );
        }
    },
    methods:{
        __bindAddShopNext(){
             //1. 必填字段
            let must = ['storeName','ebayEmail','ebayStoreLink','paypalAccount','paypalName','channelCode'];

            //2. 验证必填结果
            let flag = true;

            for(let i =0; i<must.length;i++){
                if(!this.bindIptBlur(must[i])) flag = false;
            }
            if(!flag) return;

             //3. 判断是否阅读条款
            if(!this.isAgree) return  this.showAppiont = true;

            //4.进行ajax请求
            this.__DOAJ();
        },
        __DOAJ(){
            if(this.ING) return;
                this.ING = true;
            
            //已经完成编辑
            this.$emit('transparams',{name:'fillDone',value:true});
            // return console.log(this.form);
                  //4.1 编辑店铺
            this.isEdit && updateStoreDetail(this.form).then(res=>{
                 this.ING = false;
                if(res.code==0){
                    this.$Message.success('修改成功！');
                     //2019-3-1 跳转到成功提示页面
                    this.AfterJumpFn();
                }else{
                    this.$Message.error(res.msg);
                }
             });
             //4.2 添加店铺
           !this.isEdit && addStoreDetail(this.form).then(res=>{
               this.ING = false;
                if(res.code==0){
                    this.$Message.success('添加成功！');
                     //2019-3-1 跳转到成功提示页面
                    this.AfterJumpFn();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        __queryWishAuthUrl(){
             this.wishAuthLink ? (
                this.URL = this.wishAuthLink
            ):(
                getWishAuthorizeUrl({pageSource:"carespay"}).then(res=>{
                    if(res.code==0){
                        this.URL = res.data;
                        this.$emit('transparams',{
                            name:'wishLink',
                            value:res.data
                        })
                    }else{
                        this.$Message.error(res.msg);
                    }
                })
            );
        },
         //失去焦点验证必填
        bindIptBlur(name){
           return VERIFICATION(name,this.form[name]);
        },
        bindShowAppointment(){
            this.showAppiont = true;
        },
        bindAppiontRes(bol){
             this.showAppiont = false;
             this.isAgree = bol;
        },
        ReturnAuditStatus(code){
            if(this.STORE_STATUS!=3) return true;   //如果不可以编辑提交 都不能编辑
            //销售类目
            return [0,3].indexOf(this.AuditStatus[code]) < 0;
        },
        bindToReAgree(){
            //重新授权
            this.$router.push({
                name:"Reflesh",
                params:{
                    name:"AddShop"
                }
            });
        },
    }
}
</script>

