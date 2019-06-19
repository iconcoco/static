<template>
    <div class="fadeIn">
           <!-- 未认证 -->
        <template v-if="!AuthDone">
            <a :href="URL" class="cares-button-primary pain">{{URL=='javascript:;' ? `正在生成...` : `前往Etsy后台授权`}}</a>
            <span class="no authenNotice">温馨提示：请确保您在该店铺常用的IP环境进行操作，以免发生关联</span>

            <p class="ING etsy-notice">The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</p>
        </template>

        <template v-else>
            <el-form-item class="ebay-form-item" label="店铺名称" name="storeName">
                <el-input type="text" name="storeName" 
                    @blur="bindIptBlur('storeName')"
                    v-model="form.storeName" placeholder="请输入您的店铺名称"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="etsy账户名" name="etsyAccount">
                <el-input type="text" name="etsyAccount" 
                    @blur="bindIptBlur('etsyAccount')"
                    v-model="form.etsyAccount" placeholder="请输入您的etsy账户名"></el-input>
            </el-form-item>

            <el-form-item class="ebay-form-item" label="店铺链接" name="ebayStoreLink">
                <el-input type="text" name="ebayStoreLink" 
                    @blur="bindIptBlur('ebayStoreLink')"
                    v-model="form.ebayStoreLink" placeholder="请输入您的店铺链接"></el-input>
            </el-form-item>

            <div class="line">
                <el-checkbox v-model="isAgree">我已阅读并同意</el-checkbox>
                <a class="cares-color" @click="bindShowAppointment" href="javascript:;">《etsy店铺使用条款》</a>
            </div>

            <span  @click="__bindAddShopNext"  :class="isAgree?'cares-button-primary':'cares-button-info'">绑定店铺</span>

             <!-- 条款弹框 -->
            <div class="appointment-content">
                <el-popover placement="top-end" v-model="showAppiont">
                    <h2>etsy店铺使用条款</h2>
                    <p>
                        点击“绑定店铺”按钮，即意味着您确认当前申请店铺的经营权和所有权（包括店铺相关存货、资金等资产)属于您所有，并负责管理。您承诺不出售假冒产品或侵犯知识产权的产品，不进行其它违反CaresPAY用户协议条款及当地法律法规的行为。一切因您的不合规或不合法操作产生的责任由您承担，与CaresPAY及其关联企业无关。
                    </p>
                    <div class="btn">
                        <span @click="bindAppiontRes(false)" class="cares-button-danger pain">不同意</span>
                        <span  @click="bindAppiontRes(true)" class="cares-button-primary">同意</span>
                    </div>
                </el-popover>
            </div>

        </template>
    </div>
</template>

<script>
import VERIFICATION from '../../../../js/verification.js';
 import {
     getEtsyAuthorizeUrl,addStoreDetail,updateStoreDetail
 } from '../../../../js/api.js';

 
export default {
    props:["isEdit","data","etsyAuthLink","etsyAddflag","AfterJumpFn"],
    data(){
        return {
            AuthDone:false,
            URL:'javascript:;',

            isAgree:false,

            showAppiont:false,
            form:{
                platformCode:'ETSY',  //平台
                storeType:2,
                ebayStoreLink:'',
                storeName:'',
                etsyAccount:'',
                nation:'US',
                id:'',                  //店铺ID
            },
            ING:false,
        }
    },
    created(){
        //判断是否是编辑页面
        if(this.isEdit){
            this.AuthDone = true;

             //编辑页面           
            for (const key in this.form) {
                this.form[key] = key=='etsyAccount' ?  (this.data['paypalEmail'] || "") : (this.data[key] || "");
            };
        }else{
            //当前是添加店铺页面 而且没有认证之后的code  请求链接地址authCode
            

            !this.etsyAddflag  ? this.__queryEtsyAuthUrl() : (
                this.AuthDone = true
            )
            // !this.wishAuthTokenCode ? this.__queryEtsyAuthUrl() :(
            //     this.AuthDone = true,
            //     this.form.authCode = this.wishAuthTokenCode
            // );
          
        }
    },
    methods:{
        __queryEtsyAuthUrl(){
             this.etsyAuthLink ? (
                this.URL = this.etsyAuthLink
            ):(
                getEtsyAuthorizeUrl({
                    callUrl:`${location.href}?platformCode=etsy`
                }).then(res=>{
                    if(res.code==0){
                        this.URL = res.data;
                        this.$emit('transparams',{
                            name:'ETSYLINK',
                            value:res.data
                        });
                    }else{
                        this.$Message.error(res.msg);
                    }
                })
            );
        },
        __bindAddShopNext(){
              //1. 必填字段
            let must = ['storeName','etsyAccount','ebayStoreLink'];

            //2. 验证必填结果
            let flag = true;
             for(let i =0; i<must.length;i++){
                if(!this.bindIptBlur(must[i])) flag = false;
            };

            if(!flag) return;

             //3. 判断是否阅读条款
            if(!this.isAgree) return  this.showAppiont = true;

            //4.进行ajax请求
            this.__DOAJ();
        },
        __DOAJ(){
             if(this.ING) return;
                this.ING = true;

            this.$emit('transparams',{name:'fillDone',value:true});

            this.form['paypalEmail'] = this.form.etsyAccount;

            let FN = this.isEdit ? updateStoreDetail : addStoreDetail

            FN(this.form).then(res=>{
                this.ING = false;
                if(res.code==0){
                    let msg = this.isEdit ? '修改成功！':'添加成功！'
                    this.$Message.success(msg);
                     //2019-3-1 跳转到成功提示页面
                    this.AfterJumpFn();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        bindShowAppointment(){
            this.showAppiont = true;
        },
        bindAppiontRes(bol){
             this.showAppiont = false;
             this.isAgree = bol;
        },

        bindIptBlur(name){
           return VERIFICATION(name,this.form[name]);
        },
    
    }
}
</script>


<style lang="scss" scoped>
.etsy-notice{
    font-size: 12px;
    margin-top: 30px;
}
</style>
