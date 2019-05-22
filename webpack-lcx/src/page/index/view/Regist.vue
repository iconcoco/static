<template>
    <div class="fadeIn">
        <el-form :model="form"  v-if="!showConsummate"  >
            <h2>新用户注册</h2>

            <el-form-item class="is-required" name="phoneNo">
                <el-input type="tel" @blur="bindIptBlur('phoneNo')" maxlength="11" v-model="form.phoneNo" name="phoneNo" placeholder="请输入手机号"></el-input>
                <span>中国大陆</span>
            </el-form-item>

            <el-form-item class="is-required code" name="verifyCode">
                <el-input maxlength="6"  @blur="bindIptBlur('verifyCode')" v-model="form.verifyCode" name="verifyCode" placeholder="请输入验证码"></el-input>
                <a href="javascript:;" @click="bindGetVerifycode" class="cares-color">{{verfiyButton.text}}</a>
            </el-form-item>

            <el-form-item class="is-required" name="password">
                <input @keyup="bindIptKeydown" class="cares-input" maxlength="20" :type="InputType.password"  @blur="bindIptBlur('password')" v-model="form.password" name="password" placeholder="请输入密码"/>
                <i :class="`${InputType.password=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangeIptType('password')"></i>
            </el-form-item>

            <template v-if="form.password.length">
                <p>密码规则：包含数字、大小写字母、特殊字符任意两种或以上6-20字符</p>
                <p class="progress-psw-bar" :class="step.clas">
                    <span class="one"></span>
                    <span class="two"></span>
                    <span class="three"></span>
                    <b>{{step.text}}</b>
                </p>
            </template>

            <el-form-item class="is-required" name="confirmPsw">
                <el-input maxlength="16" name="confirmPsw"  :type="InputType.confirmPsw"  @blur="bindIptBlur('confirmPsw')" v-model="form.confirmPsw"  placeholder="再次输入密码"></el-input>
                <i :class="`${InputType.confirmPsw=='password'?'i-c-eye':'i-o-eye'}`" @click="bindChangeIptType('confirmPsw')"></i>
            </el-form-item>

            <el-form-item  name="referrer">
                <i class="i-user"></i>
                <el-input type="number" maxlength="16" name="referrer" v-model="form.referrer"  placeholder="您的 CaresPAY客户经理的手机号码"></el-input>
            </el-form-item>

            <div class="form-item">
                <el-checkbox v-model="form.isRread">我已阅读</el-checkbox> 
                <a class="cares-color txt" target="_blank" :href="`${DOMAIN.login}/#/serviceAgreement`">《CaresPAY服务协议》</a>
                 <i class="txt">和</i>
                <a class="cares-color txt" target="_blank" :href="`${DOMAIN.login}/#/privacyAgreement`">《隐私条款》</a>
            </div>

            <div @click="bindCreatButton" class="cares-button-primary">立即创建</div>

            <p class="bottom" v-if="!isWechat">已拥有账号？ <router-link class="cares-color" to="/login">立即登录</router-link> </p>
            <p class="bottom" v-else>已拥有账号？ <router-link class="cares-color" :to="`/weChatLogin?${registParams}`">立即绑定</router-link> </p>
        </el-form>

        <!-- 继续完善标识 -->
        <div v-if="showConsummate" class="consummate">
            <h2>创建成功</h2>
            <!-- <span class="el-icon-circle-check regist-success "></span> -->
            <span class="success-icon success-fadeIn regist-success"></span>
            <p>为了确保您的账户安全，请绑定邮箱</p>
             <div class="btn-box">
                 <span @click="bindToConsummate"  class="cares-button-primary">继续完善</span>
                 <span @click="bindToAdmin"  class="cares-button-primary pain">稍后完成</span>
                 <!-- <el-button @click="bindToAdmin" class="fr" type="warning" plain>稍后完成</el-button> -->
             </div>
        </div>

    </div>
</template>

<script>

import VERICATION from './../../../js/verification.js';
import { register,registerVerifyCode,saveUrlDataLog } from './../../../js/api.js';
import DOMAIN from '../../../js/domain.js';

    export default {
        data(){
            return{
                showConsummate:false,
                flag:true,          //防止重复点击
                form:{
                    isRread:'',
                    phoneNo:'',     //手机号码
                    verifyCode:'',  //验证码
                    password:'',    //密码
                    confirmPsw:'',  //确认密码
                    referrer:'',    //推荐人
                    inviteCode:'',
                    openId:'',
                    source:'',

                    strength:'',    //密码强度
                },
                verfiyButton:{
                    type:`warning`,
                    text:`获取验证码`,
                },
                timer:null,
                step:{
                    clas:``,
                    text:`低`
                },
                InputType:{
                    password:'password',
                    confirmPsw:'password',
                },
                registParams:"",
                isWechat:null,
                AjaxIng:false,

                DOMAIN:DOMAIN
            }
        },
        created(){
            let p = this.$route.query;
             if(Object.keys(p).length){
                let str = ``;
                for (const key in p) {
                 key && key != 'wechat' && (str += `${key}=${p[key]}&`);
                };
                this.registParams = str;
            }

            this.form.inviteCode = p.inviteCode || '';
            this.form.openId = p.openId || '';
            this.form.source = p.source || '';

            this.isWechat = p.wechat || false;

        },
        mounted(){
          this.urlDataLog()
        },
        methods:{
            // 埋点:注册页的访问量
            urlDataLog(){
              if(!this.isWechat){
                 var type = '6'
              }else{
                var type = '3'
              }
              saveUrlDataLog({
                /** 1.活动H5页点击量 
                 * 2."点击分享"按钮的点击量
                 * 3.通过H5进入注册页面的点击量
                 * 4.注册成功回到H5活动页的点击量
                 * 5.通过H5预注册用户数量
                 * 6.注册页的访问量
                 * 7.绑定邮箱页面访问量
                 * 8.绑定店铺页访问量 
                 * 9.实名认证页访问量 */
                type:type
              })
            },
            bindIptKeydown(){
                //1. 判断长度
                let p = this.form.password;
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
            //注册获取验证码
            bindGetVerifycode(){
                if(this.verfiyButton.type==`warning`) {
              
                    // if(!this.form.phoneNo) return this.$Message.error("请输入手机号码");
                    if(!VERICATION('phoneNo',this.form['phoneNo'])) return ;

                    //获取验证码
                    registerVerifyCode({
                        phoneNo:this.form.phoneNo
                    }).then(res=>{
                       if(res.code == 0){
                             this.verfiyButton.type='info';
                            let time = 60;
                            //定时器倒计时
                            this.timer = setInterval(()=>{
                                time--;
                                this.verfiyButton.text=`${time}s后再获取`;
                                if(time==0){
                                    this.verfiyButton={
                                        type:'warning',
                                        text:'获取验证码',
                                    };
                                    clearInterval(this.timer);
                                };
                            },1000);
                       }else{
                            this.$Message.error(res.msg);
                        }
                    });
                }
            },
            //立即创建按钮
            bindCreatButton(){

                    
               
                let must = ['phoneNo','verifyCode','password','confirmPsw'];//必填信息字段
                    
                    // /\d+/.test(p) && /[a-z]+/i.test(p)
                    let flag = true;

                    for(let i =0; i<must.length;i++){
                         if(!VERICATION(must[i],this.form[must[i]])) flag = false;
                    }

                    if(!flag) return;

                    // if(!(/\d+/.test(this.form.password) && /[a-z]+/i.test(this.form.password))) return this.$Message.error(`密码应该包含字母数字特殊字符`);

                    if(!(this.form.confirmPsw == this.form.password)) return this.$Message.error(`两次输入的密码不相等`);

                    if(this.form.referrer){ //如果填了推荐经理的手机
                        if(!VERICATION('referrer',this.form.referrer)) return;
                    }

                    if(!this.form.isRread) return this.$Message.error(`请阅读《CaresPAY服务协议》`);

                    if(this.AjaxIng) return;
                    this.AjaxIng = true;


                    //2019-3-4密码强度

                    this.form.strength = this.bindIptKeydown();

                    //发送注册请求
                    let forData = Object.assign({},this.form);
                    forData.salePhone = forData.referrer;
                    register(forData).then(res=>{
                        this.AjaxIng = false;
                        if(res.code==0){//注册成功
                            this.showConsummate = true; //完善页面
                            
                        }else if(res.code==5){
                            location.href = '/H5/view/Advertising.html?share='+new Date().getTime();
                        }else{
                           this.$Message.error(res.msg); 
                        }
                    });

            },
            //继续完善按钮
            bindToConsummate(){
                location.hash = `/regist/Consummate/${this.form.phoneNo}`;
            },
            //2018-12-12 流程优化
            bindToAdmin(){
                location.href = DOMAIN.carespay;
            },
            //input失去焦点验证
            bindIptBlur(name){
                    VERICATION(name,this.form[name]);
            },

            bindChangeIptType(name){
                this.InputType[name] = this.InputType[name]=='password'? 'text':'password';
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './../../../css/common/theme.scss';

    .consummate{
        padding-bottom: 40px;
        text-align: center;
        p{
            padding: 0;
            line-height: 35px;
            font-size: 16px;
            color: #aaa;
        }
        // .el-button{
        //     margin-top: 100px;
        // }

        .btn-box{
             margin-top: 40px;
             span{
                 width: 35%;
                 margin-right: 5px;
                 margin-left: 5px;
             }
        }
    }

    .cares-button-primary{
        width: 100%;
    }


    .el-form{
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
            margin-bottom: 10px;
        }
        .bottom{
                padding: 20px 0;
                font-size: 12px;
                color: #666;
                text-align: center;
        }
    }

    .txt{
        font-size: 12px;
    }
</style>

