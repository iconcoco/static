
import AdminIndex from './../view/index/adminIndex.vue';
/*** 店铺管理模块 ***/
import StoreManage from './../view/Store/StoreManage.vue';//首页店铺管理
import ShopDetail from './../view/Store/StoreDetaile.vue';//店铺详情
import AddStore from './../view/Store/AddStore.vue';//添加绑定店铺
import Complete_Account from './../view/Authentication/Complete_Account.vue';      //完善账户类型选择
import Complete_bankAccount from './../view/AccountManage/AddCashAccount.vue';  //完善资料后添加银行卡账户
import Cash from './../view/AccountManage/Withdrawal.vue'; //可提现的店铺

import AuthenticationPersonal from './../view/Authentication/AuthenticationPersonal.vue';
import AuthenticationCompany from './../view/Authentication/AuthenticationCompany.vue';

/*** 提现账号管理模块 ***/
import CashAccountContainer from './../view/AccountManage/CashAccountContainer.vue';    

/*** 帮助中心模块 ***/
import help from './../view/Help.vue';

/*** 个人中心模块 ***/
import Pesonal from './../view/UserCenter/Pesonal.vue';//个人中心模块
import AccountCenter from './../view/UserCenter/AccountCenter.vue';//账号中心对应组件
import BingWeiXin from './../view/UserCenter/BingWeiXin.vue';//绑定微信组件
import ModifyPassword from './../view/UserCenter/ModifyPassword.vue';//修改密码组件
import ModifyPhone from './../view/UserCenter/ModifyPhone.vue';//修改手机组件
import ModifyEmail from './../view/UserCenter/ModifyEmail.vue';//修改邮箱组件
import RealName from './../view/UserCenter/Real-name.vue';//实名认证对应的组件
import InvitationFriend from './../view/UserCenter/InvitationFriend.vue';//邀请朋友组件
import CustomerCoupon from './../view/UserCenter/CustomerCoupon.vue';//我的优惠券

/*** 明细查询模块 ***/
import FinanceContainer from './../view/Bill/FinanceContainer.vue';

/***  全部应用&自动提现 ** */
import AutoPay from './../view/AppFn/AutoPay.vue';
import FastArrival from './../view/AppFn/FastArrival.vue';
import AllApp from './../view/AppFn/AllApp.vue';
import VAT from './../view/VAT/VAT.vue';
import ApplayBox from './../view/VAT/Apply/ApplayBox.vue';
import ReportBox from './../view/VAT/BEForm/ReportBox.vue';
import PayTaxBox from './../view/VAT/PayTax/PayTaxBox.vue';

/**Other**/ 

import P404 from './../view/Other/404.vue';
import Reflesh from './../view/Other/Reflesh.vue';
import NoticeBox from './../view/Other/NoticeBox.vue';
import AD from './../view/Other/AD.vue';

import AuthenSucess from './../view/Other/AuthenDone.vue';




let routes = [
    //根目录
    { path: "/", redirect: '/index' },
    //404
    { path: "/404",name:'P404',component:P404 },
    { path: "/RF",name:'Reflesh',component:Reflesh },
    //通知
    // { path: "/notice",name:'NoticeBox',component:NoticeBox },
    //自动支付
    { path: "/AutoPay",name:'AutoPay',component:AutoPay },
    //极速达
    { path: "/FlashWithdraw",name:'FastArrival',component:FastArrival },
    //VAT
    { path: "/vat",name:'VAT',component:VAT },
    { path: "/vat/apply",name:'VATapply',component:ApplayBox },
    { path: "/vat/report",name:'VATreport',component:ReportBox },
    { path: "/vat/payTax",name:'VATpay',component:PayTaxBox },
    //全部应用
    { path: "/AllApp",name:'AllApp',component:AllApp },
    //广告
    { path: "/ADMD/:type",name:'AD',component:AD },

    {path:'/index', name:'AdminIndex',component:AdminIndex},
    /*** 店铺管理  ***/
    { path: '/storemanage',name:'StoreManage', component: StoreManage },
    //店铺管理 -- 店铺详情
    { path: '/shopdetail/:id',name:'ShopDetail', component: ShopDetail },
    //店铺管理 -- 添加店铺
    { path: '/addshop',name:'AddShop', component: AddStore },
    //完善资料--完善账号资料
    { path: '/Complete_Account',name:'CompleteAccount', component: Complete_Account },
    { path:"/AuthenticationPersonal",name:'AuthenticationPersonal',component:AuthenticationPersonal },
    { path:"/AuthenticationCompany",name:'AuthenticationCompany',component:AuthenticationCompany },
    { path:"/AuthenticationDone",name:'AuthenticationDone',component:AuthenSucess },

    //完善资料--实名认证--银行账号
    { path: '/Complete_bankAccount',name:'CompletebankAccount', component: Complete_bankAccount },
    //提现
    { path: '/cash',name:'Cash', component: Cash },
    


     /*** 明细查询  ***/
    {path: '/finance',name:'bill', component: FinanceContainer},

    /*** 提现账户模块 ***/
    { path: '/cashaccount', name:'CashAccountContainer', component: CashAccountContainer },

    /*** 帮助中心 ***/
    { path: '/help',  name:'help',component: help },
    
    
    /*** 个人中心模块 ***/
    { 
        path:'/Pesonal', 
        component: Pesonal,
        // name:"Pesonal",
        //个人中心子路由
        children:[
            //个人中心模块-->账号中心
            { path: '/', redirect: '/Pesonal/accountcenter' },
            { path: '/Pesonal/accountcenter', name:'AccountCenter', component: AccountCenter,},
            //绑定微信
            {path:'/Pesonal/bingweixin',name:'BingWeiXin', component: BingWeiXin },
            //修改密码
            {path: '/Pesonal/modifypassword',name:'ModifyPassword', component: ModifyPassword },
            //修改手机
            {path:'/Pesonal/modifyphone',name:'ModifyPhone', component: ModifyPhone },
            //修改邮箱
            {path:'/Pesonal/modifyemail', name:'ModifyEmail',component: ModifyEmail },
            //个人中心模块-->实名认证
            { path: '/Pesonal/realname',name:'RealName', component: RealName },
            //个人中心模块-->邀请朋友
            { path: '/Pesonal/invitationfriend',name:'InvitationFriend', component:InvitationFriend },
            //优惠券
            { path: '/Pesonal/Coupon',name:'Coupon', component: CustomerCoupon },
        ]
      
    },
   
]

export default routes;