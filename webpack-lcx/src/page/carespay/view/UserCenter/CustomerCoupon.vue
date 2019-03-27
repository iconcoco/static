<template>
        <div class=" fadeIn person-coupon-contaienr">
             <h2 class="banner-module-title">我的优惠券</h2>

             <ul v-if="!AJAXING && (ADSTATUS==1||ADSTATUS==0)" class="coupon-container">
                 <li :class="{active:(ADSTATUS==1) }">
                     <div>
                         <div class="amount">
                             <i>$</i><b>3000</b>
                         </div>
                         <!--  //0 待领取 1 已领取 2 已失效 3 已过期 -->
                         <div class="txt">
                            <h3>免费提现额度-优惠券</h3>
                            <template v-if="ADSTATUS==0">
                                <p  class="time">有效期至{{FormatT(coupon3000.endTime)}}</p>
                                <p class="btn">
                                    <a class="cares-button-primary" href="javascript:;"  v-if="!personInfo"  @click="bindToFillName">免费领取</a>
                                    <b v-else>待实名认证审核通过后自动发放</b>
                                </p>
                            </template>
                            <template v-else>
                                <p class="balance">
                                    已使用：<span style="margin-right:15px;">${{(coupon3000.receiveAmount)/100}}</span>
                                    待使用：<span>${{(coupon3000.validAmount-coupon3000.receiveAmount)/100}}</span>
                                </p>
                                 <p v-if="coupon3000.receiveAmount==0" class="time">有效期至{{FormatT(coupon3000.endTime)}}</p>
                            </template>
                            <div style="margin-top:20px;"> 
                                <a 
                                href="javascript:;" 
                                class="fr use-rule"
                                @click="bindToshowUseRule"
                                >使用规则 
                                    <i 
                                        :class=" showRule? 'el-icon-caret-top' :'el-icon-caret-bottom'"
                                    ></i>
                                </a> 
                            </div>

                         </div>

                         <!-- 领取规则 自领取日起有效期2个月。-->
                         <div class="rule-text" :class="{active:showRule}">
                             3000美金免费提现，每提现一笔自动扣减额度，直至提现累计金额达到3000美金,优惠额度自动取消{{ coupon3000.receiveAmount==0 ? '，自领取日起有效期2个月':''}}。
                         </div>
                     </div>
                 </li>
             </ul>
            
            <!-- 空空如也 -->
             <div v-if="!AJAXING &&(ADSTATUS==2||ADSTATUS==3)" class="empty">
                 <!-- <span></span> -->
                  <img class="error_img_1" src="../../../../images/carepay/404.png" alt="404">
                 <p>暂无优惠券可领取...</p>
             </div>
        </div>

</template>

<script>

    import { queryFreeWithdraw } from './../../../../js/api.js';
    import { formatTimer } from './../../../../js/common.js';

    import { 
        queryPersonInfo ,               //实名认证信息
    } from '../../utils/localbase.js';

export default {
    data(){
        return{
            coupon3000:{
                receiveAmount:'',
                validAmount:'',
            },
            AJAXING:true,
            ADSTATUS:'3',
            personInfo:null,   //是否显示免费领取的入口

            showRule:false,
        }
    },
    created(){
        
         //请求优惠券信息
         queryFreeWithdraw().then(res=>{
             this.AJAXING = false;
             if(res.code==0){
                 //0 待领取 1 已领取 2 已失效 3 已过期
                 this.ADSTATUS = res.data ? Number(res.data.status) : 3 ;

                 this.ADSTATUS !=3 && (this.coupon3000 = res.data)

                if(this.ADSTATUS==0){ // 未实名认证或者 待审核
                    queryPersonInfo().then(res=>{
                        this.personInfo = res;
                    });
                }

             }else{
                 this.$Message.error(res.msg);
             }
         });

       
    },
    methods:{
        bindToFillName(){
            this.$router.push({name:'CompleteAccount'});
        },
        FormatT(params){
            return formatTimer(params,true);
        },
        bindToshowUseRule(){
            this.showRule = !this.showRule;
        }
    }
}
</script>


<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';

.person-coupon-contaienr{
    min-height: 400px;
    padding: 0 20px;
}

.use-rule{
    font-size: 12px;
    margin-right: 20px;
    color: #666;
    i{
        font-size: 14px;
    }
}
.coupon-container{
    padding: 40px 0;
    li{
        width: 480px;
        // height: 176px;
        border: 1px solid #ccc;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        padding: 5px;
        transition: all .5s;
       
        &::before{
            content: "待领取";
            position: absolute;
            width: 100px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            color: #fff;
            font-size: 16px;
            // border-radius: 50%;
            background-color: $--color-primary-three;
            transform: rotate(-45deg);
            left: -28px;
            top: 5px;
            z-index: 5;;
        }
        >div{
            width: 100%;
            height: 100%;
             border-radius: 8px;
            border: 1px dashed #d1d1d1;
            overflow: hidden;
            transition: all .2s;
            .rule-text{
                width: 90%;
                margin: 0 auto;
                border-top: 1px dashed #d1d1d1;
                font-size: 12px;
                line-height: 20px;
                height: 0px;
                padding: 0;
                transition: all .2s;
                opacity: 0;
                &.active{
                    opacity: 1;
                    height: 60px;
                    padding: 10px 0;
                }
            }
            .txt{
                display: inline-block;
                width: 59%;
                text-align: left;
                padding-left: 10px;
                vertical-align: middle;
                padding-top: 20px;
                h3{
                    color: #333;
                }
                p{
                    // line-height: 50px;
                    font-size: 12px;
                    span{
                         color: $--color-primary-one;
                    }
                     a{
                    //     display: inline-block;
                        height: 30px;
                    //     background: $--color-primary-three;
                    //     color: #fff;
                    //     text-align: center;
                        line-height: 30px;
                        padding: 0 20px;
                        border-radius: 4px;
                    //     &:hover{
                    //         background-color:  $--color-primary-one;
                    //     }
                    }
                }
                .explain{
                    color: #aaa;
                    line-height: 20px;
                }
                .balance{
                    font-size: 16px;
                    color: #333;
                    margin-top: 5px;
                    font-weight: bold;
                    span{
                        font-weight: bold;
                        color: $--color-primary-three;
                    }
                }
                .time{
                    color: #aaa;
                    line-height: 26px;
                }
                .btn{
                    margin-top: 15px;
                    // text-align: center;
                    b{
                        color: #aaa;
                        font-size: 14px;
                        // font-style: normal;
                        font-weight: normal;
                    }
                }
            }
            .amount{
                display: inline-block;
                line-height: 140px;
                width: 39%;
                text-align: center;
                position: relative;
                vertical-align: middle;
                &::after{
                    content: "";
                    width: 1px;
                    height: 130px;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -65px;
                    background-color: #ddd;
                }
                i{
                    font-size: 27px;
                    color: #666;
                }
                b{
                    font-size: 60px;
                    // color: #f57e4c;
                    color: $--color-primary-three;
                }
            }
        }

        &:hover{
             box-shadow:0 0px 30px rgba(0,0,0,0.1) ;
        }
    }

    li.active{
        border-color: #ddd;
        &::before{
            content: "已领取";
            font-size: 16px;
            background-color: #ddd;
        }
        >div{
            border-color: #ddd; 
            .txt{
                p{
                    a{
                        display: none;
                    }
                }
            } 
        }
    }
}


.empty{
    text-align: center;
    padding-top: 60px;
    padding-bottom: 40px;
    img{
        width: 200px;
    }
   p{
       margin-top: 20px;
       color: #666;
   }
}
</style>
