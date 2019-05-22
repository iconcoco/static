<template>
    <div :class="{hasBottomAd:$route.name != 'FastArrival' && isHasBottomAd}">
        <!-- <div class="windowNotice" v-if="rooper">
            <b class="close" @click="closeRooper('rooper')"></b>
            <div class="banner">
                <span>尊敬的客户您好：为更好地服务广大客户，我司需要对系统进行优化升级，升级时间为本周四（3月28日）晚22：00－次日6：00，届时将暂停提现服务。请您提前安排好提现计划，对此带来的不便敬请谅解，谢谢。</span>
            </div>
        </div> -->
        <header class="cares-header">
            <div class="banner clearfix">
                <!-- 左边logo部分 -->
                <div class="fl">
                    <h1>
                        <router-link to="/index" class="logo">
                            <img src="./../../images/carepay/logo.png" alt="carespay" />
                        </router-link>
                    </h1>
                    <ul class="mainTab">
                        <li><router-link to="/index">账户总览</router-link></li>
                        <li><router-link to="/storemanage">店铺管理</router-link></li>
                        <li v-if="isHasStore"><router-link to="/finance">明细查询</router-link></li>
                        <li><span></span></li>
                        <li style="height:38px;">
                            <router-link to="/vat">VAT</router-link>
                            <ul class="innerTab">
                                <li><router-link to="/vat/apply">VAT注册</router-link></li>
                                <li><router-link to="/vat/report">VAT报税</router-link></li>
                                <!-- <li><router-link to="/vat/payTax">VAT缴税</router-link></li> -->
                            </ul>
                        </li>
                        <li><router-link to="/AutoPay">自动提现</router-link></li>
                        <li><router-link to="/FlashWithdraw">闪提宝</router-link></li>
                        <li><router-link to="/AllApp">全部应用</router-link></li>
                    </ul>
                </div>
                <!-- 右边菜单部分 -->
                <div class="fr">
                    <ul class="top-menu clearfix">
                        <!-- <li>
                            <b v-if="$store.state.notifyData.length">{{$store.state.notifyData.length}}</b>
                            <a href="javascript:;">通知</a>
                            <ul class="msg-box">
                                <template v-if="$store.state.notifyData.length">
                                
                                    <li class="msg">消息 <em class="fr" @click="bindNewClick('All')">清空</em> </li>

                                    <li class="news" v-for="(item,index) in $store.state.notifyData" :key="index">
                                        <div @click="bindNewClick(item.type)" v-html="item.boxcontent"></div>
                                    </li>

                                    <li class="all"><span @click="bindCheckAllNotice">查看全部</span></li>
                                </template>

                                <li v-else class="empty">
                                    <span></span>
                                    <p>暂无新消息</p>
                                </li>
                            </ul>
                        </li> -->
                        <!-- <li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1361257395&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1361257395:41" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></li> -->
                        <li>
                            <el-tooltip class="item" effect="dark" content="在线时间：周一至周五09:30~18:30" placement="left">
                                <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1361257395&site=qq&menu=yes">联系客服</a>
                            </el-tooltip>
                        </li>
                        <li><a target="_blank" href="http://www.carespay.com/help_center.html">帮助中心</a></li>
                        <!-- <li><router-link to="/help">帮助中心</router-link></li> -->
                        <!-- <li><router-link to="/Pesonal/invitationfriend?isactive=2">邀请好友</router-link></li> -->
                        <li>
                            <span>账号中心</span><i></i>
                            <div class="sub-menu">
                                <p><router-link to="/Pesonal"><b class="cares-icon-per"></b> 个人中心</router-link></p>
                                <p><router-link to="/Pesonal/Coupon?isactive=3"><b class="cares-icon-conpon"></b> 我的优惠券</router-link></p>
                                <p><router-link to="/Pesonal/realname?isactive=1"><b class="cares-icon-authenty"></b> 实名认证</router-link></p>
                                <p><router-link to="/cashaccount"><b class="cares-icon-bank"></b> 提现账户</router-link></p>
                                <p @click="bindLayoutAccount" style="border:none;"> <b class="cares-icon-logout"></b> 安全退出</p>
                            </div>
                        </li>
                    </ul>
                    <p class="handle-button fr">
                        <span class="cares-button-primary pain"  @click="bindWithdrawCash">立即提现</span>
                        <span class="cares-button-primary"  @click="bindToAddStore">申请收款账号</span>
                    </p>
                </div>
            </div>
        </header>

       <div class="caras-reminder">
           <el-popover placement="top-start" v-model="$store.state.RealNamePop">
                <div class="popover-content">
                    <h2>温馨提示</h2>
                    <i class="not-name-authenty"></i>
                    <p>您尚未进行实名认证，请先完善信息。</p>
                    <p class="pop-button">
                        <span @click="bindPopconfirm" class="cares-button-primary">去完善</span><br/>
                        <span @click="bindPopcancel" class="ING">知道了</span>
                    </p>
                </div>
            </el-popover>
       </div>

        <AdminModel v-model="STORESTATE.APPWARNINGPOP" class="app-autopay-model">
            <div class="AutoPay-model">
                <h2>温馨提示</h2>
                <i class="warning-icon"></i>
                <template v-if="STORESTATE.APPWARNINGTYPE==1 || STORESTATE.APPWARNINGTYPE==2">
                    <p>您需要完成</p>
                    <ul>
                        <li>1）实名认证</li>
                        <li>2）至少绑定1个亚马逊店铺</li>
                    </ul>
                    <p class="pop-button">
                        <span @click="bindPopconfirm" v-if="STORESTATE.APPWARNINGTYPE==1" class="cares-button-primary">立即完善实名信息</span>
                        <span @click="()=>{ 
                                this.bindCloseAutoPayTip();
                                return bindToAddStore()
                            }" v-if="STORESTATE.APPWARNINGTYPE==2" 
                        class="cares-button-primary">立即绑定店铺</span>
                        <br/><span class="ING" @click="bindCloseAutoPayTip">知道了</span>
                    </p>
                </template>
                <template v-else>
                    <p>您需要完成</p>
                    <ul>
                        <li>1）实名认证</li>
                        <li>2）绑定一个需要提现人民币至大陆的亚马逊店铺</li>
                        <li>3）添加一张中国大陆的银行卡</li>
                    </ul>
                    <p>审核通过后方可使用自动提现服务</p>
                    <p class="pop-button">
                        <span class="cares-button-primary" @click="bindCloseAutoPayTip">知道了</span>
                    </p>
                </template>
            </div>
       </AdminModel>

       <div class="ad-model-container" :class="isShowAd?'fadeIn':'fadeOut'">
           <div class="ad-inner-content" :class="{fadeIn:isShowAd}">
               <span @click="bindCloseADmodel" class="cares-model-close"></span>
               <ul>
                   <li class="text-center">距离领取奖励截止时间</li>
                   <li class="time-out">{{timer.d}}天{{timer.h}}小时{{timer.m}}分{{timer.s}}秒</li>
                   <li class="btn-box-container"> 
                       <a href="javascript:;" @click="bindToFillName">完善信息</a> 
                    </li>
                    <li>点击完善信息，领取奖励</li>
               </ul>
           </div>
       </div>

        <!-- 实名认证审核失败访问的提示 -->
       <AuthenticationWarning
        v-model="$store.state.AuthentyIsError"
        txt="实名认证未通过，请先重新认证实名信息。"
        @exit="bindAuthentiConfirm"
        btnOneTxt="稍后完善"
        btnTwoTxt="立即完善"
        paint="left"
       >
       </AuthenticationWarning>

         <!-- 绑定邮箱弹窗 -->
        <AdminModel v-model="isToFillEmail" class="email-adminmodel-container">
            <div v-if="!sendEmainEnding" :class="{fadeIn:isToFillEmail}" class="fill-email-container">
                <span @click="bindToCloseModel" class="cares-model-close"></span>
                <h2>完善邮箱信息</h2>
                <p>
                    <span>当前账号：</span>
                    <span style="width:auto;color:#333;font-weight:bold;">+86 {{form.phoneNo}}</span>
                </p>

                <p>
                    <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
                </p>
                <p class="nt">作为您的登录邮箱</p>
                <p class="nt">找回密码以及其他验证操作也将通过邮件发送到此邮箱</p>
                
                <div class="btn-container" >
                    <span class="cares-button-primary" @click="bindSendEmail">发送验证邮件</span>
                </div>
            </div>

            <div v-else class="fill-email-ending">
                <span @click="bindToCloseModel" class="cares-model-close"></span>
                <div>邮件发送成功</div>
                 <span class="success-email-icon regist-success "></span>
                <p>激活邮箱已经发至：</p>
                <p><span class="cares-color">{{form.email}}</span></p>
                <p>请进入邮箱查看邮件，并点击邮件中的链接绑定邮箱。</p>
                <h3>没收到邮件？</h3>
                 <ul>
                    <li>1. 请检查邮件地址是否正确，或<span @click="bindToReWrite" class="cares-color">重新填写</span> </li>
                    <li>2. 检查邮箱中的垃圾邮件</li>
                    <li>3. 若仍未收到，请尝试<span @click="bindSendEmail" class="cares-color">重新发送</span></li>
                </ul>
            </div>
        </AdminModel>
        <!-- 固定在右侧的客服电话 -->
        <div class="fixInTheRight">
            <span class="phone-icon"></span>
            <div class="code-container">
                <p>客户服务</p>
                <p class="cares-color">400-887-0201</p>
                <span class="cares-wechatCode"></span>             
            </div>
        </div>
        <!-- 试图容器 -->
        <router-view id="Loading" class="banner carespay-container" @transToApp="bindToReceiveParams"></router-view>
        <!-- 底部广告-->
        <div class="fixInTheBottom"  v-if="$route.name != 'FastArrival'  && isHasBottomAd">
            <span class="el-icon-error close" @click="closeRooper('isHasBottomAd')"></span>
            <div class="banner content">
                <span class="img-left"></span>
                <div>
                    <p class="title"> <i></i> <span>闪提宝</span>Amazon — 出账即可提款</p>
                    <p class="descript">180天闪提宝免费特权<span>活动时间：{{flashWithdraw.startTime | formatData}}~{{flashWithdraw.endTime | formatData}}</span></p>
                    <router-link to="/FlashWithdraw"  class="cares-button-primary pain">抢先领取</router-link>
                </div>
                <span class="img-right"></span>
            </div>
        </div>
    </div>
</template>


<script>

    import { 
        getflashWithdrawNotice,
        queryFreeWithdraw,
        emptyMessage,
        updateMessageInfo,
        sendActiveEmail,
        queryProvince,
        queryAllStroe,
        isFristLogin,
        getFixBottomAD,
        logout              //安全退出
    } from './../../js/api.js';

    import { cookie,formatTimer } from "./../../js/common.js";

    import DOMAIN from '../../js/domain.js';

    import {
        queryCustomerInfo,      //客户信息
        queryPersonInfo,        //实名认证
    } from './utils/localbase.js';


    import VERICATION from './../../js/verification.js';

    import AdminModel from './../../components/adminModel.vue';

    import AuthenticationWarning from './view/Other/AuthenticationWarning.vue';

    
    import $ from 'jquery';

    let _valt = {
        init:function(self){
            this._event.bindShowEmailModal(self);
        },
        _event:{
            bindShowEmailModal(self){
                
                $(document).on('click','a.bindEmail',function(){
                    self.isToFillEmail = true;
                });
            }
        }
    };
    

    export default {
        data(){
          return{
                isHasStore:false,
                isHasBottomAd:false,
                isShowAd:false,
                cusomerInfo:null,
              //2018-12-14 流程优化
                timer:{
                    d:"--",
                    h:"--",
                    m:"--",
                    s:"--"
                },
                noticeBox:[],

                //绑定邮箱
                rooper:true,
                 AjaxIng:false,
                sendEmainEnding:false,
                isToFillEmail:false,
                form:{
                    phoneNo:'',
                    email:''
                },

                flashWithdraw:{
                    startTime:'',
                    endTime:'',
                    activatDay:'',
                },
          }  
        },
        components:{
            AdminModel,
            AuthenticationWarning,
        },
        created() {
            queryAllStroe().then(resp=>{
                 if(!resp.data.length){
                     this.isHasStore = false;
                 }else{
                     this.isHasStore = true;
                 }
            }).catch(error=>{
                
            });

            queryCustomerInfo().then(res=>{
                this.cusomerInfo = res;
                
                for (const key in this.form) {
                    this.form[key] = res[key];
                }
               
            });


        },
        mounted(){
            let IsIE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
             if (IsIE) {
                window.addEventListener('hashchange', () => {
                    let currentPath = window.location.hash.slice(1)
                    if (this.$route.path !== currentPath) {
                        this.$router.push(currentPath)
                    }
                }, false)
             };

             _valt.init(this);

            //2018-12-17 用户首次登陆提示3000免费提现额度
            setTimeout(()=>{
                isFristLogin().then(res=>{
                    if(res.code==0){
                        res.data==0 && this.USERFIRSTLOGIN();
                    }
                });
            },500); 

        },
        methods:{
            //用户首次登录
            USERFIRSTLOGIN(){
                //1.判断是否展示3000免费额度广告
                this.bindCheckShowAd();
                //2.是否展示页面底部广告
                this.isShowBottomAd();
            },

            isShowBottomAd(){
                getflashWithdrawNotice({type:1}).then(res=>{
                    if(res.code==0){
                        //如果可以领取才能展示广告图
                        if(res.data && res.data.isShow){
                            this.flashWithdraw.activatDay = res.data.activatDay
                            return getFixBottomAD()
                        };
                    }else{
                        this.$Message.error(res.code);
                    }
                }).then(res=>{
                    if(!res) return;

                    if(res.code==0){
                        res.data && (this.isHasBottomAd = true,Object.assign(this.flashWithdraw,res.data));
                    }else{
                        this.$Message.error(res.code);
                    }
                });
            },
            //退出登录
            bindLayoutAccount(){
                logout().then(res=>{
                    res.code==0 ?
                       ( location.href = DOMAIN.login) :
                       (this.$Message.error(res.msg));
                });
            },
            bindPopcancel(){
                this.$store.commit('changeModleState',false);
            },
            //实名提示弹窗确认
            bindPopconfirm(){
                this.bindPopcancel();
                this.bindCloseAutoPayTip();
                location.hash = "/Complete_Account";
            },
            //跳转到提现账户中心
            bindToCashAccount(){
                location.hash = "/cashaccount";
            },
            //去体现按钮
            bindWithdrawCash(){
                location.hash = "/cash";
            },
            //点击添加商铺按钮
            bindToAddStore(){
                //  location.hash = "/addshop";
                queryPersonInfo().then(res=>{
                    if(res){
                        //审核失败
                        if(res.status==3) {
                            return this.$store.commit('changeAppModel',{
                                name:'AuthentyIsError',
                                value:true
                            });
                        };

                        this.$router.push({
                            name:"Reflesh",
                            params:{
                                name:"AddShop"
                            }
                        });
                    }else{
                        this.$store.commit('changeModleState',true);
                    }
                });
               
            },
            bindToFillName(){
                this.isShowAd = false;
                this.$router.push({name:'CompleteAccount'});
            },
            //检查是否要展示免费领取的额度
            bindCheckShowAd(){

                 //七天的毫秒
                 let activeT = 7*24*60*60*1000,
                    creaT = this.cusomerInfo.createdTime,//创建账号时间
                    endT = creaT + activeT, //截止时间

                    nowT = new Date().getTime();//当前时间

                queryFreeWithdraw().then(res=>{
                    if(res.code==0){
                        //0 待领取 1 已领取 2 已失效
                        res.data.status==0 ? (
                            //如果已经实名认证就不弹
                            queryPersonInfo().then(inneres=>{
                                inneres ? 
                                (this.isShowAd = false)
                               : (this.isShowAd = true,_time(endT-nowT));
                            })

                        ):(this.isShowAd = false)
                        
                    }else{
                        this.$Message.error(res.msg);
                        this.isShowAd = false;
                    }
                });



                let _this = this;

                let _time = function(timeing){
                   
                    let downT = setInterval(function(){
                        timeing -= 1000;

                        if(timeing<=0){
                            clearInterval(downT);
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


            },
            bindCloseADmodel(){
                this.isShowAd = false;
            },
            bindCheckAllNotice(){
                this.$router.push({name:'NoticeBox'});
            },
            // 自组装件传递过来的参数
            bindToReceiveParams(params){
                switch(params.type){
                    //消息盒子
                    case 'NT':{
                        let msg = [];
                        params.data.forEach(item=>{
                            if(item.boxcontent != null){
                                msg.push({
                                   boxcontent:item.boxcontent, 
                                   content:item.content, 
                                   type:item.type, 
                                })
                            }
                        });
                        // 消息盒子的数组
                        // this.noticeBox = msg; 
                        this.$store.commit('setNotifyData',msg);

                    }break;
                    case 'NT-DE':{//消息盒子删除对应的消息
                        this.bindNewClick(params.data)
                    }break;
                    //邮箱
                    case 'EM':{ this.isToFillEmail = params.data }break;
                }
                
            },
            bindSendEmail(){
                if(!VERICATION('email',this.form['email'])) return;

                if(this.AjaxIng) return;
                this.AjaxIng = true;
                //激活邮箱
                sendActiveEmail(this.form).then(res=>{
                    this.AjaxIng = false;
                    if(res.code==0){
                        //发送激活邮箱成功
                        this.sendEmainEnding = true;
                        this.$Message.success("邮件发送成功");
                    }else{
                        this.$Message.error(res.msg);
                    }

                });
            },
             bindToCloseModel(){
                this.isToFillEmail = false;
                this.sendEmainEnding = false;
            },
            bindToReWrite(){
                this.sendEmainEnding = false;
            },
            //点击当前消息盒子
            bindNewClick(type){

                if(type=='All'){//清空所有

                    emptyMessage().then(res=>{
                         if(res.code==0){
                            this.$store.commit('setNotifyData',[]);
                        }
                    })

                }else{

                    updateMessageInfo({messageNo:type}).then(res=>{
                        if(res.code==0){

                            this.$store.state.notifyData.forEach((item,index)=>{
                                if(item.type==type){
                                    this.$store.state.notifyData.splice(index,1);
                                };
                            });
                        }
                    });

                }
                
                
            },
            //
            bindCloseAutoPayTip(){
                this.$store.commit('changeAppModel',{
                    name:'APPWARNINGPOP',
                    value:false
                });
            },

            bindAuthentiConfirm(){
                location.hash="/Pesonal/realname?isactive=1";
            },

            closeRooper(prop){
                this[prop] = false;
            }

        },
        computed:{
            STORESTATE(){
                return this.$store.state;
            }
        },
        filters:{
            formatData(value){
                return formatTimer(value,true)
            }
        }
    }
</script>


<style lang="scss" scoped>
@import './../../css/common/theme.scss';
  $primary:$--color-primary-two;

    .ad-model-container{
        background-color: rgba(0,0,0,.5);
        .cares-model-close{
            position: absolute;
            top: -30px;
            right: 20px;
            cursor: pointer;
        }
    }

    .fill-email-container{
            width:  440px;;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -205px;
            margin-left: -220px;
            background-color: #fff;
            // background: #fff url('../../../../images/carepay/ad_bg.png') no-repeat center center;
            border-radius: 8px;
            padding: 60px 60px 40px; 
            h2{
                width: 100%;
                text-align: center;
                margin:  0 auto;
                color: #333;
                font-weight: normal;
                // font-size: 20px;
                margin-bottom: 60px;
            }
            .line{
                width: 100%;
                padding-left: 73px;
                padding-bottom: 20px;
                border-bottom: 1px solid $primary;
            }
            .nt{
                color: #aaa;
                font-size: 13px;
                margin-bottom: 0;
            }
            p{
                width: 100%;
                margin:  0 auto;
                text-align: left;
                margin-bottom:10px;
                color: #666;
                font-size: 14px;
                .el-input{
                    width: 100%;
                }
                span{
                    display: inline-block;
                    width: 80px;
                    margin-right: 10px;
                    text-align: left;
                }
            }
            .btn-container{
                text-align: center;
                margin-top: 40px;
            }
            .cares-button-primary{
                width: 50%;
                text-align: center;
            }
    }

    .fill-email-ending{
            width: 440px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -265px;
            margin-left: -220px;
            border-radius: 8px;
            text-align: center;
            padding-bottom: 20px;
            padding-top: 5px;
            background-color: #fff;
            .regist-success{
                display: inline-block;
                width: 60px;
                height: 60px;
                margin-bottom: 20px;
                // font-size: 100px;
                color: $--color-primary-success;
            }
            div{
                color: #333;
                height: 80px;
                line-height: 80px;
                font-size: 24px;
            }
            p{
                color: #999;
                font-size: 14px;
                padding: 0 20px;
                text-align: left;
                line-height: 24px;
                // margin-bottom: 10px;
            }
            h3{
                line-height: 40px;
                height: 40px;
                color: #999;
                font-weight: normal;
                text-align: left;
                padding: 0 20px;
                font-size: 14px;
                margin-top: 20px;
            }
            li{
                font-size: 14px;
                line-height: 24px;
                text-align: left;
                color: #999;
                padding: 0 20px;
            }
    }

    .AutoPay-model{
        background-color: #fff;
        width: 400px;
        border-radius: 8px;
        text-align: center;
        padding-top: 65px;
        padding-bottom: 20px;
        h2{
           font-size: 20px;
           font-weight: normal;
           color: #333;
           margin-bottom: 20px;
        }  
        p,ul{
            width: 82%;
            font-size: 14px;
            color: #333;
            margin: 0 auto;
            margin-bottom: 5px;
            text-align: left;
         }

        ul{
            margin: 20px auto;
            color: $--color-primary-one;
        }

         .pop-button{
             margin-top: 40px;
             text-align: center;
         }
    }

    .windowNotice{
        background-color: #ea5413;
        padding-top:5px;
        padding-bottom:5px;
        color: #fff;
        position: relative;
        .banner{
            overflow: hidden;
            span{
                display: inline-block;
                min-width: 100%;
                transform: translate(100%);
                font-size: 14px;
                animation: rooper  20s linear infinite;
                white-space: nowrap;
            }
        }
        .close{
            width: 20px;
            height: 20px;
            position: absolute;
            right: 20px;
            top: 50%;
            margin-top: -10px;
            cursor: pointer;
            background: url('../../images/icon/close.svg') no-repeat center center;
            background-size: 100% 100%;
        }
    }

    .hasBottomAd{
        padding-bottom: 160px;
    }

    .fixInTheBottom{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 70px;
        background: linear-gradient(to bottom,#FFA213,#FFC430);
        .close{
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            top: 6px;
            right: 6px;
            font-size: 20px;
            color: #fff;
            cursor: pointer;
        }

        .content{
            position: relative;
            div{
                display: inline-block;
                vertical-align: top;
                margin-left: 100px;
                color: #fff;
                margin-top: 9px;
                position: relative;
                .title{
                    vertical-align: middle;
                    i{
                        display: inline-block;
                        width: 27px;
                        height: 30px;
                        vertical-align: middle;
                        background: url('./../../images/carepay/闪提宝-白.png') no-repeat center center;
                        background-size: 100% 100%;
                    }
                    span{
                        font-size: 24px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        margin-right: 10px;
                        vertical-align: middle;
                    }
                }
                .descript{
                    font-size: 14px;
                    margin-top: 5px;
                    span{
                        margin-left: 20px;
                    }
                }

                .cares-button-primary{
                    position: absolute;
                    right: -200px;
                    top: 14px;
                    border:none;
                }
            }
        }

        .img-left{
            display: inline-block;
            width: 227px;
            height: 96px;
            margin-top: -26px;
            // margin-left: -100px;
            background: url('./../../images/carepay/app底部图片.png') no-repeat 0 0;
        }

        .img-right{
            position: absolute;
            right: 0;
            bottom: 0;
            display: inline-block;
            width: 79px;
            height: 57px;
            background: url('./../../images/carepay/app底部图片.png') no-repeat -1184px -39px;
        }
    }

    @keyframes rooper {
        0%{
            transform: translate(100%);
        }
        100%{
            transform: translate(-100%);
        }
    }
</style>



<style lang="scss">
@import './../../css/common/theme.scss';
    // 头部
    .cares-header{
        height: 140px;
        background-color: #fff;
        margin-bottom: 10px;
         min-width: 1000px;
         border-bottom: 1px solid #F8F8F8;
    }
    // logo部分
    .logo{
        margin-top: 20px;
        margin-bottom: 40px;
        display: inline-block;
        vertical-align: top;
        img{
            vertical-align: top;
        }
    }
    // logo下方的tab切换
    .mainTab{

        .innerTab{
            background-color:#fff;
            position: absolute;
            top :100%;
            left:50%;
            width :100px;
            z-index: 10;
            margin-left:-50px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            display: none;
            a{
                display: inline-block;
                padding:10px 10px;
            }
        }
       
        >li{
            float: left;
            font-size: 16px;
            margin-right: 35px;
            position: relative;
            &:hover{
                .innerTab{
                    display: block;
                }
            }
            a{
                color: #666;
                &:hover,&.router-link-active{
                    color: $--color-primary-one;
                }
            }
           
            >span{
                display: inline-block;
                width:1px;
                height:20px;
                background-color:#ddd;
                vertical-align: middle;
            }
        }
    }

    //顶部账号中心和帮助中心
    .top-menu{
        margin-top: 33px;
        li{
            float: left;
            margin-left: 50px;
            font-size: 14px;
            position: relative;
            >a{
                color: #666;
                &.router-link-active{
                    color: $--color-primary-one;
                }
            }
            span{
                color: #666;
                cursor: pointer;
               
            }
            i{
                margin-left: 5px;
                display: inline-block;
                margin-top: -2px;
                color: #666;
                border-width: 7px 5px 0 4px;
                border-style: solid;
                border-color: #888 transparent transparent transparent;
                height: 0px;
            }
            &:hover{
                >a,>span{
                    color: $--color-primary-one;
                }
                .sub-menu{
                    display: block;
                }
                .msg-box{
                    display: block;
                }
            }

            >b{
                position: absolute;
                // width: 16px;
                height: 16px;
                 line-height: 16px;
                color: white;
                display: inline-block;
                background-color: $--color-primary-one;
                font-size: 12px;
                font-weight: normal;
                border-radius: 4px;
                top: -6px;
                right: -9px;
                text-align: center;
                padding: 0 2px;
                min-width: 12px;
            }
        }
        .sub-menu{
            position: absolute;
            width: 180px;
            text-align: left;
            right: 0;
            background-color: #fff;
            display: none;
            z-index: 10;
            // border: 1px solid #f5f5f5;
            box-shadow:0 0 10px 0 rgba(0,0,0,.1);
            p{
                height: 50px;
                line-height: 50px;
                cursor: pointer;
                font-size: 14px;
                color: #333;
                border-bottom: 1px solid #f5f5f5;
                &:hover{
                     color: $--color-primary-one;
                    // background-color: $--color-primary-one;
                    a,span{
                        color: $--color-primary-one;
                    }

                    .cares-icon-per{
                        background:url('./../../images/icon/下拉-个人中心-hover.png')  no-repeat center center;
                    }
                    .cares-icon-conpon{
                        background:url('./../../images/icon/下拉-优惠券-hover.png')  no-repeat center center;
                    }
                    .cares-icon-authenty{
                        background:url('./../../images/icon/下拉-实名认证-hover.png')  no-repeat center center;
                    }
                    .cares-icon-bank{
                        background:url('./../../images/icon/下拉-提现账户-hover.png')  no-repeat center center;
                    }
                    .cares-icon-logout{
                        background:url('./../../images/icon/下拉-安全退出-hover.png')  no-repeat center center;
                    }
                }

                b{
                    display:inline-block;
                    width:24px;
                    height:24px;
                    margin: 0 20px;
                    margin-bottom:-7px;
                }
                .cares-icon-per{
                    background:url('./../../images/icon/下拉-个人中心.svg')  no-repeat center center;
                        background-size: 28px;
                }
                .cares-icon-conpon{
                    background:url('./../../images/icon/下拉-优惠券.svg')  no-repeat center center;
                        background-size: 28px;
                }
                .cares-icon-authenty{
                    background:url('./../../images/icon/下拉-实名认证.svg')  no-repeat center center;
                        background-size: 28px;
                }
                .cares-icon-bank{
                    background:url('./../../images/icon/下拉-提现账户.svg')  no-repeat center center;
                        background-size: 28px;
                }
                .cares-icon-logout{
                    background:url('./../../images/icon/下拉-安全退出.svg')  no-repeat center center;
                        background-size: 28px;
                }
            }
            a{
                font-size: 14px;
                color: #333;
                display: inline-block;
                height: 100%;
                width:100%;
                &.router-link-active{
                    color: #333;
                }
            }
        }
        .msg-box{
            width: 300px;
            position: absolute;
            top: 100%;
            right: 0;
            border: 1px solid #dddddd;
            z-index: 6;
            background-color: #fff;
             display: none;
             li{
                 width: 100%;
                 margin: 0;
             }
            li.news{
                color: #333;
                font-size: 14px;
                padding: 10px 20px;
                border-bottom: 1px solid #f5f5f5;
                &:hover{
                    color: #fff;
                    background-color: $--color-primary-two;
                    a{
                        color:#fff;
                    }
                }
                 
                a{
                    display: inline-block;
                    line-height: 20px;
                    color: #333;
                    font-size: 14px;
                    width: 100%;
                    border-bottom:none;
                    &:hover{
                        color: #fff;
                        background-color: $--color-primary-two;
                    }
                }
                
            }
            .msg{
                padding: 10px 20px;
                color: #333;
                font-size: 16px;
                height: 52px;
                line-height: 32px;
                border-bottom: 1px solid #dddddd;
                em{
                    font-style: normal;
                    font-size: 12px;
                    color: #a1a1a1;
                    cursor: pointer;
                    &:hover{
                        color: $--color-primary-one;
                    }
                }
            }
            .all{
                height: 52px;
                line-height: 52px;
                text-align: center;
                color: #333;
                font-size: 14px;  
            }

            .empty{
                height: 250px;
                width: 100%;
                text-align: center;
                span{
                    display: inline-block;
                    width: 210px;
                    height: 183px;
                    background: url('./../../images/carepay/msg_empty.png') no-repeat center center;
                    margin-bottom: 20px;
                }
            }
        }
    }
    
    .handle-button{
        margin-top: 35px;
        span.cares-button-primary{
            width: 90px;
            // height: 34px;
            // line-height: 34px;
            margin-left: 15px;
            text-align:center;
            font-size:15px;
            border-radius:17px;
            // box-shadow:0 1px 10px 0  rgba(0,0,0,.2);
        }
    }
    // 试图容器的样式
    .carespay-container{
        margin-bottom: 10px !important;
        >div{
            padding: 0 30px;
        }
        div{
            background-color: #fff;
        }
    }

    //温馨提示--去完善资料
    .caras-reminder{
        
        .el-popper{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 50;
            background-color: rgba(0,0,0,.5);
            box-shadow: 0;
            border:0;
           .popover-content{
               width: 400px;
               height: 410px;
               position: absolute;
               top: 100px;
               left: 50%;
               margin-left: -200px;
               border-radius: 8px;
               background-color: #fff;
               text-align: center;
               padding-top:65px;
               h2{
                   font-size: 20px;
                   font-weight: normal;
                   color:#333;
                   margin-bottom:10px;
               }
               i{
                   margin-bottom:30px;
               }
               p{
                   font-size: 14px;
                   color: #333;
               }
               .pop-button{
                   position: absolute;
                   bottom: 40px;
                   width: 100%;
                    span{
                        width: 160px;
                        height: 30px;
                        line-height: 30px;
                        margin-right:10px;

                        cursor: pointer;
                    }
               }
               .el-button{
                   width: 133px;
               }
                .el-upload{
                    width: 100%;
                    .el-upload-dragger{
                            width: 100%;
                            &:hover{
                                border-color:$--color-primary-two;
                            }
                    }
                 }
           }
        }
    }

    .not-name-authenty{
         display: inline-block;
         width: 102px;
         height: 100px;
         background: url('../../images/carepay/完善信息.png') no-repeat center center;
         background-size: 100% 100%;
         margin: 26px 0 10px;
     }

    //3000元免费额度广告宣传
    .ad-model-container{
        // display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0,0,0,.5);
        &.active{
            display: block;
        }
        .ad-inner-content{
            width: 866px;
            height: 434px;
            background: #fff url('./../../images/carepay/ad_bg.png') no-repeat center center;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -433px;
            margin-top: -217px;
            border-radius: 8px;
            text-align: center;
            .cares-model-close{
                 position: absolute;
                 top: -30px;
                 right: 20px;
                 cursor: pointer;
            }
            ul{
                margin-top: 230px;
                text-align:left;
                padding-left:68px;
                .text-center{
                    text-align:center;
                }
                li{
                    width:306px;
                    font-size: 14px;
                    color: #fff;
                    // font-weight: 600;
                    vertical-align: middle;
                    a{
                        display: inline-block;
                        width: 100px;
                        height: 36px;
                        border-radius: 18px;
                        color: white;
                        background: linear-gradient(to right,#FF8A0A,#FD5346);
                       
                        text-align: center;
                        line-height: 36px;
                        font-size: 17px;
                        font-weight: normal;
                        margin-bottom:20px;
                        transition:all .2s;
                        &:hover{
                             box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                        }
                    }
                }
                .time-out{
                    height: 50px;
                    border-radius:25px;
                    background-color:rgba(255,255,255,.5);
                    text-align:center;
                    color:#FF5A45;

                    line-height: 50px;
                    font-size: 20px;
                    margin-bottom: 20px;
                    margin-top: 5px;
                }
                .btn-box-container{
                    margin-top: 10px;
                }
            }
        }
    }

    .app-autopay-model{
        .modal-container{
            left: 50%;
            margin-left: -200px;
            p{
                font-size:14px;
            }
           
            .pop-button{
                 .cares-button-primary{
                    font-size:14px;
                    width:160px;
                }
                span{
                    cursor: pointer;
                    font-size:12px;
                    margin-bottom:10px;
                }
            }
        }
    }

    .email-adminmodel-container{
        .modal-container{
            left: 50%;
            top: 50%;
            margin-left: -150px;
            .cares-model-close{
                position: absolute;
                right: 20px;
                top: -30px;
            }
        }
    }
</style>


