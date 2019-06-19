import Axios from './axios.js';

/**
 * 1. 登陆注册页面
 */

export const login = params=> Axios.post('/login',params);
export const logout = ()=> Axios.post('/logout');
export const register = params=> Axios.post('/register',params);
//忘记密码获取验证码
export const sendRestPwdMsg = params=> Axios.post('/user/sendRestPwdMsg',params);
//忘记密码
export const restPwd = params=> Axios.post('/user/restPwd',params);

/**
 * 2. 后台系统
 */
//0.0.1 首页获取权限菜单
export const queryAuth = ()=> Axios.post('/user/loadAuthTree');
//0.0.2 首页 每月入账走势
export const queryCSDByMonthly = ()=> Axios.post('/currencyStatementDailies/queryCSDByMonthly');
//0.0.3 首页 本月入账走势
export const queryCSDByDailyThisMonth = ()=> Axios.post('/currencyStatementDailies/queryCSDByDailyThisMonth');
//0.0.4 首页 每月用户统计
export const queryUserDailiesByMonthly = ()=> Axios.post('/userDailies/queryUserDailiesByMonthly');
//0.0.4 首页 本月用户统计
export const queryUserDailiesByTheMonth = ()=> Axios.post('/userDailies/queryUserDailiesByTheMonth');
//0.0.4 首页 每月店铺统计
export const queryStoreDailiesByMonthly = ()=> Axios.post('/storeDailies/queryStoreDailiesByMonthly');
//0.0.4 首页 本月店铺统计
export const queryStoreDailiesByMonth = ()=> Axios.post('/storeDailies/queryStoreDailiesByMonth');
//0.0.4 首页 每月注册来源
export const queryUserStaticList = params=> Axios.post('/usersourc/userStaticList',params);

//0.0.-- 首页 本月入账统计 查看更多
export const queryCSDByDaily = params=> Axios.post('/currencyStatementDailies/queryCSDByDaily',params);
//0.0.-- 首页 本月用户统计 查看更多--
export const queryUserDailiesByTimeFrame = params=> Axios.post('/userDailies/queryUserDailiesByTimeFrame',params);
//0.0.-- 首页 本月用户统计 查看更多--
export const qeruyUserDailiesNum = params=> Axios.post('/userDailies/qeruyUserDailiesNum',params);
//0.0.-- 首页 本月用户统计 查看更多--新增客户详情
export const queryCustomerStatistics = params=> Axios.post('/userDailies/queryCustomerStatistics',params);
//0.0.-- 首页 本月用户统计 查看更多--流失用户详情统计
export const queryLossCustomer = params=> Axios.post('/userDailies/queryLossCustomer',params);

//0.0.-- 首页 本月店铺统计 查看更多--新店铺统计
export const queryNewAllStoreCount = params=> Axios.post('/storeDailies/queryNewAllStoreCount',params);
//0.0.-- 首页 本月店铺统计 查看更多--总店铺统计
export const queryAllStoreCount = params=> Axios.post('/storeDailies/queryAllStoreCount',params);
//0.0.-- 首页 本月店铺统计 查看更多--新增店铺详情统计
export const queryStoreStatistics = params=> Axios.post('/storeDailies/queryStoreStatistics',params);
//0.0.-- 首页 本月店铺统计 查看更多--流失店铺详情统计
export const queryLossStore = params=> Axios.post('/storeDailies/queryLossStore',params);

//0.0.-- 首页 本月用户来源统计 查看更多--销售用户来源统计
export const saleUserSource = params=> Axios.post('/usersourc/saleUserSource',params);
//0.0.-- 首页 本月用户来源统计 查看更多--市场推广用户来源统计
export const extensionUserSource = params=> Axios.post('/usersourc/extensionUserSource',params);
//0.0.-- 首页 本月用户来源统计 查看更多--搜索引擎用户来源统计
export const seoUserSource = params=> Axios.post('/usersourc/seoUserSource',params);

//基础接口
//0.1 国外银行列表
export const queryForeignBankList = params=> Axios.post(`/general/selectBankList`,params);
//0.2 平台信息
export const queryPlatformInfo = ()=> Axios.post(`/general/platformInfo`);
//0.3 查询币种
export const queryCurrencyList = ()=> Axios.post(`/general/queryCurrencyList`);
//0.4 查询渠道
export const queryChannelInfo = ()=> Axios.post(`/general/queryChannelInfo`);
//0.5 文件上传接口
export const upload = `/file/upload`;
//0.5 文件下载接口
export const download = `/file/download`;
//0.5 获取省份列表的接口
export const queryProvinceInfo = ()=> Axios.post(`/general/queryProvinceInfo`);

// 一、合规模块

//1.1 KYC审核获取对应外键ID的详情
export const queryKycAuditInfo = params=> Axios.post('/kyc/queryAuditInfo',params);
//1.2. KYC审核提交审核结果
export const saveKycAuditInfo = params=> Axios.post('/kyc/saveAuditInfo',params,{JSON:true});
//1.3 请求KYC主页列表
export const queryKycIndexList = params=> Axios.post('/kyc/index',params);
//1.3 请求KYC审核状态
export const queryKycAuditStatus = params=> Axios.post('/kyc/queryAuditStatus',params);
//1.4 请求受益人审核列表
export const queryShareholderList = params=> Axios.post('/kyc/queryShareholderList',params);
//1.5 风险评级
export const queryRiskInfo = params=> Axios.post('/kyc/queryRiskInfo',params);
//1.5 风险评级
export const validIdCard = params=> Axios.post('/kyc/validIdCard',params);
//1.5 风险评级保存接口
export const saveRiskInfo = params=> Axios.post('/kyc/saveRiskInfo',params,{JSON:true});
//1.6 查询KYC备注接口
export const queryAuditRemark = params=> Axios.post('/kyc/queryAuditRemark',params);
//1.6 保存KYC备注接口
export const saveAuditRemark = params=> Axios.post('/kyc/saveAuditRemark',params);
//1.6 取消EDD接口
export const cancelEddRisk = params=> Axios.post('/kyc/cancelEddRisk',params);
//1.6 欧洲站店铺信息店铺受益人审核
export const queryShareholderListByPlatform = params=> Axios.post('/kyc/queryShareholderListByPlatform',params);
//1.6 欧洲站保存店铺审核状态接口
export const saveStoreOwnAuditInfo = params=> Axios.post('/kyc/saveStoreOwnAuditInfo',params,{JSON:true});
//1.6 欧洲站保存店铺审核状态接口
export const saveStoreAllAuditInfo = params=> Axios.post('/kyc/saveStoreAllAuditInfo',params);
//1.6 欧洲站保存店铺审核状态接口
export const saveStoreOtherAuditInfo = params=> Axios.post('/kyc/saveStoreOtherAuditInfo',params);
//1.6 查询欧洲站的状态
export const queryEuOtherStatus = params=> Axios.post('/kyc/queryEuOtherStatus',params);
//1.6 KYC列表到处KYC文件
export const exportKycInfo = '/kyc/exportKycInfo?stores='

//TM 
//1.7 获取客户风险--企业
export const queryEnterprisePage = params => Axios.post('/tmCustomer/queryEnterprisePage',params)
//1.7 获取客户风险--个人
export const queryIndividualPage = params => Axios.post('/tmCustomer/queryIndividualPage',params)
//1.7 获取客户风险详情
export const queryCustomerRishDetail = params => Axios.post('/tmCustomer/queryCustomerDetail',params)
//1.7 计算风险分数-个人
export const calculateIndividualRisk = params => Axios.post('/tmCustomer/calculateIndividualRisk',params,{JSON:true})
//1.7 计算风险分数-企业
export const calculateEnterpriseRisk = params => Axios.post('/tmCustomer/calculateEnterpriseRisk',params,{JSON:true})
//1.7 获取店铺列表
export const queryStorePage = params => Axios.post('/tmStore/queryStorePage',params)
//1.7 获取店铺列表
export const queryAlertNumber = params => Axios.post('/tmStore/queryAlertNumber',params)
//1.7 获取风险店铺列表
export const queryStoreRiskList = params => Axios.post('/tmStore/queryStoreRiskList',params)
//1.7 获取风险店铺列表
export const queryStoreStatusNumber = params => Axios.post('/tmStore/queryStatusNumber',params)
//1.7 获取店铺账期
export const queryStoreByStoreId = params => Axios.post('/tmStore/queryStoreByStoreId',params)
//1.7 获取店铺账期详情
export const queryStoreInfoByTmId = params => Axios.post('/tmStore/queryStoreInfoByTmId',params)
//1.7 获取店铺账期详情
export const tmUpdateStoreInfo = params => Axios.post('/tmStore/updateStoreInfo',params)
//1.7 获取店铺账期详情
export const tmUpdateGf = params => Axios.post('/tmStore/updateGf',params)
//1.7 创建可以报告
export const createSuspectMangeByTm = params => Axios.post('/suspect/createSuspectMangeByTm',params)
//1.7 查询可疑报告列表
export const querySuspectMangeDto = params => Axios.post('/suspect/selectSuspectMangeDto',params)
//1.7 查询可疑报告列表-可疑报告列表创建
export const createSuspectMange = params => Axios.post('/suspect/createSuspectMange',params)
//1.7 更新可疑报告的状态
export const updateSuspectStatus = params => Axios.post('/suspect/updateSuspectStatus',params)
//1.7 更新可疑报告的状态
export const updateNewRemark = params => Axios.post('/suspect/newRemark',params)
//1.7 获取备注列表
export const getRecordList  = params => Axios.post('/suspect/getRecordList',params)
//1.7 获取备注列表
export const existDownOrderInfo  = params => Axios.post('/tmStore/existDownOrderInfo',params)
//1.7 获取备注列表
export const downloadFileStatus  = params => Axios.post('/tmStore/downloadFileStatus',params)
//1.7 可疑报告管理-上传文档
export const suspectUploadFile  = params => Axios.post('/suspect/uploadFile',params)
//1.7 可疑报告管理 文档列表
export const suspectFileList  = params => Axios.post('/suspect/fileList',params)
//1.7 可疑报告管理-删除文档
export const deleteSuspectFile  = params => Axios.post('/suspect/deleteFile',params)
//1.7 计算店铺风险分数
export const claculateStoreRisk  = params => Axios.post('/tmStore/claculateStoreRisk',params,{JSON:true})


//2.1 账户审核列表
export const queryHolderList = params=> Axios.post('/holderInfo/index',params);
//2.2 账户审核结果保存
export const saveHolderAudit = params=> Axios.post('/holderInfo/audit',params);
//2.3 账户银行卡验证
export const validCard = params=> Axios.post('/holderInfo/validCard',params);

//三、财务模块
//3.1 财务提现记录
export const withdrawRecord = params => Axios.post('/financial/query/withdraw',params);
//3.1.1 财务提现记录详情
export const queryWithdraw = params => Axios.post('/withdraw/queryWithdraw',params);
//3.1.1 财务提现记录详情更改状态
export const withdrawUpdateStatus = params => Axios.post('/withdraw/updateStatus',params);
//3.2 财务报表
export const financeStatement = params => Axios.post('/financial/query/financial/statement',params);
//3.3 备用金
export const querySpareGold = params => Axios.post('/financial/query/spare/fund/detail',params);
//3.4 结汇列表
export const querySettlementList = params => Axios.post('/financial/querySettlSettlementList',params);
//3.5 海外银行出账列表
export const queryIbcBillList = params => Axios.post('/financial/findIbcBillList',params);
//3.6 平台出账
export const queryPlatformBilling = params => Axios.post('/financial/queryPlatformBilling',params);
//3.7 充值备用金
export const saveChargeSpare = params => Axios.post('/financial/recharge/spare/fund',params);
//3.8 结汇列表发起结汇
export const applySettlement = params => Axios.post('/financial/applySettlement',params);
//3.8 查询销售提成
export const querySalesCustomer = params => Axios.post('/financial/querySalesCustomer',params);
//3.8 系统汇率配置
export const addExchangeConfig = params => Axios.post('/financial/addExchangeConfig',params,{JSON:true});
//3.9 上传备用金接口
export const uploadFinancialAmount = '/financial/uploadFinancialAmount';
//3.10 香港银行入账记录
export const queryHkBankInAccountFlow = params => Axios.post('/hkBankAccountFlow/queryHkBankInAccountFlow',params);
//3.10 香港银行入账记录-香港银行的账号详情
export const queryHkBankAccountBanlace = params => Axios.post('/hkBankAccountFlow/queryHkBankAccountBanlace',params);
//3.10 香港银行入账记录-添加一条记录
export const saveHkBankAccountFlow = params => Axios.post('/hkBankAccountFlow/saveHkBankAccountFlow',params);
//3.10 香港银行出账记录-修改一条记录
export const updateHkBankOutAccountFlow = params => Axios.post('/hkBankAccountFlow/updateHkBankOutAccountFlow',params);
//3.10 香港银行出账记录
export const queryHkBankOutAccountFlow = params => Axios.post('/hkBankAccountFlow/queryHkBankOutAccountFlow',params);
//3.11 创建结汇批次号
export const createNewSettleBatchNo = params => Axios.post('/withdraw/createNewSettleBatchNo',params,{JSON:true});
//3.11 提现记录选择所有记录
export const queryValidSettleWithdrawList = params => Axios.post('/withdraw/queryValidSettleWithdrawList',params);
//3.11 提现记录查看批次号详情
export const queryWithdrawByBatchNo = params => Axios.post('/withdraw/queryWithdrawByBatchNo',params);
//3.11 提现记录查看批次号详情
export const againWithdrawApply = params => Axios.post('/withdraw/againWithdrawApply',params);
//3.11 海外银行出账-solarisBank
export const querySolarisBooking = params => Axios.post('/solarisBank/querySolarisBooking',params);
//3.11 海外银行出账-solarisBank-查询所有可以转账的记录
export const queryValidSolarisBooking = params => Axios.post('/solarisBank/queryValidSolarisBooking',params);
//3.11 海外银行出账-solarisBank-打款详情
export const querySolarisBillList = params => Axios.post('/solarisBank/querySolarisBillList',params);
//3.11 海外银行出账-solarisBank-转账
export const solarisBankPayout = params => Axios.post('/solarisBank/payout',params,{JSON:true});
//3.11 海外银行出账-solarisBank-转账
export const querySolarisBookingByTransNo = params => Axios.post('/solarisBank/querySolarisBookingByTransNo',params);
//3.11 海外银行出账-solarisBank-转账
export const querySolarisBankBalance = params => Axios.post('/solarisBank/querySolarisBankBalance',params);
//3.11 海外银行出账-solarisBank-转账选择的渠道
export const querySolarisMappings = params => Axios.post('solarisBank/querySolarisMappings',params);
//3.11 vat出账
export const vatrecordGetOrderPage = params => Axios.get('/vatrecord/getOrderPage',{params});
//3.11 vat出账
export const vatrecordGetTaxPage = params => Axios.get('/vatrecord/getTaxPage',{params});
//3.11 vat出账
export const vatrecordGetOrderById = params => Axios.get('/vatrecord/getOrderById',{params});
//3.11 vat出账
export const vatrecordGetTaxDetailById = params => Axios.get('/vatrecord/getTaxDetailById',{params});
//3.11 vat出账
export const vatrecordUpdateOrderStatus = params => Axios.post('/vatrecord/updateOrderStatus',params);
//3.11 vat出账
export const vatrecordGetTaxStatistics = params => Axios.get('/vatrecord/getTaxStatistics',{params});
//3.11 vat出账
export const vatrecordGetTaxById = params => Axios.get('/vatrecord/getTaxById',{params});
//3.11 vat  确认至税局
export const vatrecordConfirmToTax = params => Axios.post('/vatrecord/confirmToTax',params);
//3.11 vat  
export const vatrecordUpdateStatus = params => Axios.post('/vatrecord/updateStatus',params);
//3.11 vat  
export const vatrecordUpdateTax = params => Axios.post('/vatrecord/updateTax',params);

//3.20 缴税
export const queryPaytaxList= params => Axios.post('/vatPaytax/queryPaytaxList',params);
//3.20 缴税状态统计
export const findStatusCount= params => Axios.post('/vatPaytax/findStatusCount',params);
//3.20 缴税状态统计
export const vatPaytaxSubmit= params => Axios.post('/vatPaytax/submit',params);
//3.20 缴税状态统计
export const vatPaytaxSubmitPay= params => Axios.post('/vatPaytax/submitPay',params);




//四、 权限管理
//4.1 查询用户列表
export const queryUserList = params => Axios.post('/user/queryUserList',params);
//4.2 修改用户状态
export const updateStatus = params => Axios.post('/user/updateStatus',params);
//4.3 查询角色列表
export const queryRoleList = params => Axios.post('/user/queryRoleList',params);
//4.4 查询所有角色
export const queryRoleAll = params => Axios.post('/user/queryRoleAll',params);
//4.5 设置用户角色
export const setUserRole = params => Axios.post('/user/setRole',params);
//4.6 设置添加角色
export const addRole = params => Axios.post('/user/addRole',params);
//4.7 更新角色
export const updateRole = params => Axios.post('/user/updateRole',params);
//4.8 获取资源列表
export const loadAllAuthTree = params => Axios.post('/user/loadAllAuthTree',params);
//4.8 获取角色资源列表
export const loadRoleAuthTree = params => Axios.post('/user/loadRoleAuthTree',params);
//4.9 添加权限资源
export const addAuth = params => Axios.post('/user/addAuth',params);
//4.10 更改权限资源
export const updateAuth = params => Axios.post('/user/updateAuth',params);
//4.11 删除权限资源
export const delAuth = params => Axios.post('/user/delAuth',params);
//4.11 设置角色资源
export const setAuth = params => Axios.post('/user/setAuth',params,{JSON:true});
//4.11 添加员工
export const addUser = params => Axios.post('/user/addUser',params);
//4.11 编辑员工
export const updateUser = params => Axios.post('/user/updateUser',params);
//4.11 员工信息详情
export const queryUserDetail = params => Axios.post('/user/queryUserDetail',params);
//4.11 更改资料
export const updateSelfInfo = params => Axios.post('/user/updateSelfInfo',params);
//4.11 更改密码
export const updateSelfPwd = params => Axios.post('/user/updateSelfPwd',params);

//五、运营模块
//5.1 子账号统计
export const qeurySubAccount = params => Axios.post('/sub/account/allot/detail',params);
//5.1 子账号统计-导入子账号
export const importSubAccount = params => Axios.post('/sub/account/importSubAccount',params);
//5.1 子账号统计-修改子账号状态
export const updateSubAccountStatus = params => Axios.post('/sub/account/updateSubAccountStatus',params);
//5.2 查询子账号状态详情
export const qeurySubAccountAetail = params => Axios.post('/sub/account/detail',params);
//5.3 切换渠道
export const switchChannel = params => Axios.post('/active/or/switch',params);
//5.4 代言人活动管理
export const spokmanActive = params => Axios.post('/activity/manage/index',params);
//5.5 代言人活动管理汇总
export const spokmanTotal = () => Axios.post('/activity/manage/total');
//5.6 代言人活动提现记录
export const spokmanWithdraw = params => Axios.post('/activity/withdraw/index',params);
//5.7 代言人活动提现状态更改
export const spokmanWithdrawUpdate = params => Axios.post('/activity/withdraw/update',params);
//5.8 代言人活动数据监测
export const spokmanDataValid = params => Axios.post('/data/valid/register',params);
//5.8 ebay订单管理
export const queryEbayStoreList = params => Axios.post('/ebayOrderAnalysis/queryEbayStoreList',params);
//5.8 ebay订单状态
export const updateStartOrderId = params => Axios.post('/ebayOrderAnalysis/updateStartOrderId',params);
//5.8 ebay订单下载时间
export const updateDownStatus = params => Axios.post('/ebayOrderAnalysis/updateDownStatus',params);
//5.9 广告管理模块--新建广告
export const saveAdvertisement = params => Axios.post('/advertisement/saveAdvertisement',params);
//5.9 广告管理模块--查询列表
export const queryAdvertisementInfoList   = params => Axios.post('/advertisement/queryAdvertisementInfoList',params);
//5.9 广告管理模块--查询列表
export const advertisementUpdateStatus   = params => Axios.post('/advertisement/updateStatus',params);
//5.9 广告管理模块--查询列表
export const updateAdvertisement   = params => Axios.post('/advertisement/updateAdvertisement',params);
//5.9 运营模块--抽奖小程序查询
export const queryRecordList  = params => Axios.post('/app/activity/prize/queryRecordList',params);
//5.9 运营模块--抽奖小程序关闭
export const closeActivity  = params => Axios.post('/app/activity/closeActivity/1',params);


//六、客户模块
//6.1 客户信息管理列表
export const customerInfo = params => Axios.post('/customer/info',params);
//6.2 销售人员列表
export const queryAllSales = params => Axios.post('/customer/queryAllSales',params);
//6.3 修改客户等级
export const updateCustomerVipStatus = params => Axios.post('/customer/updateCustomerVipStatus',params);
//6.4 修改销售负责人
export const updateCustomerSource = params => Axios.post('/customer/updateCustomerSource',params);
//6.5 客户（店铺）入账明细
export const findInboundStatementDetal = params => Axios.post('/customer/findInboundStatementDetal',params);
//6.5 客户汇率配置列表
export const findCustomerRateList = params => Axios.post('/customer/findCustomerRateList',params);
//6.6 查询汇率区间
export const findRateConfig = params => Axios.post('/customer/findRateConfig',params);
//6.6 新增汇率区间
export const addRateConfig = params => Axios.post('/customer/addRateConfig',params);
//6.6 修改客户费率
export const updateCustomerRate = params => Axios.post('/customer/updateCustomerRate',params);
//6.7 客户流失列表
export const findCustomerLoseList = params => Axios.post('/customer/findCustomerLoseList',params);
//6.8 客户入账统计列表
export const cusFindInboundStatementList = params => Axios.post('/customer/findInboundStatementList',params);
//7.0 更改客户姓名
export const updateCustomerName = params => Axios.post('/customer/updateCustomerName',params);
//7.0 获取客户列表
export const getCustomerList = params => Axios.get('/customer/getList',{ params});
//7.0 获取客户列表
export const getCustomerStatus = params => Axios.get('/dictionary/getList',{ params});
//7.0 获取客户列表
export const distrCustomer = params => Axios.post('/customer/distrCustomer',params);
//7.0 获取客户列表
export const addCustomer = params => Axios.post('/customer/save',params);
//7.0 获取客户列表
export const updateCustomer = params => Axios.post('/customer/updateCustomer',params);
//7.0 获取客户列表
export const checkRegistered = params => Axios.post('/customer/checkRegistered',params);
//7.0 导入客户列表
export const importCustomerByExcel = '/customer/importCustomerByExcel';


//七、店铺模块
//7.1 店铺信息管理列表
export const storeInfo = params => Axios.post('/store/info',params);
//7.1 店铺信息管理列表
export const queryStoreFollowInfo = params => Axios.post('/storeFollow/queryStoreFollowInfo',params);
//7.1 店铺入账统计列表
export const findInboundStatementList = params => Axios.post('/store/findInboundStatementList',params);
//7.1 店铺入账统计列表
export const findStoreLoseList = params => Axios.post('/store/findStoreLoseList',params);
//7.1 店铺入账统计列表
export const findInboundStatementDetal_S = params => Axios.post('/store/findInboundStatementDetal',params);
//7.1 店铺入账统计列表
export const getFlashwithdraw = params => Axios.get('/flashwithdraw/getList',{params});

export const etsyUploadFile = '/etsy/upload';


//八、销售模块
//8.1 销售月入账统计
export const queryMonthinbound = params => Axios.post('/sales/queryMonthinbound',params);
//8.2 单销售每月入账统计
export const queryMonthinboundByYear = params => Axios.post('/sales/queryMonthinboundByYear',params);
//8.3 销售季度入账统计
export const queryMonthinboundByQuarter = params => Axios.post('/sales/queryMonthinboundByQuarter',params);
//8.4 销售月有效客户
export const queryValidCustomer = params => Axios.post('/sales/queryValidCustomer',params);
//8.5 销售年有效客户
export const queryValidCustomerByYear = params => Axios.post('/sales/queryValidCustomerByYear',params);
//8.6 销售季度有效客户
export const queryValidCustomerByQuarter = params => Axios.post('/sales/queryValidCustomerByQuarter',params);
//8.7 销售月流失客户
export const queryLoseCustomer = params => Axios.post('/sales/queryLoseCustomer',params);
//8.8 销售年流失客户
export const queryLoseCustomerByYear = params => Axios.post('/sales/queryLoseCustomerByYear',params);
//8.8 销售季度流失客户
export const queryLoseCustomerByQuarter = params => Axios.post('/sales/queryLoseCustomerByQuarter',params);
//8.8 销售季度流失客户
export const queryFindSaleRoyalty = params => Axios.post('/sale/findSaleRoyalty',params);
//8.8 销售季度流失客户
export const updateSaleRoyalty = params => Axios.post('/sale/updateSaleRoyalty',params);
//8.8 销售季度流失客户
export const getAbleSale = params => Axios.get('/user/getAbleSale',{params});
//8.8 销售简报
export const getStatistic = params => Axios.get('/saleStatistic/getStatistic',{params});
//8.8 销售简报
export const getDisFollowStatistic = params => Axios.get('/saleStatistic/getDisFollowStatistic',{params});
//8.8 销售简报
export const getDictionary = params => Axios.get('/dictionary/getList',{params});
//8.8 销售简报
export const saleRecordList = params => Axios.get('/saleRecord/getList',{params});
//8.8 销售简报
export const saleLogList = params => Axios.get('/saleLog/getList',{params});
//8.8 销售简报
export const AddsaleRecord = params => Axios.post('/saleRecord/save',params);

//九、活动管理
export const getListFlashwithdraw= params => Axios.get('/flashwithdraw/storetaste/getList',{params})
//9.2 添加一个限免店铺
export const addStoreTaste= params => Axios.post('/flashwithdraw/addStoreTaste',params)


//十、 VAT模块
//1. 获取申请列表
export const vatrecordGetList= params => Axios.get('/vatrecord/getList',{params})
//2. 获取申请详情页
export const vatrecordGetByID= params => Axios.get('/vatrecord/getById',{params})
//3. 详情更改状态
export const vatrecordUpdateVatStatus= params => Axios.post('/vatrecord/updateVatStatus',params)
//4. 保存备注
export const vatrecordSaveRemark= params => Axios.post('/vatrecord/saveRemark',params)
//5. 获取备注列表
export const vatrecordGetRemark= params => Axios.get('/vatrecord/getRemark',{params})
//6. 获取申请状态及数量
export const vatrecordGetStatusCount= params => Axios.get('/vatrecord/getStatistics',{params})
//7. 获取申请状态及数量
export const vatrecordUpdateRecordFile= params => Axios.post('/vatrecord/updateRecordFile',params)
//8. 更新税号信息
export const vatrecordUpdateDutyInfo = params => Axios.post('/vatrecord/updateDutyInfo',params)
//8. 更新税号公司信息
export const vatrecordUpdateDutyCompany = params => Axios.post('/vatrecord/updateDutyCompany',params)
//申报列表查询
export const findDeclarationModelList = params => Axios.post('/declaration/findDeclarationModelList',params);
//申报列表状态统计
export const vatFindStatusCount = params => Axios.post('/declaration/findStatusCount',params);

//查询申报数据
export const findByCustomerAndNumer = params => Axios.post('/declaration/findByCustomerAndNumer',params);
//查询申报数据
export const declarationApply= params => Axios.post('/declaration/apply',params,{JSON:true});
//已经提交至服务商
export const declarationSubmitService= params => Axios.post('/declaration/submitService',params);
//
export const declarationRejectData= params => Axios.post('/declaration/rejectData',params);
//已经通知服务商确认税金
export const declarationNotifyService= params => Axios.post('/declaration/notifyService',params);
//上传支付信息
export const declarationRejectPay= params => Axios.post('/declaration/rejectPay',params);
//通知服务商审核支付回执
export const declarationCommitService= params => Axios.post('/declaration/commitService',params);
//审核通过、 审核异常
export const declarationSbmitResult= params => Axios.post('/declaration/submitResult',params);
//金额异议处理中
export const declarationAmountExceptioning= params => Axios.post('/declaration/amountExceptioning',params);
//通知服务商审核支付回执
export const declarationPayConfirm= params => Axios.post('/declaration/payConfirm',params);
//申报重新上传
export const declarationReUpload= params => Axios.post('/declaration/reUpload',params);