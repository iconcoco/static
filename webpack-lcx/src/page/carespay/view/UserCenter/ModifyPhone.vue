<template>
 <transition name="fade">
   <div class="phone-container">
        <h2 class="personal-module-title">修改登录手机</h2>
        <el-form style="padding-top:20px;" :inline="true">
             <!--验证方式-->
            <el-form-item label="验证方式" >
                <el-radio v-model="form.type" name="type" label="1">手机验证</el-radio>
                <el-radio v-if="form.emailAdress" v-model="form.type" name="type" label="2">邮箱验证</el-radio>
            </el-form-item>
            <br/>

            <!--登录密码-->
            <el-form-item  v-if="form.type == 1" name="password">
                <el-input type="password" v-model="form.password" @blur="bindIptBlur('password')" name="password" placeholder="请输入登录密码"></el-input>
            </el-form-item>

            <br/>
                <!--原手机/邮箱号码-->
            <el-form-item>
                <el-input  v-if="form.type == 1" v-model="form.orginPhone"  disabled placeholder=""></el-input>
                <el-input  v-if="form.type == 2" v-model="form.emailAdress" disabled placeholder=""></el-input>
            </el-form-item>

            <!--原手机/邮箱验证码-->
            <el-form-item name="verifycode">
                <el-input v-if="form.type == 1"  v-model="form.oldCode" @blur="bindIptBlur('oldCode')" name="verifycode" placeholder="原手机验证码"></el-input>
                <a v-if="form.type == 1" href="javascript:;" 
                    :class="phoneOldButtonCode.type"
                    @click="modifyOrginPhone"
                    class="msg-code">{{phoneOldButtonCode.text}}</a>

                <el-input  v-if="form.type == 2" v-model="form.emailCode" @blur="bindIptBlur('emailCode')" name="verifycode"  placeholder="原邮箱验证码"></el-input>
                <a v-if="form.type == 2" href="javascript:;" 
                    :class="emailButtonCode.type"
                    @click="sendOriginEmail"
                    class="msg-code">{{emailButtonCode.text}}</a>
            </el-form-item>

             <br/>
             <!--新手机号码-->
            <el-form-item name="phoneNo">
                <el-input v-if="form.type==1" v-model="form.newPhone" @blur="bindIptBlur('newPhone')" name="phoneNo" placeholder="请输入新手机号码"></el-input>
                <el-input  v-if="form.type==2" v-model="form.newPhoneNo" @blur="bindIptBlur('newPhoneNo')" name="phoneNo" placeholder="请输入新手机号码"></el-input>
            </el-form-item>

             <!--新手机验证码-->
            <el-form-item name="phoneCode">
                <el-input  v-if="form.type==1" v-model="form.nowCode"  @blur="bindIptBlur('nowCode')" name="phoneCode" placeholder="新手机验证码"></el-input>
                <el-input  v-if="form.type==2" v-model="form.newPhoneNoCode"  @blur="bindIptBlur('newPhoneNoCode')" name="phoneCode" placeholder="新手机验证码"></el-input>
                <a href="javascript:;"
                    class="msg-code"
                    v-if="form.type==1" :class="phoneNewButtonCode.type"
                    @click="modifyNewPhone(1)"
                >{{phoneNewButtonCode.text}}</a>
                <a href="javascript:;"
                    class="msg-code"
                    v-if="form.type==2" :class="phoneNewButtonCode.type"
                    @click="modifyNewPhone(2)"
                >{{phoneNewButtonCode.text}}</a>
            </el-form-item>
            <br/>
            <!--确认提交-->
            <a href="javascript:;" class="cares-button-primary comfirm-submit" @click="comfirmSubBtn">提交</a>
        </el-form>
    </div>
 </transition>
</template>

<script>

    import{ 
        updatePhone,                                                //修改手机号码
        sendCodeByOldPhone,                                         //发送修改手机号的  原手机  验证码
        sendCodeByNewPhone,                                         //发送修改手机号的  新手机  验证码
        sendEamilCodeByPhone,                                       //发送修改邮箱的  邮箱  验证码
        updatePhoneByEmail,                                          //通过邮箱修改手机号码
        sendPhoneCodeByPhone                                          //通过邮箱修改手机号码
    } from '../../../../js/api.js';

    import {
        queryCustomerInfo
    } from '../../utils/localbase.js'

    import VERIFICAT from '../../../../js/verification.js';//导入校验js

    export default {
        data(){
            return{
                form:{
                    type:'1',                  //验证方式类型
                    orginPhone:'',             //原手机号码
                    oldCode:'',                //原手机验证码
                    password:'',               //登录密码
                    newPhone:'',               //新手机号码
                    nowCode:'',                //新手机验证码
                    emailAdress:'',            //邮箱地址

                    emailCode:'',               //原邮箱验证码
                    newPhoneNo:'',              //邮箱验证新手机号码
                    newPhoneNoCode:'',          //邮箱验证新手机验证码
                },
                phoneOldButtonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                phoneNewButtonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                emailButtonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                verifyTimer:null,
                verifyNewPhoneTimer:null,
                verifyEmailTimer:null,
                AjaxIng:false,
            }
        },
        created() {

            queryCustomerInfo().then(res=>{
                let customerInfo = res;
                this.form.orginPhone = customerInfo.phoneNo;
                this.form.emailAdress = customerInfo.email;

                if(!customerInfo.phoneNo) this.$router.push({name:'AccountCenter'});
            });
        },
        methods:{
            //获取原手机验证码
            modifyOrginPhone(){
                
                if(this.phoneOldButtonCode.type=='ING') return;

                sendCodeByOldPhone().then(res=>{
                     if(res.code==0){
                            this.phoneOldButtonCode.type='ING';
                            let time = 60;
                            //定时器倒计时
                            this.verifyTimer = setInterval(()=>{
                                time--;
                                this.phoneOldButtonCode.text=`重新获取(${time}s)`;
                                if(time==0){

                                    this.phoneOldButtonCode={
                                        type:'cares-color',
                                        text:'获取验证码',
                                    };

                                    clearInterval(this.verifyTimer);
                                };
                            },1000);

                        }else{
                            this.$Message.error(res.msg)
                        }
                });
            },
            //获取新手机验证码
            modifyNewPhone(type){
                let t = null,
                    _this = this;
                type==1 ? (t='newPhone'):(t='newPhoneNo')

                if(this.phoneNewButtonCode.type=='ING') return;
                // if(!VERIFICAT(t,this.form[t])) return;
                if(!this.bindIptBlur(t)) return;

                type==1 && sendCodeByNewPhone({phoneNo:this.form[t]}).then(res=>{dueFn(res)});

                type==2 && sendPhoneCodeByPhone({phoneNo:this.form[t]}).then(res=>{dueFn(res)});

                function dueFn(res){
                    if(res.code==0){
                            _this.phoneNewButtonCode.type='ING';
                            let time = 60;
                            //定时器倒计时
                            _this.verifyNewPhoneTimer = setInterval(()=>{
                                time--;
                                _this.phoneNewButtonCode.text=`重新获取(${time}s)`;
                                if(time==0){

                                    _this.phoneNewButtonCode={
                                        type:'cares-color',
                                        text:'获取验证码',
                                    };

                                    clearInterval(_this.verifyNewPhoneTimer);
                                };
                            },1000);

                    }else{
                        _this.$Message.error(res.msg)
                    }
                }
            },
            //获取原邮箱验证码
            sendOriginEmail(){

                if(!this.form.emailAdress) return

                if(this.emailButtonCode.type=='ING') return;

                    sendEamilCodeByPhone().then(res=>{
                        if(res.code==0){
                            this.emailButtonCode.type='ING';
                            let time = 60;
                            //定时器倒计时
                            this.verifyEmailTimer = setInterval(()=>{
                                time--;
                                this.emailButtonCode.text=`重新获取(${time}s)`;
                                if(time==0){

                                    this.emailButtonCode={
                                        type:'cares-color',
                                        text:'获取验证码',
                                    };

                                    clearInterval(this.verifyEmailTimer);
                                };
                            },1000);

                        }else{
                            this.$Message.error(res.msg)
                        }
                    })
            },
            //输入框失去焦点(单个校验)
            bindIptBlur(name){
                 switch(name){
                    case 'oldCode':
                    case 'emailCode':
                    {
                        return  VERIFICAT('verifycode',this.form[name]);
                    }
                    break;
                    case 'nowCode':
                    case 'newPhoneNoCode':
                    {
                        return  VERIFICAT('phoneCode',this.form[name]);
                    }
                    break;
                    case 'newPhone':
                    case 'newPhoneNo':
                    {
                        return  VERIFICAT('phoneNo',this.form[name]);
                    }
                    break;
                    default :{
                        return  VERIFICAT(name,this.form[name]);
                    }
                }
            },
            //提交修改密码按钮
            comfirmSubBtn(){
                //定义一个空数组，判断类型
                let arr = [];
                if(this.form.type == 1){
                    arr = ['oldCode','password','newPhone','nowCode'];
                }else if(this.form.type == 2){
                    arr = ['emailCode','newPhoneNo','newPhoneNoCode'];
                }

                let flag = true;

                for(var i =0; i<arr.length; i++){
                    if(!this.bindIptBlur(arr[i])) flag = false;
                }

                if(!flag) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;

                //发送请求
             this.form.type == 1 && updatePhone(this.form).then(res=>{
                 this.AjaxIng = false;
                    res.code == 0 ?
                    (
                        this.$Message.success(`修改成功`),
                         setTimeout(()=>{
                           location.reload();
                       },2000)
                    ):
                    (this.$Message.error(res.msg));
                });

             this.form.type == 2 && updatePhoneByEmail(this.form).then(res=>{
                 this.AjaxIng = false;
                    res.code == 0 ?
                    (
                        this.$Message.success(`修改成功`),
                         setTimeout(()=>{
                           location.reload();
                       },2000)
                    ):
                    (this.$Message.error(res.msg));
                });


            }

        }
    }
</script>

<style lang="scss" scoped>

    //控制输入框中的宽度
    .el-input{
        width:247px !important;
    }

    .phone-container{
        padding:0px 20px;
        margin-left: 10px;
        min-height: 400px;
        h2.personal-module-title{
            height: 80px;
            line-height: 80px;
        }
        form{
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
