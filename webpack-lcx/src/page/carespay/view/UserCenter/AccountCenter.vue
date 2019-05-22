<template>
 <transition name="fade">
    <div class="account-center-container">
        <!--账号中心右栏信息-->
        <!--头部信息栏-->
        <section class="cares-headerInfor">
            <!--用户编号-->
            <div class="header-infor personal-module-title">
                <!--头像-->
                <p class="bgImg">
                    <img src="./../../../../images/carepay/account_centerInfor.svg" alt="个人头像">
                </p>
                <!--用户编号-->
                <div class="userNumber">
                    <p class="number">
                        <span>用户编号：</span>
                        <span>{{form.customerNo}}</span>
                        <span class="ING">|</span>
                        <span>用户等级：</span>
                        <span class="step"> <i class=""></i> 普通用户</span>
                    </p>
                    <!--卖家等级信息-->
                    <p class="number">
                        <span>手机号:</span>
                        <span>{{form.phoneNo}}</span>
                        <span class="ING">|</span>
                         <span>邮箱:</span>
                        <span>
                            <template v-if="!form.email">
                                <a class="cares-color bindEmail" href="javascript:;">尚未绑定</a>
                            </template>
                            <template v-if="form.email && form.status==0">
                                {{form.email}} <a class="cares-color bindEmail" href="javascript:;">尚未激活</a>
                            </template>
                            <template v-if="form.email && form.status==1">
                                {{form.email}}
                            </template>
                        </span>
                    </p>
                </div>
            </div>
            <!--我的提现账户-->
            <div class="my-PutForward">
                <!--卖家等级信息-->
                <span>我的提现账户：</span>
                <span class="bing_txt">
                    已绑定<i>{{form.bankCount}}</i>张
                </span>
                <router-link to="/cashaccount" class="cares-color">
                    {{form.bankCount?'[查看]':'[去绑定]'}}
                </router-link>
            </div>
        </section>

        <!--汇率栏-->
        <section class="cares-rate" v-show="form.standardRate && Object.keys(form.standardRate).length">
            <!--标题-->
            <div class="rate-title personal-module-title">
                <h2>
                    <span>当前提现优惠费率</span>
                </h2>
            </div>
            <!--汇率文本-->
            <div class="rate-test personal-module-title" style="height:auto;">
                <ul class="clearfix">
                    <li v-for="(value,key,index) in form.standardRate" :key="index">
                        <span v-if="['BM','YD','EU'].indexOf(key)>-1" class="amazon-logo plat"></span>
                        <span v-if="key=='EBAY'" class="ebay-logo plat"></span>
                        <span v-if="key=='WISH'" class="wish-logo plat"></span>
                        <span v-if="key=='AE'" class="AE-logo plat"></span>

                        <span class="plat" v-if='key=="BM"'>北美站</span>
                        <span class="plat" v-if='key=="YD"'>印度站</span>
                        <span class="plat" v-if='key=="EU"'>欧洲站</span>

                        <span>{{((value)*100).toFixed(2)}}%</span>

                    </li>
                </ul>
            </div>
        </section>

        <!--安全设置总栏-->
        <section class="cares-safeSet">
            <!--安全设置标题-->
            <div class="safe-title personal-module-title">
                <h2> 安全设置</h2>
            </div>

            <!--修改密码-->
            <div class="bind-weixin personal-module-title">
                    <!--左边文本-->
                <div class="left-txt">
                    <p class="descript-one">
                        <span class="title">密码设置</span>
                    </p>
                    <!--小描述-->
                    <p class="descript-two">
                        <span>密码强度越高，账号安全级别越高，不易被非法利用</span>
                    </p>
                    <p class="no descript-two" v-if="form.strength <2">当前密码强度较低，建议修改密码</p>
                </div>
                <!--右边按钮-->
                <div class="right-button">
                    <router-link to="/Pesonal/modifypassword">修改密码</router-link>
                </div>
            </div>

            <!--绑定手机-->
            <div class="bind-weixin personal-module-title">
                    <!--左边文本-->
                <div class="left-txt">
                    <p class="descript-one">
                        <span class="title">绑定手机：</span>
                        <span class="title_txt">{{form.phoneNo}}</span>
                    </p>
                    <!--小描述-->
                    <p class="descript-two">
                        <span>安全验证，提现更改收益账户时将会通过发送手机短信验证码方式进行</span>
                    </p>
                </div>
                <!--右边按钮-->
                <div class="right-button">
                    <router-link to="/Pesonal/modifyphone">修改手机</router-link>
                </div>
            </div>

            <!--绑定邮箱-->
            <div class="bind-weixin personal-module-title">
                    <!--左边文本-->
                <div class="left-txt">
                    <p class="descript-one">
                        <span class="title">绑定邮箱&nbsp;:</span>
                        <span class="title_txt">
                            <template v-if="!form.email">
                                尚未绑定邮箱，点此<a class="cares-color bindEmail" href="javascript:;">绑定邮箱</a>
                            </template>

                            <template v-if="form.email && form.status==0">
                                {{form.email}} 尚未激活，请前往邮箱激活或<a class="cares-color bindEmail" href="javascript:;">重新绑定</a>
                            </template>
                            
                            <template v-if="form.email && form.status==1">
                                {{form.email}}
                            </template>

                        </span>
                    </p>
                    <!--小描述-->
                    <p class="descript-two">
                        <span>作为您的登录邮箱，找回密码以及其他验证操作也将通过邮件发送到此邮箱</span>
                    </p>
                </div>
                <!--右边按钮-->
                <div class="right-button">
                    <router-link to="/Pesonal/modifyemail" v-if="form.email && form.status==1"> 修改邮箱</router-link>
                </div>
            </div>
        </section>    
    </div>
 </transition>
</template>

<script>

    import {
        queryCustomerInfo
    } from '../../utils/localbase.js'

    export default {
        data(){
            return{
               form:{
                   customerNo:'',           //用户编号
                   email:'',                //邮箱
                   phoneNo:'',              //手机号
                   standardRate:{},         //费率
                   bankCount:'',            //银行卡数量
                   status:'',               //状态 0 未激活  1 已激活
                   strength:'',               //密码强度 1 比较低  2 中毒  3 高
               }
            }
        },
        created () {
            //查询商户详细信息接口
            queryCustomerInfo().then(res=>{
                
                for (const key in this.form) {
                    if(key=='strength'){
                        this.form[key] = res[key] || 3
                    }else{
                        this.form[key] = res[key];
                    };
                }

            })
        },
        methods: {
           
        },

    }
</script>

<style lang="scss" scoped>

@import '../../../../css/common/theme.scss';

    .account-center-container{
        background-color: #f4f5f9;
    }
    
    .pesonal-info{
        margin-left: 10px;
    }

    //头部信息栏
    .cares-headerInfor{
        padding:0px 20px;
        background:#fff;
            //顶部信息栏
        .header-infor{
            display:table;
            width:100%;
            padding:0px 10px;
            //头像
            .bgImg{
                // background: url('../../images/carepay/account_centerInfor.png') no-repeat center center;
                // background-size: 44px 45px;
                position: absolute;
                width:60px;
                height: 60px;
                top:15px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            //用户编号
            .userNumber{
                margin-left: 75px;
                margin-top:16px;
                .number{
                    line-height: 30px;
                    .ING{
                        margin: 0 20px;
                    }
                    span{
                        font-size: 14px;
                        color:#666;
                        letter-spacing: 1px;
                    }

                    .step{
                        color: $--color-primary-one;
                        // color: #FFD333;
            //              './../../../../images/carepay/vip.svg'
            //              './../../../../images/carepay/nvip.svg'
                        i{
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            background: url('./../../../../images/carepay/vip.svg') no-repeat center center;
                            background-size: 100% 100%;
                            vertical-align: middle;
                            margin-top: -4px;
                        }
                    }
                }
            } 
        }
        //提现账户卡数量
        .my-PutForward{
            height: 60px;
            line-height: 60px;
            font-size: 14px;
        }
    }
    //汇率栏
    .cares-rate{
        padding:0px 20px;
        background:#fff;
        margin-top:10px;
        .rate-title{
            line-height: 92px;
            padding:0px 10px;
            h2{
                font-size: 16px;
                color:#666;
                letter-spacing: 1px;
                font-weight: normal;
            }
        }
        .rate-test{
            line-height: 92px;
            border-bottom: none;
            padding:0px 10px;
            .plat{
                margin-right: 10px;
            }
            
            li{
                display: inline-block;
                // float: left;
                line-height: 92px;
                padding:0 20px;
                position: relative;
                &::after{
                    position: absolute;
                    content: "";
                    width: 2px;
                    height: 40px;
                    background-color: #eee;
                    right: 0;
                    top: 50%;
                    margin-top: -20px;
                }
                >span{
                    font-size: 12px;
                    color:#666;
                    vertical-align: middle;
                // margin-top:46px;
                }
            }
        }
    }
    //安全设置栏
    .cares-safeSet{
        margin-top:10px;
        background:#fff;
        padding:0px 20px;
        //安全标题
        .safe-title{
            line-height: 92px;
            padding:0px 10px;
            h2{
                font-size: 16px;
                color:#666;
                font-weight: normal;
            }
        }
        //绑定微信
        .bind-weixin.personal-module-title{
            padding:0px 10px;
            overflow: hidden;
            height: 97px;
            //左边文本
            .left-txt{
                display: block;
                float: left;
                padding-top:28px;
                .descript-one{
                    //绑定微信标题
                    .title{
                        font-size: 14px;
                        color:#666;
                    }
                    //绑定微信文本
                    .title_txt{
                        font-size: 14px;
                        color:#666;
                        letter-spacing: 1px;
                    }
                }
                .descript-two{
                    font-size: 12px;
                    >span{
                        font-size: 12px;
                        color:#999;
                    }
                }
            }
            //右边按钮
            .right-button{
                display: block;
                float: right;
                padding-top:32px;
                a{
                    // height: 34px;
                    // line-height: 34px;
                    color: $--color-primary-one;
                    font-size: 14px;
                    width: 100px;
                    border-radius: 19px;
                }
            }
        }
    }
</style>