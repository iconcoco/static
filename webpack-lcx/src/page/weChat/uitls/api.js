import Axios from './axios';

//一、代言人活动查询

//1. 代言人显示金额
export const spokesmanGetReward = () => Axios.post('/activity/getReward');
//2. 代言人提现
export const spokesmanApplyWithdraw = params => Axios.post('/activity/applyWithdraw',params);
//4. 编辑代言人提现账户信息
export const spokesmanEditAccountInfo = params => Axios.post('/account/edit/info',params)
//5. 代言人提现记录
export const spokesmanWithdrawRecord = params => Axios.post('/activity/withdrawList',params);
//6. 查询提现信息
export const spokesmanBankInfo = () => Axios.post('/account/query/info');

//二、代言人活动页面

//1.获取用户信息
export const spokesmanGetInfo = () => Axios.post('/represent/getInfo');
//2.宣传海报地址
export const spokesmanGetImg = `/represent/getImg`;
//3.获取手机验证码
export const spokesmanBindCode = params => Axios.post('/represent/sendBindCode',params);
//4.绑定手机并获取海报
export const spokesmanBindPhone = params => Axios.post('/represent/bind',params);
//.
export const spokesmanValid = params => Axios.post('/represent/valid',params);
//5.请求微信配置
export const wxcongfig = params => Axios.post('/wx/get/wxcongfig',params);



