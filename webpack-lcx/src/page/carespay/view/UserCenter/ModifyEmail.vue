<template>
 <transition name="fade">
    <div class="email-container">
        <h2 class="personal-module-title">修改登录邮箱</h2>
        <el-form style="padding-top:20px;" :inline="true">
            <!--新邮箱地址-->
            <el-form-item name='email'>
                <el-input v-model="form.newEmail" @blur="inputBlur('newEmail')" name='email'  placeholder="新邮箱地址"></el-input>
            </el-form-item>

            <!--新邮箱验证VERIFYCODE-->
            <el-form-item  name='verifycode'>
                <el-input v-model="form.newEmailCode" @blur="inputBlur('newEmailCode')" name='verifycode' class="getCode-input" placeholder="新邮箱验验证码"></el-input>
                <a href="javascript:;"
                    class="msg-code"
                    :class="emailButtonCode.type" 
                    @click="getEmailVercode"
                >
                    {{emailButtonCode.text}}
                </a>
                <!-- <span class="getCode pain" :class="emailButtonCode.type" @click="getEmailVercode"></span> -->
            </el-form-item>
            <br/>
             <!--手机号-->
            <el-form-item>
                <el-input v-model="form.phone" disabled  placeholder="请输入手机号"></el-input>
                <span class="msg-code ING">中国大陆</span>
            </el-form-item>

            <!--手机验证码-->
            <el-form-item name='phoneCode'>
                <el-input class="getCode-input" v-model="form.phoneCode" @blur="inputBlur('phoneCode')" name='phoneCode' placeholder="手机验证码"></el-input>
                <!-- <span class="getCode pain" @click="getPhoneVercode" :class="phoneButtonCode.type">{{phoneButtonCode.text}}</span> -->
                <a href="javascript:;"
                    class="msg-code"
                    :class="phoneButtonCode.type" 
                    @click="getPhoneVercode"
                >
                {{phoneButtonCode.text}}
                </a>
            </el-form-item>
             <br/>
            
            <!--确认提交-->
            <a href="javascript:;" class="cares-button-primary comfirm-submit" @click="comfirmSubmit">确认提交</a>

        </el-form>
    </div>
 </transition>
</template>

<script>

    import{ 
        updateEmail,                        //修改邮箱
        sendEamilCodeByEmail,               //账号中心--发送修改邮箱的  邮箱  验证码
        sendPhoneCodeByEmail,               //账号中心--发送修改邮箱的  手机  验证码
    } from '../../../../js/api.js';         

    import {
        queryCustomerInfo
    } from '../../utils/localbase.js'

    import VERIFICAT from '../../../../js/verification.js';//导入校验js

    export default {
        data(){
            return{
                form:{
                    newEmail:'',//新邮箱地址
                    newEmailCode:'',//新邮箱验证
                    phone:'',//手机号
                    phoneCode:'',//手机验证码
                },
                verifyTimer:null,
                phoneVerifyTimer:null,
                emailButtonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                phoneButtonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                AjaxIng:false,
            }
        },
        created () {

             queryCustomerInfo().then(res=>{
                let customerInfo = res;
                this.form.phone = customerInfo.phoneNo;          //注册的手机号码
               
               if(res.status!=1){
                   this.$router.push({name:"AccountCenter"});
               };
            })
        },  
        methods: {
            //定义鼠标失去焦点进行校验
            inputBlur(name){
                if(name=='newEmail'){
                   return VERIFICAT('email',this.form[name]);//传递name,以及对象的val值
                }else if(name=='newEmailCode'){
                   return VERIFICAT('verifycode',this.form[name]);
                }else{
                   return VERIFICAT(name,this.form[name]);//传递name,以及对象的val值
                }
                
            },
            //获取邮箱验证码
            getEmailVercode(){

                // if(!VERIFICAT(`newEmail`,this.form[`newEmail`])) return;
                if(!this.inputBlur('newEmail')) return;

                if(this.emailButtonCode.type==`ING`) return;

                sendEamilCodeByEmail({
                    newEmail:this.form.newEmail
                }).then(res=>{
                     if(res.code==0){
                         this.emailButtonCode.type='ING';
                         let time = 60;
                         //定时器倒计时
                         this.verifyTimer = setInterval(()=>{
                             time--;
                             this.emailButtonCode.text=`重新获取(${time}s)`;
                             if(time==0){

                                 this.emailButtonCode={
                                     type:'cares-color',
                                     text:'获取验证码',
                                 };

                                 clearInterval(this.verifyTimer);
                             };
                         },1000);

                     }else{
                         this.$Message.error(res.msg)
                     }
                })
            },
            //获取手机验证码
            getPhoneVercode(){

                if(this.phoneButtonCode.type==`ING`) return;

                sendPhoneCodeByEmail(this.form.phone).then(res=>{
                    if(res.code==0){
                         this.phoneButtonCode.type='ING';
                         let time = 60;
                         //定时器倒计时
                         this.phoneVerifyTimer = setInterval(()=>{
                             time--;
                             this.phoneButtonCode.text=`重新获取(${time}s)`;
                             if(time==0){

                                 this.phoneButtonCode={
                                     type:'cares-color',
                                     text:'获取验证码',
                                 };

                                 clearInterval(this.phoneVerifyTimer);
                             };
                         },1000);

                     }else{
                         this.$Message.error(res.msg)
                     }
                })
            },
            //修改邮箱提交发送请求
            comfirmSubmit(){
                //重新进行一遍校验
                //重新定义一个数组，存储需要校验的name值
                let arr = ['newEmail','newEmailCode','phoneCode'];//无需遍历form对象,直接通过数组

                let flag = true;
                for(var i = 0; i<arr.length; i++){
                    let n = arr[i];
                    //获取到遍历的每一个name值
                    if(n=='newEmail'){
                        if(!VERIFICAT('email',this.form[n]) )  flag = false;
                    }else if(n=='newEmailCode'){
                        if(!VERIFICAT('verifycode',this.form[n]) )  flag = false;
                    }else{
                        if(!VERIFICAT(n,this.form[n]) )  flag = false;//传递name,以及通过name值获取到对应的val值
                    }
                }

                 if(!flag) return;

                 if(this.AjaxIng) return;
                 this.AjaxIng = true;

                //发送请求
                updateEmail(this.form).then(res=>{
                    this.AjaxIng = false;
                   res.code==0?
                   (
                       this.$Message.success(`修改成功！`),
                       setTimeout(()=>{
                           location.reload();
                       },2000)
                   ):
                   (this.$Message.error(res.msg))
                });
            }
        },
       
    }
</script>

<style lang="scss" scoped>


    //控制输入框中的宽度
    .el-input{
        width:247px !important;
    }

    .email-container{
        padding:0px 20px;
        margin-left: 10px;
        min-height: 400px;
        h2.personal-module-title{
             height: 80px;
            line-height: 80px;
        }
        form{
            padding:0px 10px;
            //确认提交按钮
            .comfirm-submit{
                 width:247px;
                margin-bottom: 20px;
            }
        }
    }

    .el-form{
        .el-form-item{
            margin-right: 20px;
            position: relative;
            .msg-code{
                display: inline-block;
                position: absolute;
                right: 10px;
                top:1px;
                font-size: 12px;
            }
        }
    }
</style>
