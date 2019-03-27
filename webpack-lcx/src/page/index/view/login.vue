<template>
    <div class="login-content fadeIn banner">
        <div class="bg cares-mini-no"></div>
        
            <div class="login-form">
                <ul class="clearfix">
                    <li @click="bindChangeLoginType(1)" :class="{active:loginType==1}">手机或邮箱登录</li>
                    <li @click="bindChangeLoginType(2)" :class="{active:loginType==2}">短信验证码登录</li>
                </ul>
                <!-- <h2>登 录</h2> -->
                <el-form :model="form" v-show="loginType==1" >
                    <div  v-if="loginType==1" class="fadeIn">

                        <el-form-item name="userName">
                                <!-- <i class="i-user"></i> -->
                                <input class="cares-input" @input="bindInputChange(`userName`)" name="userName" maxlength="25" @blur="bindFormBlur('userName')" v-model="form.userName" placeholder="手机号/邮箱" />
                        </el-form-item>

                        <el-form-item name="passWord">
                                <i :class="`${password=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangePswType"></i>
                                <input class="cares-input" @input="bindInputChange(`passWord`)" v-model="form.passWord" @keyup.enter="bindLoginConfirm"  @blur="bindFormBlur('passWord')" :type="password" name="passWord" placeholder="密码" />
                                <router-link style="top:100%;" class="cares-color" to="/regist/forgot">忘记密码？</router-link>
                        </el-form-item>

                        <el-form-item v-if="PSWLOGINERROR.error" name="imgverifyCode" class="verifyCode">
                                <input class="cares-input"   @blur="bindFormBlur('imgverifyCode')" v-model="form.verifyCode" name="imgverifyCode"  placeholder="请输入图片验证码" type="text">
                                <img @click="bindChangeImgAddr" :src="IMGARR.PSW" alt="验证码" class="fr" />
                        </el-form-item>

                        <p v-if="PSWLOGINERROR.error && PSWLOGINERROR.data !=0" class="error-txt">当日登录密码累计输错6次，账户将会被锁定，次日凌晨自动解锁，剩余{{PSWLOGINERROR.data}}次。</p>
                        <p v-if="!PSWLOGINERROR.error && PSWLOGINERROR.data ==0" class="error-txt">当日登录失败次数超限，次日凌晨自动解锁。如需解锁请联系客服。</p>

                        <span @click="bindLoginConfirm"  class="cares-button-primary">确认登录</span>
                        
                        <p>还没有账号？ <router-link class="cares-color" to="/regist">立即注册</router-link> </p>
                     </div>
                </el-form>

                <el-form  :model="phoneForm" v-show="loginType==2" >
                    <div  v-if="loginType==2" class="fadeIn">
                        <el-form-item name="phoneNo">
                            <input type="number" class="cares-input" v-model="phoneForm.phoneNo" name="phoneNo" @blur="bindFormBlur('phoneNo',true)" maxlength="11" placeholder="手机号">
                            <span>中国大陆</span>
                        </el-form-item>

                        <el-form-item name="verifyCode">
                            <input type="text" class="cares-input" v-model="phoneForm.verifyCode" maxlength="6" name="verifyCode" @blur="bindFormBlur('verifyCode',true)" placeholder="请输入6位数短信验证码">
                            <a href="javascript:;" class="cares-color" @click="gotPhoneCode">{{phoneCode.text}}</a>
                        </el-form-item>

                        <el-form-item v-if="PSWLOGINERROR.error" name="imgverifyCode" class="verifyCode">
                            <input class="cares-input"   @blur="bindFormBlur('imgverifyCode',true)" v-model="phoneForm.imgverifyCode" name="imgverifyCode"  placeholder="请输入图片验证码" type="text">
                            <img @click="bindChangeImgAddr" :src="IMGARR.MSG" alt="验证码" class="fr" />
                        </el-form-item>

                        <p v-if="PSWLOGINERROR.error && PSWLOGINERROR.data != 0" class="error-txt">当日短信验证码累计输错6次，账户将会被锁定，次日凌晨自动解锁，剩余{{PSWLOGINERROR.data}}次。</p>
                        <p v-if="!PSWLOGINERROR.error && PSWLOGINERROR.data ==0 " class="error-txt">当日登录失败次数超限，次日凌晨自动解锁。如需解锁请联系客服。</p>

                        <span @click="bindLoginByPhone"  class="cares-button-primary">确认登录</span>

                        <p>还没有账号？ <router-link class="cares-color" to="/regist">立即注册</router-link> </p>
                    </div>
                </el-form>

            </div>
    </div>
</template>

<script>

    import VERICATION from './../../../js/verification.js';
    import { removeClass } from './../../../js/common.js';

    import { 
        login,
        loginByPhone,
        sendLoginCode,
     } from '../../../js/api.js';
    import DOMAIN from '../../../js/domain.js';

    export default {
        data(){
            return {
                form:{
                    userName:'',
                    passWord:'',
                    verifyCode:''
                },
                phoneForm:{
                    phoneNo:'',
                    verifyCode:'',
                    imgverifyCode:'',
                },
                IMGARR:{
                    PSW: `${DOMAIN.url}/verifyCode/load?bizType=1`,
                    MSG: `${DOMAIN.url}/verifyCode/load?bizType=1&time=${ 20190228 }`,
                },
                PSWLOGINERROR:{
                    error:false,
                    data:3   //错误次数机会
                },

                AjaxIng:false,
                loginType:1,
                password:'password',
                phoneCode:{
                    text:'获取验证码',
                    flag:true
                },

                

            }
        },
        watch: {
           loginType(){
               for (const key in this.form) {
                   this.form[key] = "";
               };

               let nodes = document.querySelectorAll('.is-error');
                for(let i=0;i<nodes.length;i++){
                    removeClass(nodes[i],'is-error');
                    nodes[i].querySelector('.el-form-item__error').remove();
                }
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
                //如果错误机会已经没有不让请求
                if(this.PSWLOGINERROR.data==0) return;

                let flag = true;

                for (const key in this.form) {
                    if(key == 'verifyCode'){
                        if(this.PSWLOGINERROR.error && !this.bindFormBlur('imgverifyCode') ) flag = false;
                    }else{
                        if( !this.bindFormBlur(key)) flag = false;
                    };
                 }

                if(!flag) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;
                

                //登录验证
               login({
                   loginAccount:this.form.userName,
                   password:this.form.passWord,
                   verifyCode:this.form.verifyCode
               }).then(res=>{
                   this.AjaxIng = false;

                    let errorTime = res.data || 0,
                        totalTime = 6;
                    this.PSWLOGINERROR.data =(totalTime - errorTime) <0 ? 0 : (totalTime - errorTime); //错误次数
                    this.PSWLOGINERROR.data == 0 && (this.PSWLOGINERROR.error = false );

                    if(res.code==0){
                        location.href = DOMAIN.carespay;
                    }else if(res.code == 3){

                        this.PSWLOGINERROR.error &&  this.$Message.error(res.msg);

                        //如果错误次数已经没有 验证码就不出现了
                        this.PSWLOGINERROR.data != 0 && (this.PSWLOGINERROR.error = true ); 

                    }else{
                         this.$Message.error(res.msg);
                    }

               });

            },
            //通过手机短信验证码登录
            bindLoginByPhone(){
                
                //1. 如果错误机会已经没有不让请求
                if(this.PSWLOGINERROR.data==0) return;

                // 2. 验证必填
                let flag = true;
                let must = ['phoneNo','verifyCode'];
                if(this.PSWLOGINERROR.error) must.push('imgverifyCode');

                must.forEach(key => {
                     if( !this.bindFormBlur(key,true)) flag = false;
                });
                
                if(!flag) return;

                //3. 请求登录
                if(this.AjaxIng) return;
                this.AjaxIng = true;
                
                loginByPhone({
                    phone:this.phoneForm.phoneNo,
                    code:this.phoneForm.verifyCode,
                    verifyCode:this.phoneForm.imgverifyCode,
                }).then(res=>{
                    this.AjaxIng = false;
                    
                    let errorTime = res.data || 0,
                        totalTime = 6;
                    this.PSWLOGINERROR.data =(totalTime - errorTime) <0 ? 0 : (totalTime - errorTime); //错误次数
                    this.PSWLOGINERROR.data == 0 && (this.PSWLOGINERROR.error = false );

                    if(res.code==0){
                        location.href = DOMAIN.carespay;
                    }else if(res.code == 3){

                        this.PSWLOGINERROR.error &&  this.$Message.error(res.msg);

                        //如果错误次数已经没有 验证码就不出现了
                        this.PSWLOGINERROR.data != 0 && (this.PSWLOGINERROR.error = true ); 

                    }else{
                         this.$Message.error(res.msg);
                    }
                })
                    
            },
            //失去焦点的时候验证
            bindFormBlur(name,f){
                if(!f){
                    let vName = name=='imgverifyCode' ? "verifyCode": name;
                    return VERICATION(name,this.form[vName]);
                }else{
                    return VERICATION(name,this.phoneForm[name]);
                }
            },
            //改变图片验证码
            bindChangeImgAddr(e){
                 e.target.src = `${ this.IMGARR.PSW }&time=${new Date().getTime()}`;
            },

            bindInputChange(name){
                this.form[name]=this.form[name].replace(/\s+/g,'')
            },

            bindChangeLoginType(type){ this.loginType = type },
            bindChangePswType(){ this.password = this.password=='password'? 'text':'password' },
            gotPhoneCode(){
                //1. 验证手机是否已经填写正确
                if(!this.bindFormBlur('phoneNo',true)) return
                //2. 重复获取
                if(!this.phoneCode.flag) return;
                this.phoneCode.flag = false;
                //3. 开始获取验证码
                sendLoginCode({phone:this.phoneForm.phoneNo}).then(res=>{
                    if(res.code==0){
                        let t=60;
                        let timer =setInterval(()=>{
                            t--;
                            this.phoneCode.text=`重新获取(${t}s)`;
                            if(t<=0){
                                this.phoneCode.flag = true;
                                this.phoneCode.text=`获取验证码`;
                                clearInterval(timer);
                            };
                        },1000);

                    }else{
                        this.phoneCode.flag = true;
                        this.$Message.error(res.msg);
                    }
                });

                

                
            }
        }
    }
</script>


<style lang="scss" scoped>
    @import './../../../css/common/theme.scss';

    @function perce($a, $b) {
        @return ($a/$b)*100%;
    }
    .login-content{
        margin: 50px auto;
        // margin-top: 0px;
        height: 550px;
        position: relative;
        max-width: 1100px;
         border-radius:8px;
         overflow: hidden;
         box-sizing:content-box;
        .bg{
            background:url('../../../images/login/loginbg.png') no-repeat left center;
            // background:url('../../../images/ac/f3000.png') no-repeat left center;
            background-size:1100px 550px;
            // background-size:100% 100%;
            height: 550px;
            // margin-right: 320px;
        }

          ul{
                padding: 20px 0;
                margin-bottom: 20px;
                li{
                    float: left;
                    width: 50%;
                    color: #ddd;
                    height: 40px;
                    line-height: 40px;
                    border-bottom: 1px solid #ddd;
                    cursor: pointer;
                    text-align: center;
                    font-size: 14px;
                    &:hover{
                        color: #333;
                    }
                    &.active{
                        border-width: 2px;
                        color: $--color-primary-one;
                        border-color: $--color-primary-one; 
                    }
                }
            }
        .login-form{
            background-color: #fff;
            // width: perce(394, 1190);
            width: 340px;
            min-height: 374px;
            top: 50%;
            right: 90px;
            margin-top: -187px;
            position: absolute;
            padding: 0 40px;
            border-radius: 4px;

            padding-bottom: 20px;

            h2{
                color: #666;
                padding: 20px 0;
                margin-bottom: 20px;
                font-size: 26px;
            }
            .cares-button-primary{
                width: 100%;
                box-sizing: border-box;
                margin-top: 50px;
            }
            p{
                font-size: 12px;
                text-align: center;
                color: #333;
                margin-top: 10px;
            }

            .error-txt{
                color: $--color-primary-danger;
                font-size: 12px;
                background-color: #ffecec;
                text-align: left;
                padding: 5px;
            }
        }
        //验证码
        .verifyCode{
            .cares-input{
                width:60%;
            }
            img{
                float: right;
                width:35%;
                height:30px;
                margin-top:0px;
            }
        }
    }

    .el-input,
    .el-button{
        width: 100%;
    }

    .el-button{
        margin-top: 50px;
        border-radius: 8px;
    }

    .el-form-item{
        a,span{
            position: absolute;
            right:10px;
            top:0px;
            font-size:12px;
            color: #aaa;
        }
        i{
            display:inline-block;
            position: absolute;
            height:30px;
            width:30px;
            text-align:center;
            line-height:30px;
            color:#999;
            z-index: 2;
            right: 10px;
        }
        .i-user{
            background:url('../../../images/login/login_user.png') no-repeat center center;
        }
        .i-c-eye{
            height:20px;
            width:20px;
            top: 5px;
            background:url('../../../images/login/u105.svg') no-repeat center center;
            background-size: 100% 100%;
            cursor: pointer;
        }
        .i-o-eye{
            height:20px;
            width:20px;
            top: 5px;
            background:url('../../../images/login/u106.svg') no-repeat center center;
            background-size: 100% 100%;
            cursor: pointer;
        }
        .i-psw{
            background:url('../../../images/login/login_psw.png') no-repeat center center;
        }
    }
   

    @media screen and (max-width:768px) {
       .login-content{
            // max-width: 394px;
            width: 320px;
            height: 400px;
            margin:20px auto;
           .login-form{
                right: 0;
                border-radius:8px;
                width: 100%;
                padding-left: 10px;
                padding-right: 10px;
                // overflow: hidden;
           }
       }
    }

</style>

<style lang="scss">

   .login-form{
        .el-input{
        .el-input__inner{
            padding-left: 35px;
        }
    }
   }

</style>

