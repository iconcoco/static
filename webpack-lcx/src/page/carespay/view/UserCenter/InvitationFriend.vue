<template>
 <transition name="fade">
    <div class="invitation-friend">
        <!--bannar图-->
        <div class="bgc-bannar"></div>

        <div class="activity-descript">
            <!--活动按钮-->
            <span class="cares-button-info activity">活动暂未开始</span>

            <h3>活动范围</h3>
            <p>未曾使用caresPAY的Amazon澳洲、欧洲站新店铺</p>

            <h3>活动攻略：</h3>
            <p>1、邀请一位好友使用caresPAY，或被一位好友邀请绑定澳洲、欧洲站新店铺，您与好友都能获得澳洲、欧洲站新店铺半年收款免费。</p>
            <p>2、在此基础上，如您再成功邀请到一位好友绑定澳洲、欧洲站新店铺，可累计再获得澳洲、欧洲站新店铺半年收款免费，即达成全年收款免费。</p>
            
            <h3 class="public-padding">活动流程：</h3>
            <p>1.活动开始后,在本页面点击"参与活动" , 生成欧洲活动的专享邀请码;</p>
            <p>2.复制您的邀请码给朋友;</p>
            <p>3.朋友在活动页面输入您的邀请码;</p>
            <p>4.继续邀约朋友或者接受朋友的邀约;</p>
            <p>5.坐等欧澳新店收款福利。</p>

            <h3 class="public-padding">活动细则：</h3>
            <p>1.本次活动限CaresPAY澳洲站正式上线起,前1000名参与用户享受。</p>
            <p>2.您和好友须在CaresPAY澳洲站收款上线后1个月内完成欧洲、澳洲新店铺绑定,并在3个月内产生入账。</p>
            <p>3.本活动有效的澳洲、欧洲新店铺必须是未绑定过caresPAY的店铺。</p>
            <p>4.全年或半年免费收款期限自caresPAY澳洲站上线之日开始计算。</p>
            <p>5.活动开始后,CaresPAY将在您提现的时候正常收取手续费,优惠期待对应优惠期限结束后统一返回。</p>
            <p>6.在CaresPAY发放回馈前,如用户参与活动哦的店铺解除与CaresPAY的绑定或用户自行和/或被平台关闭所有参与活动的店铺,则视为用户放弃参与本次活动的资格,该用户所有店铺未发放的回馈将不再发放。</p>
            <p>7.本活动回馈封顶为通过本活动绑定的欧洲、澳洲新店铺全年收款免费。</p>
            <p>8.本活动规则适用的准据为中国法律。CaresPAY在法律范围内享有解释全。</p>
            <p>9.如恶意滥用本活动,CaresPAY有权取消优惠资格。</p>

            <p class="tp">此外,3月31日前参与活动,更有100元京东卡、CaresPAY大使权益等福利!</p>

        </div>
        
    </div>
 </transition>
</template>

<script>
    export default {
        data(){
            return{
                
            }
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .invitation-friend{
        //bannar图
        .bgc-bannar{
            height: 120px;
            width:100%;
            background: url('../../../../images/carepay/friend_img.png') no-repeat center center;
        }

        .activity-descript{
            padding-left: 33px;
            padding-top:18px;
            padding-bottom: 15px;
            //活动按钮
            .activity{
                width:165px;
                height: 38px;
                line-height: 38px;
                text-align: center;
                margin-bottom: 25px;
            }

            .public-padding{
                padding-top:25px;
            }

            h3{
                font-size: 14px;
                color:#666;
            }

            p{
                line-height: 25px;
                font-size: 14px;
                color:#666;
                padding-right: 47px;
                &.tp{
                    padding-top:25px;
                    color:$--color-primary-three;
                }
            }
        }
    }
</style>


