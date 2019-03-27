<template>
 <transition name="fade">
    <div class="password-container">
        <h2 class="personal-module-title">修改密码</h2>
        <el-form style="padding-top:20px;" :inline="true">
            <!--原密码-->
            <el-form-item  name="oldPassword">
                <el-input 
                :type="InputType.oldPassword" v-model="form.oldPassword" @blur="bindIptBlur('oldPassword')"  name="oldPassword" placeholder="请输入原密码"></el-input>
                <i 
                    class="psw-icon close"
                     @click="bindChangeIptType('oldPassword')"
                    :class="`${InputType.oldPassword=='password'?'close':'open'}`"
                ></i>
            </el-form-item>
            <br/>
            <!--新密码-->
            <el-form-item  name="password">
                <input 
                class="cares-input"
                :type="InputType.password"
                @keyup="bindIptKeydown"
                v-model="form.newPassword" 
                @blur="bindIptBlur('newPassword')"  name="password" placeholder="请输入新密码" 
                />
                 <i 
                    class="psw-icon close"
                     @click="bindChangeIptType('password')"
                    :class="`${InputType.password=='password'?'close':'open'}`"
                ></i>
            </el-form-item>

            <!--确认密码-->
            <el-form-item  name="confirmpsw">
                <el-input 
                :type="InputType.confirmpsw"
                name="confirmpsw" v-model="form.comfirmPassword" @blur="bindIptBlur('comfirmPassword')"  placeholder="请再次输入新密码"></el-input>
                <i 
                    class="psw-icon close"
                     @click="bindChangeIptType('confirmpsw')"
                    :class="`${InputType.confirmpsw=='password'?'close':'open'}`"
                ></i>
            </el-form-item>

            <template v-if="form.newPassword.length">
                <p>密码规则：包含数字、大小写字母、特殊字符任意两种或以上6-20字符</p>
                <p class="progress-psw-bar" :class="step.clas">
                    <span class="one"></span>
                    <span class="two"></span>
                    <span class="three"></span>
                    <b>{{step.text}}</b>
                </p>
            </template>
            
            <br/>
            <!--手机号-->
            <el-form-item >
                <el-input  v-model="form.phone" :disabled="true"></el-input>
            </el-form-item>
            <!--手机验证码-->
            <el-form-item name="verifycode" >
                <el-input v-model="form.code" @blur="bindIptBlur('code')"  name="verifycode" placeholder="请输入验证码"></el-input>
                <a href="javascript:;" 
                    class="msg-code"
                    :class="buttonCode.type"
                    @click="modifyPassword"
                >{{buttonCode.text}}</a>
                <!-- <span :class="buttonCode.type" class="getCode pain" >{{buttonCode.text}}</span> -->
            </el-form-item>
            <br/>
            <!--确认提交-->
             <a href="javascript:;" class="cares-button-primary comfirm-submit" @click="comfirmSubBtn">确认提交</a>
        </el-form>
    </div>
 </transition>
</template>

<script>

    import{ 
        updatePassword,       //修改密码
        sendCodeByPassword    //修改密码验证码
    } from '../../../../js/api.js';

    import {
        queryCustomerInfo
    } from '../../utils/localbase.js'


    import VERIFICAT from '../../../../js/verification.js';

    export default {
        data(){
            return{
                input:'',
                form:{
                    oldPassword:'',         //原密码
                    newPassword:'',         //新密码
                    comfirmPassword:'',     //确认密码
                    phone:'',               //手机号
                    code:'',                //手机验证码
                    strength:'',            //密码强度
                },
                verifyTimer:null,
                buttonCode:{
                    type:'cares-color',
                    text:'获取验证码'
                },
                AjaxIng:false,

                step:{
                    clas:``,
                    text:`低`
                },

                InputType:{
                    oldPassword:'password',
                    password:'password',
                    confirmpsw:'password',
                },
            }
        },
        created(){

            queryCustomerInfo().then(res=>{
                let customerInfo = res;
                this.form.phone = customerInfo.phoneNo;          //注册的手机号码
            });

        },
        methods: {
            reset(){
                let arr = ['oldPassword','newPassword','comfirmPassword','code'];
                arr.forEach(item=>{
                    this.form[item] = '';
                });
                //
                clearInterval(this.verifyTimer);
                this.buttonCode = {
                    type:'cares-color',
                    text:'获取验证码'
                }
            },
            //获取修改密码验证码
            modifyPassword(){

                 if(this.buttonCode.type=='ING') return;

                sendCodeByPassword().then(res=>{
                    if(res.code==0){
                         this.buttonCode.type='ING';
                         let time = 60;
                         //定时器倒计时
                         this.verifyTimer = setInterval(()=>{
                             time--;
                             this.buttonCode.text=`重新获取(${time}s)`;
                             if(time==0){

                                 this.buttonCode={
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
            //输入框失去焦点(单个校验)
            bindIptBlur(name){
                switch(name){
                    case 'newPassword':{
                        return  VERIFICAT('password',this.form[name]);
                    }
                        break;
                    case 'comfirmPassword':{
                        return  VERIFICAT('confirmpsw',this.form[name]);
                    }
                        break;
                    case 'code':{
                        return  VERIFICAT('verifycode',this.form[name]);
                    }
                        break;
                    default :{
                        return  VERIFICAT(name,this.form[name]);
                    }
                }
            },
            //确认提交修改密码按钮
            comfirmSubBtn(){
               //全部校验
               let must = ['oldPassword','newPassword','comfirmPassword','code'];
               let flag = true
               for(var i = 0; i<must.length; i++){
                   //对每一个表单进行校验
                  if(!this.bindIptBlur(must[i])) flag = false;
                }

                if(!flag) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;

                this.form.strength = this.bindIptKeydown();

               //发送修改密码请求
               updatePassword(this.form).then(res=>{
                   this.AjaxIng = false;
                   res.code == 0 ?
                    (
                        this.$Message.success(`修改成功`),
                        this.reset(),
                        setTimeout(()=>{
                            location.reload();
                        },2000)
                    ):
                    (this.$Message.error(res.msg));
               })
            }
            ,
            bindChangeIptType(name){
                this.InputType[name] = this.InputType[name]=='password'? 'text':'password';
            },
            bindIptKeydown(){
                //1. 判断长度
                let p = this.form.newPassword;
                if(p.length>=6){

                    let safety = 0;

                    if(/\d+/.test(p)) safety++;

                    if(/[a-z]+/.test(p)) safety++;

                    if(/[A-Z]+/.test(p)) safety++;

                    if(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/i.test(p)) safety++;

                    safety == 1 && ( this.step.clas = `low`, this.step.text = `低`);
                    safety == 2 && ( this.step.clas = `center`, this.step.text = `中`);
                    safety >= 3 && ( this.step.clas = `height`, this.step.text = `高`);

                    return safety >3 ? 3 : safety;

                }else{
                    this.step.clas = `low`;
                    this.step.text = `低`;

                    return 1;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';

    .el-input{
        width:247px !important;
    }

    .cares-input{
        width: 247px;
    }

    .password-container{
        padding:0px 20px;
        margin-left: 10px;
        min-height: 400px;
        h2.personal-module-title{
            padding:0px 10px;
            height: 80px;
            line-height: 80px;
        }
        form{
            padding:0px 10px;
            //原密码
            .getCode{
                 text-align: center;
                 height: 30px;
                 line-height: 30px;
                 margin-left: 7px;
                 // background:#f3f7f9;
            }
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
            .psw-icon{
                position: absolute;
                right:10px;
                top: 7px;
            }

            .msg-code{
                display: inline-block;
                position: absolute;
                right: 10px;
                top:1px;
                font-size: 12px;
            }
        }
    

    //密码强度
        p{
            padding: 0;
            text-align: left;
            font-size: 12px;
            color: #666;
            line-height: 18px;
            margin-top: 5px;
            span{
                display: inline-block;
                width: 32%;
                height: 4px;
                border-radius: 2px;
                background-color: #eee;
                box-sizing: border-box;
                vertical-align: middle;
            }
        }
        p.low{
           .one{
               background-color: $--color-primary-danger;
           } 
        }
        p.center{
           .one{
               background-color: $--color-primary-ing
           } 
           .two{
               background-color:$--color-primary-ing
           } 
        }
        p.height{
           span{
               background-color: $--color-primary-success;
           }
        }
        .progress-psw-bar{
            width: 320px;
        }

    }
</style>
