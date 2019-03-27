<template>
    <div class="ads_3000_container">
            <ul v-if="ADSTATUS==0">
               <li>距离领取奖励截止时间</li>
               <li class="time-out">{{timer.d}}天{{timer.h}}小时{{timer.m}}分{{timer.s}}秒</li>
               <li class="btn-box-container"> 
                   <a href="javascript:;" @click="bindToFillName">完善信息</a> 
                </li>
                <li>点击完善信息，领取奖励</li>
           </ul>

           <ul v-else>

                <template v-if="ADSTATUS==1">
                    <li class="txt no-mgb">奖励已领取，可在·个人中心-我的优惠券·中查看</li>
                     
                    <li class="btn-box-container">
                        <router-link to="/Pesonal/Coupon?isactive=3">查看奖励</router-link>
                    </li>
                </template>

                <template v-if="ADSTATUS==2">
                    <li class="txt">您的优惠券已经过期</li>
                </template>

                <template v-if="ADSTATUS==3">
                    <li class="txt">已超过领取奖励截止时间</li>
                </template>

                <li>请密切关注CaresPAY推出的活动</li>
                <li>惊喜礼包，等你来拿~</li>
                
            </ul>
    </div>
</template>

<script>

    import { queryFreeWithdraw } from './../../../../js/api.js';

    import {
        queryCustomerInfo,      //客户信息
    } from '../../utils/localbase.js';

export default {
    data(){
        return{
             cusomerInfo:null,

            //  ADSTATUS:3,
             ADSTATUS:0,
             timer:{
                  d:"--",
                  h:"--",
                  m:"--",
                  s:"--"
              },
        }
    },
    created(){
        queryCustomerInfo().then(res=>{
            this.cusomerInfo = res;
            this.LOADINGQUERY();
        });
      
    },
    methods:{
        LOADINGQUERY(){
            queryFreeWithdraw().then(res=>{
               
                if(res.code==0){
                    //没有数据也当做失效
                    // this.ADSTATUS = Number(res.data.status);
                    this.ADSTATUS = res.data ? Number(res.data.status) : 3;

                    //0 待领取 1 已领取 2 已失效 3 已过期
                    this.ADSTATUS == 0 && this.bindCheckShowAd();

                }else{
                    this.$Message.error(res.msg);
                }
                
            });
        },
        bindToFillName(){
            this.$router.push({name:'CompleteAccount'});
        },
        //倒计时
        bindCheckShowAd(){

             //七天的毫秒
             let activeT = 7*24*60*60*1000,
                creaT = this.cusomerInfo.createdTime,//创建账号时间
                endT = creaT + activeT, //截止时间

                nowT = new Date().getTime();//当前时间


            let _this = this;

            let _time = function(timeing){

                    let downT = setInterval(function(){
                        timeing -= 1000;

                        if(timeing<=0){
                            clearInterval(downT);
                            _this.ADSTATUS = 3;
                        }

                        let D = Math.floor(timeing/1000/60/60/24),
                        H = Math.floor((timeing - D*24*60*60*1000)/1000/60/60),
                        M = Math.floor((timeing - D*24*60*60*1000- H*60*60*1000)/1000/60),
                        S = Math.floor((timeing - D*24*60*60*1000- H*60*60*1000-M*60*1000)/1000);

                        _this.timer.d = D;
                        _this.timer.h = H;
                        _this.timer.m = M;
                        _this.timer.s = S;


                    },1000);
            };

             _time(endT-nowT)

             

        },

    }
}
</script>


<style lang="scss" scoped>

@import './../../../../css/common/theme.scss';

.ads_3000_container{
    height: 600px;
    margin: 0 auto;
    background: #fff url('./../../../../images/ac/f3000.png') no-repeat center center;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // margin-left: -433px;
    // margin-top: -217px;
    border-radius: 8px;

       ul{
            display: inline-block;
            width: 50%;
            margin-top: 280px;
            padding-left:48px;
            li{
                font-size: 14px;
                color: #fff;
                // font-weight: 600;
                vertical-align: middle;
                a{
                    display: inline-block;
                        width: 120px;
                        height: 38px;
                        border-radius: 19px;
                        color: white;
                         background: linear-gradient(to right,#FF8A0A,#FD5346);
                       
                        text-align: center;
                        line-height: 38px;
                        font-size: 17px;
                        font-weight: normal;
                        transition:all .2s;
                        margin-top: 100px;
                        &:hover{
                             box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                        }
                }
            }
            .time-out{
                width: 230px;
                height: 50px;
                border-radius:25px;
                background-color:rgba(255,255,255,.5);
                text-align:center;
                color:#FF5A45;

                line-height: 50px;
                font-size: 20px;
                margin-top: 15px;
            }
            .txt{
                font-size: 20px;
                color:#FF5A45;
                margin-bottom: 100px;
                margin-top: 15px;
                &.no-mgb{
                    margin-bottom: 0;
                }
            }
            .btn-box-container{
                    margin-top: 10px;
                    margin-bottom: 20px;
                }
            }
     
}
</style>

