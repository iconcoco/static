<template>
<transition name="fade">
    <div class="banner">
         <el-form :model="form">
             <div class="regist-logo"></div>
             <!-- 用户名 -->
             <el-form-item name="usermail">
                 <el-input name="usermail" @blur="bindIptblur('usermail')" v-model="form.usermail" placeholder="手机号码或邮箱"></el-input>
             </el-form-item>

             <el-form-item name="verifycode" class="code">
                 <el-input name="verifycode" @blur="bindIptblur('verifycode')" v-model="form.verifycode" placeholder="手机号码或邮箱"></el-input>
                 <el-button class="fr" @click="bindGetVericode" :type="code.type">{{code.txt}}</el-button>
             </el-form-item>

             <el-form-item name="password">
                 <el-input type="password" name="password" @blur="bindIptblur('password')" v-model="form.password" placeholder="新密码"></el-input>
             </el-form-item>

             <el-form-item name="confirmpsw">
                 <el-input type="password" name="confirmpsw" @blur="bindIptblur('confirmpsw')" v-model="form.confirmpsw" placeholder="确认新密码"></el-input>
             </el-form-item>

             <el-button @click="bindResetPsw" type="primary">重置密码</el-button>

            <p>
                <router-link to="/index/login">返回登录</router-link>
            </p>

         </el-form>
    </div>
</transition>
</template>

<script>
    import VERIFICATION from './../../utils/verfication.js';

    import {
        sendRestPwdMsg,
        restPwd
    } from '../../utils/axios/api.js';

    export default{
        data(){
            return{
                form:{
                  usermail:'',  
                  verifycode:"",
                  password:'',  
                  confirmpsw:"",
                },
                code:{
                    type:'primary',
                    txt:'获取验证码'
                }
            }
        },
        methods:{
            //失去焦点的验证
            bindIptblur(name){
               VERIFICATION(name,this.form[name]);
            },
            //重置密码
            bindResetPsw(){
                //1. 校验必填
                let flag = true;
                for (const key in this.form) {
                    if(!VERIFICATION(key,this.form[key])) flag = false;
                };

                if(!flag) return;

                //2. 请求重置密码
                restPwd({
                    msgAddr:this.form.usermail,
                    verifyCode:this.form.verifycode,
                    newPwd:this.form.password
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功`);
                        setTimeout(()=>{
                            this.$router.push({name:"login"});
                        },1000);
                    }else{
                        this.$message.error(res.msg);
                    }
                });

            },
            //获取验证码
            bindGetVericode(){
                if(this.code.type == 'primary'){

                    if(!VERIFICATION('usermail',this.form[`usermail`])) return;

                    this.code.type = 'info';

                    sendRestPwdMsg({
                        msgAddr:this.form.usermail
                    }).then(res=>{
                        
                        if(res.code==0){
                            let i = 60;
                            let time = setInterval(()=>{
                                    i--;
                                    this.code.txt = `${i}s后再获取`;
                                    if(i==0){
                                        this.code.type = 'primary'
                                        this.code.txt = `获取验证码`;
                                        clearInterval(time);
                                    }
                            },1000);

                        }else{
                            this.code.type = 'primary'
                            this.code.txt = `获取验证码`;
                            this.$message.error(res.msg);
                        }
                    });

              
                }
            }
        }            

    }
</script>

<style lang="scss" scoped>
    .el-form{
        position: absolute;
        width: 300px;
        left: 50%;
        top:50%;
        margin-left: -150px;
        margin-top: -260px;
        background-color: #fff;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 0 5px 5px rgba(0,0,0,.2);

        .regist-logo{
            margin: 20px auto;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: url('../../image/login/icon.jpg') no-repeat center center;
            background-size: 100% 100%;
        }

          .el-button{
            width: 100%;
        }

        p{
            text-align: center;
             margin-top: 20px;
             a{
                color: #409EFF;
            }
        }

        .code{
            .el-input{
                width: 183px;
            }
            .el-button{
                width: 90px;
                padding: 0;
            }
        }
    }

      
</style>

