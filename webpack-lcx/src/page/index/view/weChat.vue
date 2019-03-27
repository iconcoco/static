<template>
    <transition name="fade">
        <el-form  class="login-form">
            <h2>绑定账号</h2>

            <el-form-item name="userName">
               <input class="cares-input" name="userName" maxlength="25" @blur="bindFormBlur('userName')" v-model="form.userName" placeholder="手机号/邮箱" />
            </el-form-item>

             <el-form-item name="passWord">
                <input class="cares-input" v-model="form.passWord" @keyup.enter="bindLoginConfirm"  @blur="bindFormBlur('passWord')" :type="password" name="passWord" placeholder="密码" />
                <i :class="`${password=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangePswType"></i>
            </el-form-item>

            <el-form-item v-if="isError"  class="form-item verifyCode" name="imgVerifyCode">
                <input class="cares-input"  @blur="bindFormBlur('imgVerifyCode')" v-model="form.verifyCode" name="imgVerifyCode"  placeholder="请输入图片验证码" type="text">
                <img @click="bindChangeImgAddr" :src="img" alt="验证码" class="fr" />
            </el-form-item>

            <div  @click="bindLoginConfirm" class="cares-button-primary">绑定账号</div>

            <p>还没有账号？ <router-link class="cares-color" :to="`/regist?wechat=1&${registParams}`">立即注册</router-link> </p>

        </el-form>
    </transition>
</template>

<script>

    import VERICATION from './../../../js/verification.js';

    import { 
        login,
        storeInfo
     } from '../../../js/api.js';
    import DOMAIN from '../../../js/domain.js';


    export default{
        data(){
            return {
                form:{
                    userName:'',
                    passWord:'',
                    verifyCode:''
                },
                img:`${DOMAIN.url}/verifyCode/load?bizType=1`,
                isError:true,
                registParams:'',
                AjaxIng:false,

                password:'password',
            }
        },
        created() {
            let p = this.$route.query;
            if(Object.keys(p).length){
                let str = ``;
                for (const key in p) {
                    let k = key;
                    if(key=='shareCode'){
                        k = 'inviteCode';
                    };

                  key && (str += `${k}=${p[key]}&`);
                };
                this.registParams = str;
            }
        },
        mounted(){
            let dom = document.getElementById('toBackLogin');
            dom.style.display = 'none';
        },
        destroyed(){
            let dom = document.getElementById('toBackLogin');
            dom.style.display = 'block';
        },
        methods:{
            bindLoginConfirm(){
                //验证用户名
              if( !VERICATION('userName',this.form.userName)) return;
                //验证密码
              if( !VERICATION('passWord',this.form.passWord)) return;
                //验证图片验证码
              if( this.isError){ //如果错误三次
                  if( !VERICATION('imgVerifyCode',this.form.verifyCode)) return
              }
                
                if(this.AjaxIng) return;
                this.AjaxIng = true;

                //登录验证
               login({
                   loginAccount:this.form.userName,
                   password:this.form.passWord,
                   verifyCode:this.form.verifyCode
               }).then(res=>{
                  this.AjaxIng = false;
                   if(res.code==0){
                    //    http://10.10.100.15:18099/wx/getWxuserInfo?id=
                        location.href = '/H5/view/Advertising.html?share='+new Date().getTime();
                    //    switch(res.data.status){wx/shardUrl?wxLogin=Success http://wxtest.carespay.com/wechat/
                    //        case 0:
                    //         { //账号未激活  跳转到激活邮箱页面
                    //             location.hash = `/regist/Consummate/${res.data.phoneNo}`;
                    //         }
                    //         break;
                    //        case 1:
                    //         { //账号已经激活
                    //             // location.href = DOMAIN.carespay;
                    //             storeInfo().then(resp=>{
                    //                 // if(resp.code==0){
                    //                  if(!resp.data){
                    //                      location.hash=`/regist/AddStore/${res.data.customerNo}`;
                    //                  }else{
                    //                      location.href = DOMAIN.carespay;
                    //                  }
                    //                 // }else{
                    //                 //     this.$Message.error(resp.msg);
                    //                 // }
                    //             });
                    //         }
                    //         break;
                    //    }

                   }else if(res.code == 3){
                       this.$Message.error(res.msg);
                       this.isError = true;
                   }else{
                        this.$Message.error(res.msg);
                   }

               });

            },
            //失去焦点的时候验证
            bindFormBlur(name){
                if(name=='imgVerifyCode'){
                    VERICATION(name,this.form.verifyCode);
                }else{
                    VERICATION(name,this.form[name]);
                }
            },
            //改变图片验证码
            bindChangeImgAddr(e){
                 e.target.src = `${ this.img }&time=${new Date().getTime()}`;
            },

             bindChangePswType(){ this.password = this.password=='password'? 'text':'password' },
        }
    }
</script>

<style lang="scss" scoped>

    @function perce($a, $b) {
        @return ($a/$b)*100%;
    }
    
        .login-form{
            background-color: #fff;
            max-width: 760px;
            height: 500px;;
            top: 0;
            right: 0;
            padding: 0 20px;
            margin: 30px auto;
            h2{
                font-size: 26px;
                line-height: 33px;
                margin-bottom: 52px;
                padding-top: 106px;
                color: #666;
            }
            p{
                font-size: 12px;
                text-align: center;
                color: #333;
                margin-top: 10px;
            }

            .cares-button-primary{
                width: 100%;
                margin-top: 40px;
                margin-bottom: 20px;
            }
        }
        //验证码
        .verifyCode{
            padding-bottom: 0;
            .cares-input{
                width:60%;
            }
            img{
                float: right;
                width:35%;
                height:32px;
                margin-top:0px;
            }
        }

    .el-input,
    .el-button{
        width: 100%;
    }

    .el-form-item{
        .cares-color{
            position: absolute;
            right:10px;
            top:0;
            font-size:12px;
        }
        i{
            display:inline-block;
            position: absolute;
            height:20px;
            width:20px;
            top: 5px;
            right: 10px;
            text-align:center;
            line-height:38px;
            color:#999;
            z-index: 2;
        }
         .i-c-eye{
            background:url('../../../images/login/u105.svg') no-repeat center center;
            background-size: 100% 100%;
            cursor: pointer;
        }
        .i-o-eye{
            background:url('../../../images/login/u106.svg') no-repeat center center;
            background-size: 100% 100%;
            cursor: pointer;
        }
    }
</style>

