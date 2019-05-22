<template>
    <div v-show="ING">
        <div class="block relative" v-if="flashWithdrawAD.inActice">
            <div class="banner">
                <h3>闪提宝180天免费特权限时领取</h3>
                <h4>活动规则说明</h4>
                <p class="time">活动时间：{{flashWithdrawAD.startTime | formatData}}~{{flashWithdrawAD.finishTime | formatData}}</p>
                <p>活动规则：</p>
                <p>新用户：活动期内领取“闪提宝限免”优惠券，并在活动期内绑定的Amazon店铺享有180天闪提宝免费服务</p>
                <p>老用户：活动期内领取“闪提宝限免”优惠券，并在活动期内新绑定的Amazon店铺享有180天闪提宝免费服务</p>
                <a href="javascript:;" @click="toGetCoupon(flashWithdrawAD.isShow)" class="cares-button-primary pain">
                    {{flashWithdrawAD.isShow?'免费领取':'已领取，立即使用'}}
                </a>
            </div>
        </div>
        <div class="introduction relative">
            <a href="javascript:;" class="cares-button-primary" @click="toGetCoupon(false)" v-if="!flashWithdrawAD.inActice">立即申请</a>
        </div>
        <div class="whatIsFastWithdraw"></div>
        <div class="whyOurDoThat"></div>
        <div class="question">
            <div class="banner">
                <h3>常见问题</h3>
                <ul>
                    <li>
                        <p class="title"><span class="point no"></span> 1、闪提宝支持哪些平台？</p>
                        <p>目前闪提宝服务支持亚马逊北美站、欧洲站、印度站。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>2、开通闪提宝有什么要求吗？</p>
                        <p>您需要在CaresPAY商户后台提交实名认证信息并绑定店铺信息后即可开闪提宝服务。系统会自动判断您是否有资质开通闪提宝。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>3、为什么之前一直在使用闪提宝，现在提示我暂不能使用？</p>
                        <p>由于您的收款账户发生了异常，或者免费服务有效期到期，我们暂时中止了您的闪提宝服务。若您对此有任何疑问，可以随时联系我们。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>4、闪提宝的手续费怎么计算？</p>
                        <p>闪提宝服务的手续费为您每笔申请的提前收款金额的0.1%。除了闪提宝手续费外，您还需要支付相应的提现手续费。所有的手续费将从您申请的该笔提前收款款项中直接扣除。</p>
                        <p>例：您申请提前收款的金额为10,000USD，提前收款服务的手续费为10USD，提现手续费70USD元（提现手续费为0.7%），您实际收到的提前收款款项为9,920USD按照实时交割汇率换算的人民币金额。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>5、闪提宝的汇率如何计算？</p>
                        <p>闪提宝使用的汇率与正常提现一致，您可以在CaresPAY页面看到银行实时汇率，您可以自主选择提现汇率。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>6、我的实际到账资金会如何处理？</p>
                        <p>资金实际到账后，我们将自动收回已提前支用给您的对应款项。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>7、如果我提前收款的店铺一直未到账，会有怎样的影响？</p>
                        <p>如您提前收款的店铺在10天之内仍未到账，我们将冻结您的账户余额并扣除与您提前收款资金等额的款项。</p>
                    </li>
                    <li>
                        <p class="title"><span class="point no"></span>8、为什么新绑定店铺开通闪提宝后的第一笔资金收到亚马逊转款邮件后1-2天才能提现？</p>
                        <p>闪提宝服务是CaresPAY为您垫资，需确保您在亚马逊后台绑定的CaresPAY账号正确无误，因此第一笔入账需确保亚马逊转账成功方可让您可提现。</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    getFlashWithdrawStore,
    getflashWithdrawNotice,
    getflashWithdrawConpon
    } from './../../../../js/api.js';
import { formatTimer } from './../../../../js/common.js';

import { queryPersonInfo } from '../../utils/localbase.js';

import AdminModel from './../../../../components/adminModel.vue';
export default {
    data(){
        return {
            flashWithdrawAD:{
                activatDay: '',
                finishTime: '',
                isShow: false,      //是否可以领取
                startTime: '',
                inActice:false,
            },

            ING:false,
            AJAX:false,
        }
    },
    created(){
        getflashWithdrawNotice({type:1}).then(res=>{
            this.ING = true;
            if(res.code==0){
                if(res.data){
                    Object.assign(this.flashWithdrawAD,res.data);
                    let curData = new Date().getTime();
                    
                    //是否在活动区内
                    this.flashWithdrawAD.inActice = curData > res.data.startTime && curData < res.data.finishTime 
                }
            }else{
                this.$Message.error(res.msg);
            }
        });
    },
    methods:{
        toGetCoupon(value){
           
            //1. 已经领取/不在活动区内
            if(!value) return this.canItoOpen();

            //2. 未领取
             if(this.AJAX) return
            this.AJAX = true;
            getflashWithdrawConpon().then(res=>{
                this.AJAX = false;
                if(res.code==0){
                    return res
                }else{
                    this.$Message.error(res.msg);
                }
            }).then(res=>{
                if(!res) return;
                if(res.data){
                    //未实名认证或者未绑定亚马逊店铺
                    this.$store.commit('changeAppModel',{
                        name:'APPWARNINGPOP',
                        value:true
                    }),
                    this.$store.commit('changeAppModel',{
                        name:'APPWARNINGTYPE',
                        value:  res.data==100 ? 1 : 2
                    });
                }else{
                    //领取成功
                    this.$Message.success('闪提宝限免优惠领取成功！');
                    this.$emit('transToContent',true)
                };
            });
        },
        canItoOpen(){
            //1.查询是否已经实名认证
            queryPersonInfo().then(res=>{
                if(res){
                     //2.查询是否已经有店铺
                    return  getFlashWithdrawStore()
                }else{
                    this.$store.commit('changeModleState',true);
                }
            }).then(res=>{
                if(!res) return;
                if(res.code==0){
                    //判断店铺数量
                    res.data >= 1 ? 
                    (
                        this.$emit('transToContent',true)
                    ) : ( 
                      
                        this.$store.commit('changeAppModel',{
                            name:'APPWARNINGTYPE',
                            value: 2
                        }),
                        this.$store.commit('changeAppModel',{
                            name:'APPWARNINGPOP',
                            value:true
                        })
                     );
                }else{
                    this.$Message.error(res.msg);
                }
            });
        }
    },
    components:{
        AdminModel
    },
    filters:{
        formatData(value){
            return formatTimer(value,true)
        },
        countDay(value){
            let day = Math.ceil(value/(24*60*60*1000))
            return day;
        }
    }
}
</script>


<style lang="scss" scoped>

@import './../../../../css/common/theme.scss';

.relative{
    position: relative;
    .cares-button-primary{
        position: absolute;
        left: 50%;
        bottom: 40px;
        transform: translateX(-50%);

        min-width: 152px;
        height: 52px;
        line-height: 52px;
        border-radius: 26px;
        font-size: 16px;
        border: none;
        font-weight: 700;
        padding-left:30px;
        padding-right:30px;
    }
}

.block{
    height: 460px;
    background:url('./../../../../images/carepay/限时领取.png') no-repeat center center;
    background-size: 1920px 460px;
    color: #fff;
    >div{
        background-color: transparent;
        padding-top: 40px;
    }
    h3{
        font-size: 30px;
        letter-spacing: 1px;
        margin-bottom: 30px;
    }
    h4{
        font-size: 18px;
        margin-bottom: 13px;
    }
    p{
        font-size: 14px;
        line-height: 24px;
    }
    .time{
        margin-bottom: 13px;
    }
}

.introduction{
    height: 660px;
    background:url('./../../../../images/carepay/闪提宝介绍.jpg') no-repeat center center;
    background-size: 1920px 660px;
}

.whatIsFastWithdraw{
    height: 580px;
    background:url('./../../../../images/carepay/什么是闪提宝.jpg') no-repeat center center;
    background-size: 1920px 580px;
}

.whyOurDoThat{
    height: 660px;
    background:url('./../../../../images/carepay/为什么要提前收款.jpg') no-repeat center center;
    background-size: 1920px 660px;
}

.question{
    background-color: #F5F5F5;
    padding-top: 60px;
    >div{
         background-color: transparent;
    }
    h3{
        font-size: 32px;
        text-align: center;
        color: $--color-primary-one;
    }
    ul{
        width: 70%;
        margin-top: 60px;
        margin: 0 auto;
        li{
            margin-bottom: 30px;
            p{
                font-size: 14px;
                color: #999;
                line-height: 26px;
            }
            .title{
                color: #333;
                font-weight: bold;
                position: relative;
                font-size: 16px;
                span{
                    position: absolute;
                    left: -15px;
                    top: 9px;
                }
            }
        }
    }
}
</style>
