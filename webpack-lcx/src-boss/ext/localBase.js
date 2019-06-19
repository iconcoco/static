import { Message } from 'element-ui';

import {
    queryPlatformInfo,
    queryForeignBankList,
    queryCurrencyList,
    queryChannelInfo,
    queryProvinceInfo,
    queryAllSales,
    findRateConfig,
    getAbleSale,
    getCustomerStatus
} from '../utils/axios/api';

// 1. 平台列表
export const queryPlatform = async ()=>{
    let data = sessionStorage.getItem('PlatformInfo');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryPlatformInfo()
       if(res.code==0){
           let local = [
               {
                platformCode:"",
                platformName:"所有平台"
            }];
            local = local.concat(res.data);
           sessionStorage.setItem(`PlatformInfo`,JSON.stringify(local));
           return local;
       }else{
           Message.error(res.msg)
       }
    }
}

// 2. 国外银行列表
export const queryForeignBank = async ()=>{
    let data = sessionStorage.getItem('ForeignBank');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryForeignBankList({bankType:'2'})
       if(res.code==0){
            let local = [
            {
                bankCode:"",
                bankName:"全部"
            }];
            local = local.concat(res.data);
            sessionStorage.setItem(`ForeignBank`,JSON.stringify(local));
            return local;
       }else{
           Message.error(res.msg)
       }
    }
}

// 2. 国内银行列表
export const queryCHNBank = async ()=>{
    let data = sessionStorage.getItem('CHNBank');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryForeignBankList({bankType:'1'})
       if(res.code==0){
            // let local = [
            // {
            //     bankCode:"",
            //     bankName:"全部"
            // }];
            // local = local.concat(res.data);
            sessionStorage.setItem(`CHNBank`,JSON.stringify(res.data));
            return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}

// 3. 币种列表
export const queryCurrency = async ()=>{
    let data = sessionStorage.getItem('Currency');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryCurrencyList()
       if(res.code==0){
        let local = [
            {
                currencyCode:"",
                currencyName:"所有币种"
            }];
            local = local.concat(res.data);
            sessionStorage.setItem(`Currency`,JSON.stringify(local));
            return local;
       }else{
           Message.error(res.msg)
       }
    }
}

// 4. 渠道信息
export const queryChannel = async ()=>{
    let data = sessionStorage.getItem('Channel');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryChannelInfo()
       if(res.code==0){
        let local = [
            {
                channelCode:"",
                channelName:"所有渠道"
            }];
            local = local.concat(res.data);
            sessionStorage.setItem(`Channel`,JSON.stringify(local));
            return local;
       }else{
           Message.error(res.msg)
       }
    }
}

// 4.22 省份列表的查询
export const queryProvince = async ()=>{
    let data = sessionStorage.getItem('Province');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryProvinceInfo()
       if(res.code==0){
        let local = [
            {
                provinceCode: "",
                provinceName: "请选择省份"
            }];
            local = local.concat(res.data);
            sessionStorage.setItem(`Province`,JSON.stringify(local));
            return local;
       }else{
           Message.error(res.msg)
       }
    }
}

// 4.23 所有销售人员的数据
export const queryAllSalesData = async ()=>{
    let data = sessionStorage.getItem('AllSales');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryAllSales()
       if(res.code==0){
            sessionStorage.setItem(`AllSales`,JSON.stringify(res.data.content));
            return res.data.content;
       }else{
           Message.error(res.msg)
       }
    }
}
// 4.23 
export const queryAbleSale = async ()=>{
    let data = sessionStorage.getItem('AbleSale');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await getAbleSale()
       if(res.code==0){
            sessionStorage.setItem(`AbleSale`,JSON.stringify(res.data));
            return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}


// 4.23 汇率区间
export const queryRateZoom = async ()=>{
    let data = sessionStorage.getItem('rateZoom');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await findRateConfig()
       if(res.code==0){
            let r = [];
            res.data.map(item=>{
                let t = {};
                for (const key in item) {
                    t["ratePlat"] = key;
                    t["rateCode"] = item[key];
                }
                r.push(t);
            });
            sessionStorage.setItem(`rateZoom`,JSON.stringify(r));
            return r ;
       }else{
           Message.error(res.msg)
       }
    }
}

// 4.23 
export const queryCustomerStatus = async ()=>{
    let data = sessionStorage.getItem('CustomerStatus');
    if(data){
        return JSON.parse(data);
    }else{
       let res = await getCustomerStatus({type:2})
       if(res.code==0){
            sessionStorage.setItem(`CustomerStatus`,JSON.stringify(res.data));
            return res.data ;
       }else{
           Message.error(res.msg)
       }
    }
}


//5. 销售类目
export const salesVolume = [
    {
        saleCode:"1",
        saleName:"小于10万美金"
    },
    {
        saleCode:"2",
        saleName:"10-50万美金"
    },
    {
        saleCode:"3",
        saleName:"50-100万美金"
    },
    {
        saleCode:"4",
        saleName:"大于100万美金"
    },
    // {
    //     saleCode:"4",
    //     saleName:"大于100万美金"
    // },
    
]

//6. 销售类目
export const category = [
    {
        productCode:"1",
        productName:"图书 , 音乐"
    },
    {
        productCode:"2",
        productName:"电影，礼品卡，游戏，虚拟产品"
    },
    {
        productCode:"3",
        productName:"电子产品，电脑，办公用品"
    },
    {
        productCode:"4",
        productName:"居家用品，花园用品/工具"
    },
    {
        productCode:"5",
        productName:"食品"
    },
    {
        productCode:"6",
        productName:"美妆，健康"
    },
    {
        productCode:"7",
        productName:"玩具，婴幼儿用品"
    },
    {
        productCode:"8",
        productName:"服装，鞋子，珠宝"
    },
    {
        productCode:"9",
        productName:"手工制品"
    },
    {
        productCode:"10",
        productName:"运动，户外用品"
    },
    {
        productCode:"11",
        productName:"汽车用品，工业/科学用品"
    },
    {
        productCode:"13",
        productName:"珠宝，古董，艺术品，收藏品"
    },
    {
        productCode:"12",
        productName:"其他"
    },
]

//7.店铺经营时长
export const dealInTime = [
    {
        bizTimeCode:'1',
        bizTimeName:'>180 days'
       
    },
    {
        bizTimeCode:'2',
        bizTimeName:'>90 days and ≤180 days'
    },
    {
        bizTimeCode:'3',
        bizTimeName:'≤90 days'
    },
];


//8.负面评价
export const negativeComment = [
    {
        negativeCommentCode:'1',
        negativeCommentName:'<10%'
    },
    {
        negativeCommentCode:'2',
        negativeCommentName:'≥10% and <30%'
    },
    {
        negativeCommentCode:'3',
        negativeCommentName:'≥30%'
        
    },
];

//9.负面评价
export const goodsPrice = [
    {
        goodsPriceCode:'1',
        goodsPriceName:'≤200% industrial level'
    },
    {
        goodsPriceCode:'2',
        goodsPriceName:'>200% and <300% industrial level'
    },
    {
        goodsPriceCode:'3',
        goodsPriceName:'≥300% industrial level'
    },
];

//10. 名单筛选
export const googleNews = [
    {
        googleNewsCode:'2',
        googleNewsName:'非金融类负面新闻'
    },
    {
        googleNewsCode:'3',
        googleNewsName:'金融类负面新闻'
    },
    {
        googleNewsCode:'4',
        googleNewsName:'政要人物'
    },
    {
        googleNewsCode:'1',
        googleNewsName:'无'
    },
];

//11. 企业注册时长
export const registerDate = [
    {
        registerDateCode:'1',
        registerDateName:'≥ 3 years'
    },
    {
        registerDateCode:'2',
        registerDateName:'> 6 months and < 3 years'
    },
    {
        registerDateCode:'3',
        registerDateName:'≤6 months'
    },
];

//12. 企业经营范围
export const bizScope = [
    {
        bizScopeCode:'3',
        bizScopeName:'奢侈品、珠宝、虚拟商品、及金融服务'
    },
    {
        bizScopeCode:'2',
        bizScopeName:'进出口贸易'
    },
    {
        bizScopeCode:'1',
        bizScopeName:'其他'
    },
];

//13. 企业类型
export const enterpriseType = [
    {
        enterpriseTypeCode:'3',
        enterpriseTypeName:'非上市公司且股东架构超过3层自然人股东'
    },
    {
        enterpriseTypeCode:'2',
        enterpriseTypeName:'个人独资'
    },
    {
        enterpriseTypeCode:'1',
        enterpriseTypeName:'其他'
    },
];

//13. 关系建立渠道
export const registerChannelType = [
    {
        registerChannelCode:'3',
        registerChannelName:'客户自行注册'
    },
    {
        registerChannelCode:'2',
        registerChannelName:'代理人或销售或客户之间推荐'
    },
    {
        registerChannelCode:'1',
        registerChannelName:'内部推荐'
    },
];

//14. 企业类型
export const companyType = [
    {
        companyTypeCode:"1",
        companyTypeName:"个人独资"
    },
    {
        companyTypeCode:"2",
        companyTypeName:"合伙企业"
    },
    {
        companyTypeCode:"3",
        companyTypeName:"有限责任公司"
    },
    {
        companyTypeCode:"4",
        companyTypeName:"股份公司"
    },
    {
        companyTypeCode:"5",
        companyTypeName:"集团公司"
    },
    {
        companyTypeCode:"6",
        companyTypeName:"一人制公司"
    },
    {
        companyTypeCode:"7",
        companyTypeName:"其他"
    },
];


//15. 客户来源
let CCC = {
    "0":"普通用户",
    "1":"活动大使",
    "2":"代言人",
    "3":"代言人客户",
    
    "7":"公众号",
    "8":"今日头条",
    "9":"微博/博客/知乎等社区",
    //修改
    "5":"必创优惠一通道",
    "6":"必创优惠二通道",
    "10":"亿丰优惠一通道",
    "11":"亿丰优惠二通道",
    "12":"侃侃文化合作通道（返佣）",
    "13":"雨果网注册通道",
    "15":"思路渠道文章发布",
    "16":"侃侃公众号",
    "50":"官网来源",
    "51":"其他来源",
};

export const custemerSource = async ()=>{
    let res = await queryAllSalesData();
    res.forEach(item=>{
        item.source && (CCC[item.source] = item.userName)
    });

    return CCC
};

//15. 客户登记
export const custemerVIP = [
    {
        status:"0",
        name:"普通客户"
    },
    {
        status:"1",
        name:"大使客户"
    },
];

//16. 客户状态

export const custemerStatus = [
    {
        status:1,
        name:"未提交实名认证"
    },
    {
        status:2,
        name:"实名认证审核中"
    },
    {
        status:3,
        name:"实名认证审核失败"
    },
    {
        status:4,
        name:"待绑定有效店铺"
    },
    {
        status:5,
        name:"待入账"
    },
    {
        status:6,
        name:"有效"
    },
    {
        status:7,
        name:"部分流失"
    },
    {
        status:8,
        name:"全部流失"
    },
]

//17.店铺状态
export const storeStatus = [
    {code:1,status:'待完善'},
    {code:2,status:'审核中'},
    {code:3,status:'审核失败'},
    {code:4,status:'待入账'},
    {code:5,status:'有效店铺'},
    {code:6,status:'流失店铺'},
];

 //18. vat申请状态
export const vatApplyStatus = [
    {status:0,name:'Pending'},
    {status:1,name:'申请成功'},
    {status:2,name:'申请异常'},
    {status:3,name:'待支付'},
    {status:4,name:'支付中'},
    {status:5,name:'支付失败'},
    {status:6,name:'已支付，待处理'},
    {status:7,name:'支付审核中'},
    {status:8,name:'申请中'},
    {status:9,name:'税号待完善'},
];

 //19. 国家对应code
 export const NationCode = [
    { 
        nation:'美国',
        code:'US',
        platformCode:'BM',
    },
    { 
        nation:'加拿大',
        code:'CA',
        platformCode:'BM',
    },
    { 
        nation:'墨西哥',
        code:'MX',
        platformCode:'BM',
    },
    // 欧洲站
    { 
        nation:'德国',
        code:'DE',
        platformCode:'EU',
    },
    { 
        nation:'西班牙',
        code:'ES',
        platformCode:'EU',
    },
    { 
        nation:'法国',
        code:'FR',
        platformCode:'EU',
    },
    { 
        nation:'英国',
        code:'GB',
        platformCode:'EU',
    },
    { 
        nation:'意大利',
        code:'IT',
        platformCode:'EU',
    },
    // 印度
    { 
        nation:'印度',
        code:'IN',
        platformCode:'YD',
    },
 ];

//20 . 所有国家
 export const AllNationCode =[
    {
        nation:'波兰',
        code:'PL',
        platformCode:'EU',
    },
    {
        nation:'捷克',
        code:'CZ',
        platformCode:'EU',
    },
    ...NationCode
];

 //