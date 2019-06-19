import Axios from './axios';


//一、基础接口

//1.查询省份
export const queryProvince = () => Axios.post('/general/queryProvinceList');
//2.查询城市
export const queryCity = params => Axios.post('/general/queryCityList',params);
//3.获取币种
export const queryCurrency = () => Axios.post('/general/queryCurrencyList');
//4.获取银行列表
export const queryBank = () => Axios.post('/general/queryBankList');
//5.获取支行列表
export const queryBranch = params => Axios.post('/general/queryBranchList',params);
//6.获取预计年销量
export const querySalesVolume = () => Axios.post('/general/querySalesVolumeCategory');
//7.获取销售类目
export const queryProductCategory = () => Axios.post('/general/queryProductCategory');
//8.获取平台类型列表
export const queryPlatformInfo = () => Axios.post('/general/platformInfo');
//9.文件上传接口
export const uploadefile = `/general/upload`;
//9.文件现在接口
export const downloadfile = `/general/download?fileId=`;


//二、登录注册页面

//1.登录
export const login = params => Axios.post('/user/login',params);
export const loginByPhone = params => Axios.post('/user/loginByPhone',params);
export const sendLoginCode = params => Axios.post('/user/sendLoginCode',params);
export const getLoginAD = params => Axios.get('/swiper/getLoginAD',{params});
//2.注册
export const register = params => Axios.post('/user/register',params);
//3.注册验证码
export const registerVerifyCode = params => Axios.post('/user/sendRegisterVerifyCode',params);
//4.绑定邮箱
export const sendActiveEmail = params => Axios.post('/user/sendActiveEmail',params);
//4.1 激活邮箱
export const activeEmail = params => Axios.post('/user/activeEmail',params);
//5.找回密码验证码发送
export const findPswVerifyCode = params => Axios.post('/user/sendFpwdVerifyCode',params);
//6.找回密码邮箱
export const findPswEmail = params => Axios.post('/user/sendFpwdEmail',params);
//7.重置密码
export const resetPassword = params => Axios.post('/user/forgotPassword',params);
//8.商户后台是否是首次登陆
export const isFristLogin = params => Axios.post('/user/isFristLogin',params);




//三、商户后台页面

//1.退出账号
export const logout = () => Axios.post('/logout');
//1.1 获取全局底部广告
export const getFixBottomAD = () => Axios.get('/swiper/getFixBottomAD');

//账号总览首页
//3.1.1  获取消息列表
export const messageInfo =  params => Axios.post('/main/messageInfo',params);
export const AmountInfoByPlatform = params => Axios.post('/main/customerAmountInfoByPlatform',params);

//3.0.1 商户后台首页--获取代办信息
export const dealtInfo = () => Axios.post('/main/dealtInfo');
//3.0.2 商户后台首页--获取商家四个金额
export const customerAmountInfo = params => Axios.post('/main/customerAmountInfo',params);
//3.0.3 商户后台首页--获取店铺列表
export const storeInfo = params => Axios.post('/main/storeInfo',params);
//3.0.3 商户后台提现页面--获取提现店铺的列表
export const queryWithdrawStoreList = params => Axios.post('/main/queryWithdrawStoreList',params);
//3.0.3 商户后台--消息盒子，点击之后不再提示该消息
export const updateMessageInfo = params => Axios.post('/message/updateMessageInfo',params);
//3.0.3 商户后台--消息盒子清空
export const emptyMessage = params => Axios.post('/message/emptyMessage',params);
//3.0.3 商户后台--首页banner广告图
export const queryIndexBanner = params => Axios.post('/swiper/queryIndexBanner',params);



//3.1.1  店铺管理--店铺详情信息
export const queryStoreDetail = params => Axios.post('/store/queryStoreDetail',params);
//3.1.2  店铺管理--添加店铺
export const addStoreDetail = params => Axios.post('/store/addStoreDetail',params);
//3.1.3  店铺管理--修改店铺
export const updateStoreDetail = params => Axios.post('/store/updateStoreDetail',params);
//3.1.4  店铺管理--修改店铺备注
export const updateStoreRemark = params => Axios.post('/store/updateStoreRemark',params);
//3.1.4  店铺管理--修改店铺提现账户
export const updateStoreCard = params => Axios.post('/store/updateStoreCard',params);
//3.2.5  添加店铺获取ebay链接--2018-10-25
export const getEbayAuthUrl = params => Axios.post('/store/getEbayAuthUrl',params);
//3.2.5  添加店铺获取wish链接--2019-3-8
export const getWishAuthorizeUrl = params => Axios.post('/store/getWishAuthorizeUrl',params);
//3.2.5  验证是否成功ebay授权--2018-10-25
export const getEbayToken = params => Axios.post('/store/getEbayToken',params);
//3.2.5  刷新paypal钱--2018-10-25
export const querySettleAmount = params => Axios.post('/store/querySettleAmount',params);
//3.2.5  正常店铺添加一个新的国家--2019-01-21
export const addMwsSite = params => Axios.post('/store/addMwsSite',params);
//3.2.6  添加/更新 欧洲站店铺的企业认证信息--2018-12-4
export const updateEnterprise = params => Axios.post('/applicant/store/updateEnterprise',params);
//3.2.6  添加/更新 欧洲站店铺的企业认证信息--2018-12-4
export const addEnterprise = params => Axios.post('/applicant/store/addEnterprise',params);
//3.0.3 商户后台--首页导入wish订单/ebay订单
export const importWishOrder = params => Axios.post('/store/importWishOrder',params);
//3.0.3 商户后台--首页是否可以访问自动提现的页面
export const AutoPayIsAvailable = params => Axios.post('/autoWithdraw/isAvailable',params);
//3.0.3 商户后台--首页是否可以访问自动提现的页面
export const getAllPlatformCode = params => Axios.post('/main/getAllPlatformCode',params);
//3.0.3 商户后台--首页是否可以访问自动提现的页面
export const getStoreStatusCount = params => Axios.post('/main/getStoreStatusCount',params);
//3.0.3 商户后台--获取etsy授权页面接口
export const getEtsyAuthorizeUrl = params => Axios.post('/store/getEtsyAuthorizeUrl',params);



//3.2.1  提现账户管理--获取账户列表
export const queryAccountList = () => Axios.post('/withdrawAccount/queryAccountList');
//3.2.2  提现账户管理--提现账户详情
export const queryAccountDetail = params => Axios.post('/withdrawAccount/queryAccountDetail',params);
//3.2.3  提现账户管理--添加提现账户
export const addAccount = params => Axios.post('/withdrawAccount/addAccount',params);
//3.2.4  提现账户管理--修改个人提现账户
export const updatePersonalAccount = params => Axios.post('/withdrawAccount/updatePersonalAccount',params);
//3.2.5  提现账户管理--修改对公提现账户
export const updateEnterpriseAccount = params => Axios.post('/withdrawAccount/updateEnterpriseAccount',params);
//3.2.6  提现账户管理--删除提现账户
export const removeAccount = params => Axios.post('/withdrawAccount/removeAccount',params);
//3.2.7  提现账户管理--添加提现号码发送验证码
export const sendAddAccountVerifycode = () => Axios.post('/withdrawAccount/sendAddAccountVerifycode');
//3.2.8  提现账户管理--修改号码发送验证码
export const sendUpdateAccountVerifycode = () => Axios.post('/withdrawAccount/sendUpdateAccountVerifycode');
//3.2.8  体现的实时汇率
export const queryExchangeRateByCurrency = params => Axios.post('/main/queryExchangeRateByCurrency',params);
//3.2.8  获取所有币种的实时汇率
export const queryExchangeRateAll = params => Axios.post('/main/queryExchangeRateAll',params);
//3.2.8  导出数据之前先请求看看有没有数据
export const existExpStatement = params => Axios.post('/statement/existExpStatement',params);
//3.2.8  导出数据之前先请求看看有没有数据
export const existExprotWithdrawList = params => Axios.post('/withdraw/existExprotWithdrawList',params);
//3.2.8  导出数据之前先请求看看有没有数据
export const existVatDetailList = params => Axios.post('/vatrecord/existVatDetailList',params);
//3.2.8  导出数据之前先请求看看有没有数据
export const exprotVatDetailList = '/vatrecord/exprotVatDetailList';


//3.3.1  提现管理--获取提现记录列表(提现记录)
export const queryWithdrawList = params => Axios.post('/withdraw/queryWithdrawList',params);
//3.3.2  提现管理--提现申请
export const applyWithdraw = params => Axios.post('/withdraw/applyWithdraw',params);
//3.3.3  提现管理--导出提现记录
export const exprotWithdraw = '/withdraw/exprotWithdrawList';
//3.3.3  提现管理--导出提现记录
export const exprotWithdrawList = params => Axios.post('/withdraw/exprotWithdrawList',params);
//3.3.3  提现之前的预览接口
export const previewWithdraw = params => Axios.post('/withdraw/previewWithdraw',params);
//3.3.4  提现管理--提现之前的发送验证码
export const sendWithdrawVerifyCode = () => Axios.post('/withdraw/sendWithdrawVerifyCode');


//3.4.1  账单明细--获取店铺账单
export const statementList = params => Axios.post('/statement/statementList',params);
//3.4.2  账单明细--导出账单接口细--导出账单接口
export const expStatement = '/statement/expStatement';
//3.4.2  账单明细--获取所有店铺的名称
export const queryAllStroe = params => Axios.post('/store/queryAllStroe',params);
//3.4.2  账单明细--获取付款信息
export const vatrecordGetVatDetailList = params => Axios.get('/vatrecord/getVatDetailList',{params});


//3.5.1  账号中心--获取商户详情信息
export const customerInfo = () => Axios.post('/customer/info');
//3.5.2  账号中心--修改密码
export const updatePassword = params => Axios.post('/user/updatePassword',params);
//3.5.3  账号中心--修改密码验证码
export const sendCodeByPassword = params => Axios.post('/user/sendCodeByPassword',params);
//3.5.4  账号中心--修改手机号码
export const updatePhone = params => Axios.post('/user/updatePhone',params);
//3.5.4  账号中心--通过邮箱修改手机号码
export const updatePhoneByEmail = params => Axios.post('/user/updatePhoneByEmail',params);
//3.5.5  账号中心--发送修改手机号的  原手机  验证码
export const sendCodeByOldPhone = params => Axios.post('/user/sendCodeByOldPhone',params);
//3.5.6  账号中心--发送修改手机号的  新手机  验证码
export const sendCodeByNewPhone = params => Axios.post('/user/sendCodeByNewPhone',params);
//3.5.7  账号中心--修改邮箱
export const updateEmail = params => Axios.post('/user/updateEmail',params);
//3.5.8  账号中心--发送修改邮箱的  邮箱  验证码
export const sendEamilCodeByEmail = params => Axios.post('/user/sendEamilCodeByEmail',params);
//3.5.9  账号中心--发送修改邮箱的  手机  验证码
export const sendPhoneCodeByEmail = params => Axios.post('/user/sendPhoneCodeByEmail',params);
//3.5.9  账号中心--发送修改手机的  邮箱  验证码
export const sendEamilCodeByPhone = params => Axios.post('/user/sendEamilCodeByPhone',params);
//3.5.9  账号中心--发送修改手机的  手机  验证码
export const sendPhoneCodeByPhone = params => Axios.post('/user/sendPhoneCodeByPhone',params);
//3.5.9  账号中心--我的优惠券
export const queryFreeWithdraw = params => Axios.post('/freeWithdraw/queryFreeWithdraw',params);


//3.6.1  实名信息--获取实名认证信息
export const personInfo = () => Axios.get('/applicant/person/info');
//3.6.2  实名信息--修改实名认证信息
export const personInfoUpdate = params => Axios.post('/applicant/person/update',params);
//3.6.3  实名信息--添加实名认证信息
export const personInfoAdd = params => Axios.post('/applicant/person/add',params);
//3.6.3  实名信息--修改实名认证信息
export const updatePersonInfo = params => Axios.post('/applicant/person/update',params);
//3.6.3  实名信息--修改实名认证信息
export const enterpriseInfo = params => Axios.post('/applicant/enterprise/info',params);
//3.6.3  实名信息--首次实名认证需要后续的跳转
export const queryCustomerBindInfo = params => Axios.post('/main/queryCustomerBindInfo',params);

//四 埋点
//4.1
export const saveUrlDataLog = params => Axios.post('/url/save/data/log',params);

//五、
//5.1 获取自动提现的列表
export const queryAutoWithdrawStore =params => Axios.post('/autoWithdraw/queryAutoWithdrawStore',params);
//5.2 设置自动提现
export const updateAutoWithdraw =params => Axios.post('/autoWithdraw/updateAutoWithdraw',params,{JSON:true});


//六、闪提宝
//6.1 
export const getflashWithdrawNotice = params=> Axios.get('/flashWithdraw/getSelfNotice',{params});
//6.2 免费申请闪提宝
export const getflashWithdrawConpon = params=> Axios.post('/flashWithdraw/receive',params);
//6.2 
export const getFlashWithdrawStore = params=> Axios.get('/flashWithdraw/getFlashWithdrawStore',{params});
//6.2  开通闪提宝
export const bindFlashWithdraw = params=> Axios.post('/flashWithdraw/bind',params);
//6.2  关闭闪提宝
export const unBindFlashWithdraw = params=> Axios.post('/flashWithdraw/unBind',params);
//6.2  关闭闪提宝
export const getFlashWithdrawStatistics = params=> Axios.get('/flashWithdraw/getStatistics',{params});

//七、 VAT
//7.1
export const vatrecordGetList = params => Axios.get('/vatrecord/getList',{params});
//7.1
export const vatrecordGetStatistics = params => Axios.get('/vatrecord/getStatistics',{params});
//7.1 注册vat预计费用
export const vatrecordGetPayMoney = params => Axios.get('/vatrecord/getPayMoney',{params});
//7.1 注册vat
export const vatrecordSave = params => Axios.post('/vatrecord/save',params);
//7.1 确认支付信息
export const vatrecordConfirmPay = params => Axios.post('/vatrecord/confirmPay',params);

//7.6  vat申报
export const findDeclarationModelList = params => Axios.post('/declaration/findDeclarationModelList',params);
//7.6  vat申报
export const vatFindStatusCount = params => Axios.post('/declaration/findStatusCount',params);
//7.6  vat申报步骤一 上传资料
export const declarationUpdateData = params => Axios.post('/declaration/updateData',params);
//7.6  vat申报步骤3 确认税金正常还是异常
export const declarationCalcPay = params => Axios.post('/declaration/calcPay',params);
//7.9  上传支付回执
export const declarationUploadPay= params => Axios.post('/declaration/uploadPay',params);
//7.9  上传支付回执
export const declarationFindCountryCode= params => Axios.post('/declaration/findCountryCode',params);


//7.10  vat缴税 列表
export const queryPaytaxList= params => Axios.post('/vatPaytax/queryPaytaxList',params);
//7.10  vat缴税 税局列表
export const queryTaxBureauList= params => Axios.post('/vatPaytax/queryTaxBureauList',params);
//7.10  vat缴税 申请缴税
export const vatPaytaxApply= params => Axios.post('/vatPaytax/apply',params);
//7.10  vat缴税 查询可疑代缴金额
export const customerAmountByCurrency= params => Axios.post('/main/customerAmountByCurrency',params);
//7.10  vat缴税 查询可疑代缴金额
export const vatPaytaxPay= params => Axios.post('/vatPaytax/pay',params);

