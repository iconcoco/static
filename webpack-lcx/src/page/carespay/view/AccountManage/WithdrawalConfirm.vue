<template>
    <div class="withdrawalConfirm-container fadeIn">
        <h2 class="banner-module-title">确认提现信息</h2>
        <div class="info-container">
            <ul>
                <li v-for="(item,key,index) in listData" :key="index">
                    <p class="f"><b>提现金额：</b><i class="cares-color">{{((item.amount)/100).toFixed(2)}}</i> {{item.currency}}</p>
                    <p>到账银行卡信息：<span>{{item.bankAccountName}}</span> <span>{{item.bankName}} （{{item.bankAccount}}）</span></p>
                </li>
                <li> 
                    <p class="f"><b>提现总额：</b><i class="cares-color">{{(withdrawsAmount/100).toFixed(2)}}</i> {{withdrawsCurrency}}</p>
                </li>
                <li>
                    <p class="f"><b>服务费：</b> {{(withdrawsRate/100).toFixed(2)}} {{withdrawsCurrency}}</p>
                    <p>剩余免费额度：{{(withdrawsFree/100).toFixed(2)}} USD</p>
                </li>
                <li>
                    <b>到账时间：</b> <i class="miaobiao-icon"></i> 预计{{withdrawsTime}}
                </li>
            </ul>
        </div>
        <div class="auth-code">
            <span class="cares-color" @click="bindToContinueSelect"> <i class="el-icon-arrow-left"></i> 返回修改</span>

            <p>确认无误，<a class="cares-color" href="javascript:;" @click="getVerifyCode">{{CODE.text}}</a> </p>
        </div>
        <div class="auth-code">
            <label class="input-model" for="label_input">
                <i :class="{focus:iIndex==0}">{{(String(verifyCode).split(""))[0]}}</i>
                <i :class="{focus:iIndex==1}">{{(String(verifyCode).split(""))[1]}}</i>
                <i :class="{focus:iIndex==2}">{{(String(verifyCode).split(""))[2]}}</i>
                <i :class="{focus:iIndex==3}">{{(String(verifyCode).split(""))[3]}}</i>
                <i :class="{focus:iIndex==4}">{{(String(verifyCode).split(""))[4]}}</i>
                <i :class="{focus:iIndex==5}">{{(String(verifyCode).split(""))[5]}}</i>
            </label>
            <input type="tel" maxlength="6" 
            ref="inputDom"
            v-model="verifyCode" id="label_input"
             @input="bindInputChange"
             @focus="bindInputChange"
             @blur="bindInputBlur"
             >
        </div>
        <div class="auth-code">
            <span @click="ApplyWithdraw" class="button" :class="verifyCode.length>=6 ? 'cares-button-primary':'cares-button-info'">确认提现</span>
        </div>


        <div class="in-withdrawal" v-show="Model.ING">
            <div class="content">
                <template v-if="Model.status==0">
                    <span class="icon loading-icon"></span>
                    <p>正在申请提现请耐心等候...</p>
                </template>

                <template v-if="Model.status==1">
                    <span class="icon success-icon success-fadeIn"></span>
                    <p>发起提现成功！</p>
                </template>
             </div>
        </div>
    </div>
</template>

<script>
import {
    sendWithdrawVerifyCode,             //获取短信验证码
    applyWithdraw
} from './../../../../js/api.js';

export default {
    data(){
        return {
            listData:[],
            verifyCode:"",

            withdrawsAmount:0,      //提现总额
            withdrawsRate:0,
            withdrawsFree:0,
            withdrawsCurrency:null,
            withdrawsTime:null,

            iIndex:null,
            CODE:{
                ING:false,
                text:"获取验证码"
            },

            Model:{
                ING:false,
                status:0,       //0 正在申请  1. 成功 
            }
        }
    },
    props:["data",'RateData'],
    watch:{
        RateData(n){
            this.RateAndFree();
        }
    },
    created(){
        this.RateAndFree();
    },
    methods:{

        Reset(){
            this.listData=[];
            this.withdrawsAmount=0,      //提现总额
            this.withdrawsRate=0,
            this.withdrawsFree=0,
            this.withdrawsCurrency=null,
            this.withdrawsTime=null;
        },

        //获取验证码
        getVerifyCode(){
            //1. 判断是否可以获取验证码
            if(this.CODE.ING) return;
            this.CODE.ING= true;

            //2. 请求获取验证码并倒计时
            let _this = this,
                time = 60;

            sendWithdrawVerifyCode().then(res=>{
                if(res.code==0){

                    let TimeId = setInterval(()=>{
                        time--;
                        _this.CODE.text=`重新获取(${time}s后)`;
                        if(time<=0){
                            _this.CODE.ING= false;
                            _this.CODE.text=`获取验证码`;  
                            clearInterval(TimeId);
                        };
                    },1000);

                }else{
                    _this.CODE.ING= false;
                    _this.$Message.error(res.msg)
                }

            });
            //3. 输入框获取焦点
             this.$refs.inputDom.focus();
           
        },
        //确认提现按钮
        ApplyWithdraw(){
            if(this.verifyCode.length<6) return;
            if(this.Model.ING) return;
            this.Model.ING = true;
            //申请提现的借口
            applyWithdraw({
                verifyCode:this.verifyCode,    //提现的验证码
                withdraws:JSON.stringify(this.data)  //提现的数据
            }).then(res=>{
                if(res.code==0){
                    this.Model.status = 1;
                    setTimeout(function(){
                        //刷新页面
                        location.reload();
                    },2000);
                }else{
                    this.Model.ING = false;
                    this.$Message.error(res.msg);
                }
            });
        },
        bindToContinueSelect(){
            this.Reset();
            this.$emit("transParams",false)
        },
        bindInputChange(){
            let c = this.verifyCode;
            //输入框颜色
            this.iIndex = String(c).split("").length-1<0 ?0: String(c).split("").length-1;
        },
        bindInputBlur(){
            this.iIndex = null;
        },

        RateAndFree(){
            this.listData = this.RateData;

            let Rate = 0;
            let Amount = 0;
            let Free = 100000000000;
            for (const key in this.listData) {
                let item = this.listData[key];
                Rate += item.serviceCharge; //服务费
                Amount += item.amount; //服务费
                Free = Free > item.leaveAmount ? item.leaveAmount : Free;

                !this.withdrawsCurrency && (this.withdrawsCurrency = item.currency); //币种
            };

            this.withdrawsRate = Rate;
            this.withdrawsFree = Free;
            this.withdrawsAmount = Amount;
            

            let nowD = new Date().getTime();
            if(new Date().getHours()>=21){
                let netD = nowD+1*24*60*60*1000;
                this.withdrawsTime = `${new Date(netD).getMonth()+1}月${new Date(netD).getDate()}日12点前`;
            }else{
                this.withdrawsTime = `${new Date(nowD).getMonth()+1}月${new Date(nowD).getDate()}日24点前`;
            };
            
        }
    }
}
</script>



<style lang="scss" scoped>
    @import "'./../../../../css/common/theme.scss'";

    .withdrawalConfirm-container{
        padding: 0 20px;
        padding-bottom: 20px;
        .info-container{
            padding: 10px 20px;
            background-color: rgba(232, 244, 255, 1);
            color: #666;
            ul{
                li{
                    height: 50px;
                    line-height: 50px;
                    font-size: 14px;
                    p{
                        display: inline-block;
                        &.f{
                            min-width: 360px;
                        }
                        .cares-color{
                            font-size: 20px;
                            font-weight: bold;
                        }
                        span{
                            margin-right: 10px;
                        }
                    }
                    b{
                        display: inline-block;
                        width: 90px;
                        text-align: right;
                        font-weight: normal;
                    }
                }
            }
        }

        .auth-code{
            padding: 10px 0;
            text-align: center;
            font-size: 14px;
            color: #666;
            position: relative;
            span.cares-color{
                position: absolute;
                left:0;
                cursor: pointer;
            }
            .button{
                padding: 0 35px;
            }

            .input-model{
                display: inline-block;
                i{
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    border: 1px solid #d1d1d1;
                    border-radius: 4px;
                    vertical-align: top;
                    font-size: 16px;
                    font-weight: bold;
                    margin: 0 5px;
                    cursor: pointer;
                    &.focus{
                        border-color: $--color-primary-two;
                        box-shadow: 0 4px 4px $--color-primary-two-hover;
                    }
                }
            }
            input{
                opacity: 0;
                position: absolute;
                left: -100%;
            }
        }
    }

    .in-withdrawal{
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        top: 0;
        left: 0;
        z-index: 100;
        .icon{
            width: 80px;
            height: 80px;
        }
        p{
            margin-top: 20px;
            color: #fff;
        }
        .content{
            text-align: center;
            width: 200px;
            margin: 0 auto;
            margin-top: 100px;
            background-color: transparent;
        }
    }
</style>

