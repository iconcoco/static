/**
 * 1. 登录注册页面组件
 */
import loginContainer from '../../views/login/loginContainer.vue';
import login from '../../views/login/login.vue';
import forgot from '../../views/login/forgot.vue';
import regist from '../../views/login/regist.vue'



/**
 * 2. 后台系统页面
 */

import mainBox from '../../views/admin/admin.vue';
import adminIndex from '../../views/admin/index/index.vue';

import TMonthCSD from '../../views/admin/index/TMonthCSD.vue';
import TMouthUSER from '../../views/admin/index/TMouthUSER.vue';
import TMouthSTORY from '../../views/admin/index/TMouthSTORY.vue';
import TMouthSOURCE from '../../views/admin/index/TMouthSOURCE.vue';


//2.1 合规模块
import KYC from '../../views/admin/compliance/kyc.vue';
import KYCList from '../../views/admin/compliance/kycList.vue';
import AccountList from '../../views/admin/compliance/accountList.vue';
import customerRisk from '../../views/admin/compliance/customerRisk.vue';
import storeRisk from '../../views/admin/compliance/storeRisk.vue';
import customerRiskPersonal from '../../views/admin/compliance/customerRiskDetail_Personal.vue';
import customerRiskCompany from '../../views/admin/compliance/customerRiskDetail_Company.vue';
import storeRiskDetail from '../../views/admin/compliance/storeRiskDetail.vue';
import suspiciousReport from '../../views/admin/compliance/suspiciousReport.vue';
import suspiciousReportDetail from '../../views/admin/compliance/suspiciousReportDetail.vue';


//2.2 客户管理模块
import customeInfo from '../../views/admin/customer/customerInfo.vue';
import customerLose from '../../views/admin/customer/customerLose.vue';
import customerRate from '../../views/admin/customer/customerRate.vue';
import customerBalance from '../../views/admin/customer/customerBalance.vue';

import customerBalanceDetails from '../../views/admin/customer/customerBalanceDetails.vue';
import customerDetails from '../../views/admin/customer/customerDetails.vue';
import customerSetRate from '../../views/admin/customer/customerSetRate.vue';

// import customeConfig from '../../views/admin/customer/config.vue';

//2.3 财务模块
import financeForm from '../../views/admin/Finance/financeForm.vue';
import withdrawRecord from '../../views/admin/Finance/withdrawRecord.vue';
import withdrawDetailes from '../../views/admin/Finance/withdrawDetailes.vue';
import SpareGold from '../../views/admin/Finance/SpareGold.vue';
import SettlementList from '../../views/admin/Finance/SettlementList.vue';
import IbcBillList from '../../views/admin/Finance/IbcBillList.vue';
import PlatformBilling from '../../views/admin/Finance/PlatformBilling.vue';
import salesCommission from '../../views/admin/Finance/salesCommission.vue';
import hkBankRemit from '../../views/admin/Finance/hkBankRemit.vue';
import hkBankArrival from '../../views/admin/Finance/hkBankArrival.vue';
import hkRemitDetails from '../../views/admin/Finance/hkRemitDetails.vue';
import IbcBillDetails from '../../views/admin/Finance/IbcBillDetails.vue';
import vatBalance from '../../views/admin/Finance/vatBalance.vue';  //入账
import vatBalanceDetail from '../../views/admin/Finance/vatBalanceDetail.vue';  //入账
import vatBalanceTaxDetails from '../../views/admin/Finance/vatBalanceTaxDetails.vue';  //入账
import vatBilling from '../../views/admin/Finance/vatBilling.vue';  //入账
import vatBillingDetail from '../../views/admin/Finance/vatBillingDetail.vue';  //入账

//2.4 权限管理
// import UserRight from '../../views/admin/User/UserRight.vue';
import role from '../../views/admin/User/role.vue';
import Resource from '../../views/admin/User/Resources.vue';
import staffManagement from '../../views/admin/User/staffManagement.vue';

import AuthTree from '../../views/admin/User/AuthTree.vue';

//2.5 运营模块
import subAccount from '../../views/admin/operate/subAccount.vue';
import channelAdmin from '../../views/admin/operate/channelAdmin.vue';
import spokesman from '../../views/admin/operate/Spokesman.vue';
import SpokesmanWithdraw from '../../views/admin/operate/SpokesmanWithdraw.vue';
import spokesmanWithdrawDetails from '../../views/admin/operate/withdrawDetails.vue';
import spokesmanMonitoring from '../../views/admin/operate/monitoring.vue';
import eBayOrder from '../../views/admin/operate/eBayOrder.vue';
import Advertisement from '../../views/admin/operate/Advertisement.vue';
import minProgram from '../../views/admin/operate/minProgram.vue';

//2.6  店铺管理模块
import storeInfo from '../../views/admin/store/storeInfo.vue';
import storeDetails from '../../views/admin/store/storeDetails.vue';
import storeBalance from '../../views/admin/store/storeBalance.vue';
import storeBalanceDetails from '../../views/admin/store/storeBalanceDetails.vue';
import storeLose from '../../views/admin/store/storeLose.vue';
import lightningWithdraw from '../../views/admin/store/lightningWithdraw.vue';


//2.7  销售管理模块
import saleBalance from '../../views/admin/sales/saleBalance.vue';
import saleCustomer from '../../views/admin/sales/saleCustomer.vue';
import handOutCustomers from '../../views/admin/sales/handOutCustomers.vue';
import followUpCustomer from '../../views/admin/sales/followUpCustomer.vue';
import addCustomerInfo from '../../views/admin/sales/addCustomerInfo.vue';
import followCustomerDetail from '../../views/admin/sales/followCustomerDetail.vue';

//2.8  活动管理模块
import stbSetting from './../../views/admin/active/stbSetting.vue';

//2.9  vat管理模块
import vatApply from './../../views/admin/vat/vatApply.vue';
import vatApplyDetails from './../../views/admin/vat/vatApplyDetails.vue';
import vatReporting from './../../views/admin/vat/vatReporting.vue';
import vatReportingDetails from './../../views/admin/vat/vatReportingDetails.vue';
import vatPayTax from './../../views/admin/vat/vatPayTax.vue';
import vatPayTaxDetail from './../../views/admin/vat/vatPayTaxDetail.vue';
import vatReportingAdd from './../../views/admin/vat/vatReportingAdd.vue';
/**
 * 3. 其他页面
 */
import p404 from '../../views/admin/other/404.vue';
import Reflesh from '../../views/admin/other/Reflesh.vue';

/**
 * 4. 个人中心
 */
import Personal from '../../views/admin/personal/personal.vue';





//一、 登陆页面的相关路由
export const loginRoute = [
    {path:'/',redirect:'/index/login'},
    {
        path:'/index',
        component:loginContainer,
        children:[
            {path:'login',name:'login',component:login},                   //登录
            {path:'regist',name:'regist',component:regist},                //注册
            {path:'forgot',name:'forgot',component:forgot},                //忘记密码
        ]
    },
    {path:'/404',name:'page404',component:p404,},               //网站404
];


//二、后台系统的路由
//2.1 在主视图显示且能tab切换关闭的路由
export const adminRoute = [
    {
        path:'/admin',
        alias:'合规模块',
        name:'compliance',
        component:mainBox,
        children:[
            {path:'compliance/kyclist',name:'kycList',component:KYCList},                               //alias:'KYC审核列表',
            {path:'compliance/accountList',name:'accountList',component:AccountList},                   //alias:'账号审核列表',
            {path:'compliance/customerRisk',name:'customerRisk',component:customerRisk},                //alias:'客户风险',
            {path:'compliance/storeRisk',name:'storeRisk',component:storeRisk},                         //alias:'店铺风险',
            {path:'compliance/suspiciousReport',name:'suspiciousReport',component:suspiciousReport},    //alias:'可疑报告',
        ]
    },
    {
        path:'/admin',
        alias:'客户模块',
        name:'customer',
        component:mainBox,
        children:[
            {path:'customer/info',name:'customerInfo',component:customeInfo},                       //alias:'客户基本信息',
            {path:'customer/AllInfo',name:'AllcustomerInfo',component:customeInfo},                       //alias:'客户基本信息',
            {path:'customer/lose',name:'customerLose',component:customerLose},                       //alias:'客户流失统计',
            {path:'customer/rate',name:'customerRate',component:customerRate},                       //alias:'客户费率统计',
            {path:'customer/balance',name:'customerBalance',component:customerBalance},                       //alias:'客户销售统计',
            {path:'customer/AllBalance',name:'AllCustomerBalance',component:customerBalance},                       //alias:'客户销售统计',
            // {path:'customer/config',name:'config',component:customeConfig},                         //alias:'客户配置'
        ] 
    },
    {
        path:'/admin',
        alias:'店铺模块',
        name:'store',
        component:mainBox,
        children:[
            {path:'store/info',name:'storeInfo',component:storeInfo},                           //alias:'店铺基本信息',
            {path:'store/balance',name:'storeBalance',component:storeBalance},                           //alias:'店铺入账统计',
            {path:'store/AllBalance',name:'AllStoreBalance',component:storeBalance},                           //alias:'店铺入账统计',
            {path:'store/loseList',name:'storeLose',component:storeLose},                           //alias:'店铺流失统计',
            // {path:'store/flashWithdraw',name:'flashWithdraw',component:lightningWithdraw},                           //alias:'闪提宝',
        ] 
    },
    {
        path:'/admin',
        alias:'销售模块',
        name:'sales',
        component:mainBox,
        children:[
            {path:'sales/balance',name:'saleBalance',component:saleBalance},                           //alias:'销售入账统计',
            {path:'sales/customer',name:'saleCustomer',component:saleCustomer},                           //alias:'销售客户统计',
            {path:'sales/handOutCustomers',name:'handOutCustomers',component:handOutCustomers},                           //alias:'销售客户统计',
            {path:'sales/followUpCustomer',name:'followUpCustomer',component:followUpCustomer},                           //alias:'销售客户统计',
        ] 
    },
    {
        path:'/admin',
        alias:'财务模块',
        name:'Finance',
        component:mainBox,
        children:[
            {path:'Finance/financeForm',name:'financeForm',component:financeForm},                  //alias:'财务报表',
            {path:'Finance/withdrawRecord',name:'withdrawRecord',component:withdrawRecord},         //alias:'提现记录',
            {path:'Finance/SpareGold',name:'SpareGold',component:SpareGold},                        //alias:'备用金管理',
            {path:'Finance/SettlementList',name:'SettlementList',component:SettlementList},         //alias:'结汇列表',
            {path:'Finance/IbcBillList',name:'IbcBillList',component:IbcBillList},                  //alias:'海外出账列表',
            {path:'Finance/PlatformBilling',name:'PlatformBilling',component:PlatformBilling},      //alias:'平台出账',
            {path:'Finance/salesCommission',name:'salesCommission',component:salesCommission},      //alias:'平台出账',
            {path:'Finance/AllsalesCommission',name:'AllsalesCommission', component:salesCommission},      //alias:'平台出账',
            {path:'Finance/hkBankRemit',name:'hkBankRemit', component:hkBankRemit},                 //alias:'香港银行出账记录',
            {path:'Finance/hkBankArrival',name:'hkBankArrival', component:hkBankArrival},                 //alias:'香港银行入账记录',
            {path:'Finance/vatBalance',name:'vatBalance', component:vatBalance},                 //alias:'vat入账统计',
            {path:'Finance/vatBilling',name:'vatBilling', component:vatBilling},                 //alias:'vat出账统计',
        ] 
    },
    {
        path:'/admin',
        alias:'权限管理',
        name:'User',
        component:mainBox,
        children:[
            {path:'User/staffManagement',name:'staffManagement',component:staffManagement},                   //alias:'员工管理',
            // {path:'User/UserRight',name:'UserRight',component:UserRight},                   //alias:'用户管理',
            {path:'User/Role',name:'Role',component:role},                                  //alias:'角色管理'
            {path:'User/Resource',name:'Resource',component:Resource},                      //alias:'资源管理'
        ] 
    },
    {
        path:'/admin',
        alias:'运营模块',
        name:'operate',
        component:mainBox,
        children:[
            {path:'operate/subAccount',name:'subAccount',component:subAccount},                   //alias:'子账号管理',
            {path:'operate/channelAdmin',name:'channelAdmin',component:channelAdmin},              //alias:'渠道管理',
            {path:'operate/spokesman',name:'spokesman',component:spokesman},                        //alias:'代言人活动管理界面',
            {path:'operate/SpokesmanWithdraw',name:'SpokesmanWithdraw',component:SpokesmanWithdraw},          //alias:'代言人活动提现记录',
            {path:'operate/spokesmanMonitoring',name:'spokesmanMonitoring',component:spokesmanMonitoring},          //alias:'代言人活动数据埋点统计',
            {path:'operate/eBayOrder',name:'eBayOrder',component:eBayOrder},          //alias:'ebay订单分析',
            {path:'operate/Advertisement',name:'Advertisement',component:Advertisement},          //alias:'广告管理模块',
            {path:'operate/minProgram',name:'minProgram',component:minProgram},          //alias:'小程序抽奖',
        ] 
    },
    {
        path:'/admin',
        alias:'活动管理模块',
        name:'active',
        component:mainBox,
        children:[
            {path:'operate/stbStatistical',name:'stbStatistical',component:lightningWithdraw},             //alias:'闪提宝统计'
            {path:'operate/stbSetting',name:'stbSetting',component:stbSetting},                     //alias:'闪提宝设置'
        ]
    },
    {
        path:'/admin',
        alias:'VAT管理模块',
        name:'vat',
        component:mainBox,
        children:[
            {path:'vat/apply',name:'vatApply',component:vatApply},             //alias:'vat注册管理'
            {path:'vat/reporting',name:'vatReporting',component:vatReporting},             //alias:'vat申报'
            {path:'vat/payTax',name:'vatPayTax',component:vatPayTax},             //alias:'vat缴税'
        ]
    }
];

//2.1 在主视图显示,但是不能通过tab切换的路由
export const adminOther = [
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'404',name:'admin404',component:p404},                //后台404
            {path:'index',name:'index',component:adminIndex},           //后台首页
            {path:'Reflesh',name:'Reflesh',component:Reflesh},             //刷新中间页面

            {path:'TMonthCSD',name:'TMonthCSD',component:TMonthCSD},             //首页入口查看更多--本月入账统计
            {path:'TMouthUSER',name:'TMouthUSER',component:TMouthUSER},             //首页入口查看更多--本月用户统计
            {path:'TMouthSTORY',name:'TMouthSTORY',component:TMouthSTORY},             //首页入口查看更多--本月店铺统计
            {path:'TMouthSOURCE',name:'TMouthSOURCE',component:TMouthSOURCE},             //首页入口查看更多--用户来源查看更多
        ]
    },
    //合规模块
    // {
    //     path:'/admin',
    //     component:mainBox,
    //     children:[
            
    //     ]  
    // },
    //财务模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'Finance/withdrawRecord/details',name:'FinanceWithdrawRecordDetails',component:withdrawDetailes},   //财务提现记录详情
        ]
    },
    //权限管理
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'User/Role/AuthTree',name:'AuthTree',component:AuthTree},      //角色权限配置页面
        ]
    },
    //运营模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'operate/withdrawRecore/details',name:'spokesmanWithdrawDetails',component:spokesmanWithdrawDetails},      //代言人活动提现详情页面
        ]
    },
    //客户模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'customer/rate/setRate',name:'customerSetRate',component:customerSetRate},            //客户信息详情页面
            
        ]
    },
    //销售模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'sales/addCustomerInfo',name:'addCustomerInfo',component:addCustomerInfo},            //新增客户信息页面
        ]
    },
    //vat模块哦
      //销售模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'vat/report/add',name:'vatReportingAdd',component:vatReportingAdd},         //新增待申报     
        ]
    },
];

//2.2 在主视图，能通过tab打开，但是不在菜单中显示   2018-11-30 一般用于菜单列表中的某个详情页面
export const adminOtherTab = [
    //合规模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'compliance/KYCdetail',name:'KYCdetail',alias:"KYC审核详情",component:KYC},   //kyc详情
            {path:'compliance/storeRisk/company',name:'storeRiskDetail',alias:"店铺风险详情",component:storeRiskDetail},   //店铺风险详情
            {path:'compliance/customerRisk/personal',name:'customerRiskPersonal',alias:"客户（个人）风险详情",component:customerRiskPersonal},   //风险详情 个人
            {path:'compliance/customerRisk/company',name:'customerRiskCompany',alias:"客户（企业）风险详情",component:customerRiskCompany},   //风险详情 企业
            {path:'compliance/suspiciousReport/detail',name:'suspiciousReportDetail',alias:"可疑报告案例详情",component:suspiciousReportDetail},   //可疑报告详情
        ]
    },
    //财务模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'Finance/hkBankRemit/details',name:'hkRemitDetails',alias:"查看结汇批次详情",component:hkRemitDetails},           //查看结汇批次号详情
            {path:'Finance/IbcBillList/details',name:'IbcBillDetails',alias:"SolarisBank打款详情",component:IbcBillDetails},           //SolarisBank打款详情
            {path:'Finance/vatBalance/details',name:'vatBalanceDetail',alias:"VAT缴税入账详情",component:vatBalanceDetail},           //VAT缴税入账详情
            {path:'Finance/vatBalance/taxdetails',name:'vatBalanceTaxDetails',alias:"VAT代缴税费入账详情",component:vatBalanceTaxDetails},           //VAT缴税入账详情
            {path:'Finance/vatBilling/details',name:'vatBillingDetail',alias:"VAT缴税出账详情",component:vatBillingDetail},           //VAT缴税出账详情
        ]
    },
    //客户模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'customer/info/details',name:'customerDetails',alias:"客户信息详情",component:customerDetails},            //客户信息详情页面
            {path:'customer/balance/details',name:'customerBalanceDetails',alias:"客户入账统计详情",component:customerBalanceDetails},            //客户信息详情页面
        ]
    },
     //店铺模块
     {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'store/info/details',name:'storeDetails',alias:"店铺信息详情",component:storeDetails},                 //店铺信息详情
            {path:'store/balance/details',name:'storeBalanceDetails',alias:"店铺入账统计详情",component:storeBalanceDetails},
        ]
    },
    //个人中心模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'personal/personal',name:'Personal',alias:"个人中心",component:Personal},                 
        ]
    },
    //销售模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'sales/followCustomerDetail',name:'followCustomerDetail',alias:"客户跟进详情",component:followCustomerDetail},         //客户跟进详情               
        ]
    },
    //销售模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'vat/apply/detail',name:'vatApplyDetail',alias:"VAT注册详情",component:vatApplyDetails},         //vat注册详情               
            {path:'vat/report/detail',name:'vatReportDetail',alias:"VAT申报详情",component:vatReportingDetails},         //vat申报详情              
            {path:'vat/payTax/detail',name:'vatPayTaxDetail',alias:"VAT缴税详情",component:vatPayTaxDetail},         //vat申报详情              
        ]
    },
]


export const routes = [
    ...loginRoute,
    ...adminRoute,
    ...adminOther,
    ...adminOtherTab
]
