import Login from './../view/login.vue';
import weChatLogin from './../view/weChat.vue';

import RegistContainer from './../view/RegistContainer.vue';
import Regist from './../view/Regist.vue';
import RegistConsummate from './../view/RegistConsummate.vue';
// import RegistAddStore from './../view/RegistAddStore.vue';
import forgot from './../view/forgot.vue';                      //找回密码
import Reset from './../view/ResetPsw.vue';                     //重置密码
import ActiveEmail from './../view/activeEmail.vue';            //激活邮箱
import page404 from './../../../components/404.vue';            //
import serviceAgreement from './../view/other/ServiceAgreement.vue';            //服务条款
import privacyAgreement from './../view/other/privacyAgreement.vue';            //保密协议
import amazonMWS from './../view/other/amazonMWS.vue';            //3个key
import exportOrder from './../view/other/exportOrder.vue';            //3个key
import flashWithdrawIntro from './../view/other/flashWithdrawIntro.vue';            //3个key
import VATmaterial from './../view/other/VATmaterial.vue';            //vat所需资料

import ebayAuthorization from './../view/ebayAuthorization.vue';  //2018-10-25 增加ebay渠道获取ebay的验证结果




export default [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/weChatLogin', component: weChatLogin },
    { path: '/serviceAgreement', component: serviceAgreement },
    { path: '/privacyAgreement', component: privacyAgreement },
    { path: '/amazonMWS', component: amazonMWS },
    { path: '/ebayAuthorization', component: ebayAuthorization },
    { path: '/exportOrder', component: exportOrder },
    { path: '/flashWithdrawIntro', component: flashWithdrawIntro },
    { path: '/vat/:code', component: VATmaterial },

    { path: '/activeEmail', component: ActiveEmail },
    { path: '/404', component: page404 },
    //注册页面
    {
        path: '/regist',
        component: RegistContainer,
        redirect: '/regist/',
        children: [
            { path: '/regist/',name:'Regist', component: Regist }, //注册主页
            { path: '/regist/Consummate/:phoneNo', component: RegistConsummate }, //注册--完善邮箱
            // { path: '/regist/AddStore/:customerNo', component: RegistAddStore }, //注册--添加店铺
            { path: '/regist/forgot', component: forgot }, //找回密码
            { path: '/regist/reset', component: Reset }, //重置密码
        ]
    },
]