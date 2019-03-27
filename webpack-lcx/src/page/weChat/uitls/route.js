
//1.  代言人活动结果查询页
import spokesmanBox from './../view/spokesman/spokesmanIndex.vue';

import spokesQuery from './../view/spokesman/components/query.vue';
import spokesRecord from '../view/spokesman/components/record.vue';
import spokesAccount from '../view/spokesman/components/Account.vue';
import spokesWithdraw from '../view/spokesman/components/withdraw.vue';
import spokesCheck from '../view/spokesman/components/check.vue';
import spokesBindAccount from '../view/spokesman/components/guideBind.vue';

//2. 代言人活动页面
import ActiveContainer from './../view/h5active/ActiveContainer.vue';
import spokensmanActive from './../view/h5active/components/spokensmanActive.vue';
import spkensmanShareImg from './../view/h5active/components/spkensmanShareImg.vue';
import wechatShareImg from './../view/h5active/components/weChatShare.vue';

export default [
    { path: '/', redirect: '/spokesman/query' },
    //代言人活动查询
    { 
        path: '/spokesman',
        name:'spokesman', 
        component:spokesmanBox,
        children:[
            {path:"query",name:"spokesQuery", component:spokesQuery},               //结果查询
            {path:"record",name:"spokesRecord", component:spokesRecord},            //提现记录查询
            {path:"account",name:"spokesAccount", component:spokesAccount},          //完善收款账户
            {path:"withdraw",name:"spokesWithdraw", component:spokesWithdraw},          //领取奖励金 提现
            {path:"check",name:"spokesCheck", component:spokesCheck},          //查看收款账户
        ] 
    },
    {path:"/guideTobind",name:"spokesBindAccount", component:spokesBindAccount},          //查看收款账户
    {path:"/wechatShare",name:"wechatShare", component:wechatShareImg},          //查看收款账户
    //代言人活动页面
    {
        path:'/active',
        name:'acitve',
        component:ActiveContainer,
        children:[
            {path:'spokes',name:'spokes',component:spokensmanActive},             //代言人活动页面
            {path:'spokesImg',name:'spokesImg',component:spkensmanShareImg},             //代言人活动页面
        ]
    }
]