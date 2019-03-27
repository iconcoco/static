<template>
<transition name="fade">
    <div>
        <el-form :model="form" v-if='!isShow' class="forgot-container">
            <h2>找回密码</h2>

            <el-form-item class="is-required" name="phoneNo">
                <el-input type="tel" maxlength="11" @blur="bindIptBlur('phoneNo')" v-model="form.phoneNo" name="phoneNo" placeholder="注册手机号"></el-input>
                <span>中国大陆</span>
            </el-form-item>

            <el-form-item class="is-required imgCode" name="imgVerifyCode">
                 <el-input type="text" maxlength="6"  @blur="bindIptBlur('imgVerifyCode')" v-model="form.imgVerifyCode" name="imgVerifyCode"  placeholder="图片验证码"></el-input>
                 <img @click="bindChangeImgAddr" :src="img" alt="验证码" class="fr" />
            </el-form-item>

            <el-form-item class="is-required code line" name="verifyCode">
                    <el-input maxlength="6" @blur="bindIptBlur('verifyCode')"  v-model="form.verifyCode" name="verifyCode" placeholder="请输入验证码"></el-input>
                    <a class="cares-color" href="javascript:;" @click="bindGetVerCode">{{verfiyButton.text}}</a>
            </el-form-item>

            <div @click="bindForgotNext" class="cares-button-primary">下一步</div>
        </el-form>

        <div v-if='isShow' class="forgot-email">
            <h2>验证邮件发送成功</h2>
            <span class="success-email-icon success-fadeIn icon"></span>
            <p>密码重置邮件已发送至您的邮箱：</p>
            <p><span class="cares-color">{{email}}</span></p>
            <p>请进入邮箱查看邮件，击邮件中的链接重置您的密码。</p>
            <ul>
                <li>没收到邮件？</li>
                <li>1. 检查邮箱中的垃圾邮件</li>
                <li>2. 若仍未收到，请尝试<span @click="bindResendEmial" class="cares-color">重新发送</span></li>
            </ul>
        </div>

        <AdminModel
            v-model="isNoEmail"
            class="forgot-psw-model"
        >
            <p class="center"><span class="error-icon"></span></p>
            <p class="no center">尚未绑定安全邮箱</p>
            <p>您的账户尚未绑定或激活安全邮箱，无法进行密码重置！</p>
            <p>请致电 CaresPAY 客服团队 <span class="cares-color">400-887-0201</span></p>
            <p>或 <a class="cares-color" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1361257395&site=qq&menu=yes">点此联系在线客服</a> <span class="ING">（在线时间：周一至周五09:30~18:30）</span></p>
            <div class="center">
                <a href="javascript:;" @click="hideModel(false)" class="cares-button-primary pain">知道了</a>
            </div>
        </AdminModel>

    </div>
</transition>
</template>

<script>

    import { 
        findPswVerifyCode,
        findPswEmail,
        } from '../../../js/api.js';
    import VERICATION from './../../../js/verification.js';

    import DOMAIN from './../../../js/domain.js';

    import AdminModel from './../../../components/adminModel.vue';


    export default {
        data(){
            return{
                flag:true,
                isShow:false,
                img:`${DOMAIN.url}/verifyCode/load?bizType=2`,
                email:'',
                form:{
                    phoneNo:'',
                    verifyCode:'',
                    imgVerifyCode:''        //图片验证码
                },
                verfiyButton:{
                    type:`warning`,
                    text:`获取验证码`,
                },
                timer:null,
                AjaxIng:false,
                isNoEmail:false
            }
        },
        created() {

        },
        methods:{
            //清空所有的表格
            reset(){
                this.form = {
                    phoneNo:'',
                    verifyCode:'',
                    imgVerifyCode:'' 
                };
                this.verfiyButton = {
                    type:`warning`,
                    text:`获取验证码`,
                };
            },
            //失去焦点验证
            bindIptBlur(name){
                VERICATION(name,this.form[name]);
            },
            //图形验证码数字的变换
            bindChangeImgAddr(e){
                e.target.src = `${ this.img }&time=${new Date().getTime()}`;
            },
            //找回密码 下一步
            bindForgotNext(){
                
                let must = ["phoneNo","imgVerifyCode","verifyCode"];
                let flag = true;
                
                 for(let i =0; i<must.length;i++){
                    if(!VERICATION(must[i],this.form[must[i]])) flag = false;
                }

                if(!flag) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;
                //发送到激活邮箱
                 findPswEmail(this.form).then(res=>{
                     this.AjaxIng = false;
                    if(res.code == 0){
                        this.isShow = true;
                        // this.reset();
                        //回显邮箱地址
                        this.email = res.data;
                    }else if(res.code == 6){
                        //没绑定邮箱的弹窗
                        this.hideModel(true);
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
                
            },
            //获取找回密码的验证码
            bindGetVerCode(){
                if(this.verfiyButton.type==`info`) return;
                if(!VERICATION('phoneNo',this.form['phoneNo'])) return ;
                if(!VERICATION('imgVerifyCode',this.form['imgVerifyCode'])) return ;
                //发送验证码
                findPswVerifyCode({
                    phoneNo:  this.form.phoneNo,
                    verifyCode: this.form.imgVerifyCode
                }).then(res=>{
                    if(res.code==0){
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
                })

            },
            //重新发送邮箱
            bindResendEmial(){
                findPswEmail(this.form).then(res=>{
                    if(res.code == 0){
                        this.$Message.success(res.msg);
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            hideModel(bol){
                this.isNoEmail = bol
            }
        },
        components:{
            AdminModel
        }
    }   
</script>

<style lang="scss" scoped>

    .el-form{
        .line{
            margin-bottom: 60px
        }
        .imgCode{
            .el-input{
                width: 60%;
            }
            img{
                width: 35%;
                height: 30px;
                cursor: pointer;
            }
        }
    }
    .forgot-container{
        padding-bottom: 60px;
        .cares-button-primary{
            width: 100%;
        }
    }

    .forgot-email{
        text-align: center;
        padding-bottom: 30px;
         p{
            padding: 0;
            font-size: 14px;
            line-height: 20px;
            text-align: left;
            margin-bottom: 3px;
        }
         h3{
            line-height: 80px;
            height: 80px;
            color: #666;
            font-weight: normal;
        }
        .regist-success{
            margin: 60px 0 0;
        }
        .line{
            margin-bottom: 10px
        }
        ul{
            margin-top: 30px;
            text-align: left;
            color: #999;
            // font-weight: normal;
            li{
                font-size: 14px;
                height: 26px;
                line-height: 26px;
                span{
                    cursor: pointer;
                }
            }
        }
    }

    .icon{
        width: 60px;
        height: 60px;
        margin-bottom: 20px;
    }

</style>


<style lang="scss">
.forgot-psw-model{
    .modal-container{
        background-color:#fff;   
        width:410px;
        left:50%;
        margin-left:-205px;
        height:auto;  
        padding-bottom:20px;
        .error-icon{
            width:60px;
            height:60px;
            margin-bottom:20px;
        }  
        p{
            padding:0;
            text-align:left;
            font-size:14px;
            line-height:26px;
            &.no{
                font-size:12px;
                margin-bottom:20px;
            }
        } 
        .center{
            text-align:center;
        }
        div{
            margin-top:30px;
        }
    }
}
</style>

