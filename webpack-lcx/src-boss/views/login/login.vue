<template>
        <div class="banner fadeIn">
            <el-form :model="form">
                <!-- <h2 class="wellcome">欢迎登录CaresPAY运营系统</h2> -->
                <div class="logo"></div>
                <!-- 用户名 -->
                <el-form-item name="username">
                    <el-input name="username" @blur="bindIptblur('username')" v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item name="password">
                    <input type="password" @keydown.enter="submitForm" class="cares-input" name="password" @blur="bindIptblur('password')" v-model="form.password" placeholder="请输入密码"/>
                    <!-- <el-input name="password" type="password" @blur="bindIptblur('password')" v-model="form.password" placeholder="请输入密码"></el-input> -->
                </el-form-item>

                <!-- <div class="other clearfix">
                    <el-checkbox label="">自动登录</el-checkbox>
                </div> -->

                <el-button @click="submitForm" type="primary">登陆</el-button>

                <p class="regist">
                    <router-link  to="/index/regist">注册新账号</router-link>
                    <router-link class="fr no" to="/index/forgot">忘记密码?</router-link>
                </p>

            </el-form>
            <!-- <img style="width:100px;" preview="1" preview-text="描述文字" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539159843982&di=abfffe25824f9b565ea2e00904a7f3d0&imgtype=0&src=http%3A%2F%2Fwww.pptbz.com%2Fpptpic%2FUploadFiles_6909%2F201211%2F2012111719294197.jpg" alt=""> -->
        </div>
</template>

<script>
import VERIFICATION from './../../utils/verfication.js';

import { login } from '../../utils/axios/api.js';
import { cookie } from '../../utils/common.js';


export default {
    data(){
        return{
            form:{
                username:'',
                password:''
            }
        }
    },
    created(){
        // sessionStorage.clear()
        cookie.delete('adminUserInfo');
        this.$store.commit("clearState");
        
    },
    mounted(){

    },
    methods:{
        bindIptblur(name){
            VERIFICATION(name,this.form[name]);
        },
        submitForm(){
            let m = ['username','password'],
                flag = true;
            
            for(let i =0 ;i<m.length;i++){
                if(!VERIFICATION(m[i],this.form[m[i]])) flag=false;
            }
            //验证不通过不做跳转
            if(!flag) return;
            //验证成功跳转后台主页
            //1. 改变仓库中的状态
            login({
                userCode:this.form.username,
                userPwd:this.form.password
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`登陆成功`);
                    //1. 保存数据
                    cookie.set('adminUserInfo',JSON.stringify(res.data),1);
                    // sessionStorage.setItem('adminUserInfo',JSON.stringify(res.data));
                    //2. 跳转后台
                    this.$router.push({name:'index'});
                }else{
                    this.$message.error(res.msg)
                }
            });

        }
    }
    
}
</script>


<style lang="scss" scoped>
    .el-form{
        position:absolute;
        width: 300px;
        top: 50%;
        right: 50%;
        margin: -163px -150px 0 0px;
        background-color: #fff;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 0 5px 5px rgba(0,0,0,.2);
    }

    .wellcome{
        line-height: 30px;
        text-align: center;
        height: 40px;
        color: #333;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 35px;
        font-size: 18px;
        letter-spacing: 2px;
    }

    .logo{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 30px auto;
        border: 1px solid rgba(190, 65, 15, 0.315);
        background: url('../../image/login/icon.jpg') no-repeat center center;
        background-size: 100% 100%;
        overflow: hidden;
        img{
            width: 100%;
        }
    }
  
    .regist{
        // text-align: center;
        margin-top: 20px;
       a{
            color: #409EFF;
       }
    }

    .other{
        margin-bottom: 20px;
    }

    .el-button{
        width: 100%;
    }
</style>



