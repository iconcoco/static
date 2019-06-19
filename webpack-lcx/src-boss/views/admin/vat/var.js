//申报状态
//英国...
export const STATUS_REPORT_PART1 = [
    {status:0,name:'申报数据待上传'},

    {status:1,name:'申报数据已上传，待处理'},
    {status:2,name:'申报金额计算中'},

    {status:3,name:'申报金额待确认'},

    {status:4,name:'申报金额有异议'},
    {status:13,name:'申报金额异议处理中'},

    {status:5,name:'申报金额已确认，待处理'},
    {status:6,name:'提交税局中'},

    {status:7,name:'支付信息下发，支付回执待上传'},
    
    {status:9,name:'申报金额已缴纳，待审核'},

    {status:8,name:'支付回执已上传，待处理'},
    {status:10,name:'支付回执审核中'},
    
    {status:11,name:'申报成功'},
    {status:12,name:'申报异常'},
];

//法国、意大利、西班牙
export const STATUS_REPORT_PART2 = [
    {status:0,name:'申报数据待上传'},
    {status:1,name:'申报数据已上传，待处理'},
    {status:2,name:'申报金额计算中'},
    {status:3,name:'申报金额待确认'},

    {status:4,name:'申报金额有异议'},
    {status:14,name:'申报金额异议处理中'},
    
    {status:5,name:'申报金额已确认，待缴纳税金'},

    {status:6,name:'申报金额已缴纳，待审核'},
    {status:7,name:'支付回执已上传，待处理'},
    {status:16,name:'支付回执审核中'},
    
    {status:9,name:'支付回执审核失败'},

    {status:15,name:'支付金额审核失败'},

    {status:8,name:'待付款至税局'},
    {status:13,name:'已付款至税代，待处理'},

    {status:10,name:'提交税局中'},
    {status:11,name:'申报成功'},
    {status:12,name:'申报异常'},

];

//缴税状态
export const PAY_STATUS = [
    {status:0,customerStatus:[0],name:'待支付'},
    {status:1,customerStatus:[1],name:'待审核'},
    {status:2,customerStatus:[2],name:'审核失败'},
    {status:3,customerStatus:[3],name:'审核通过，未发起付款'},
    {status:4,customerStatus:[4,7],name:'付款中'},
    {status:7,name:'付款中'},
    
    {status:5,customerStatus:[5],name:'缴税成功'},
    {status:6,customerStatus:[6],name:'缴税失败'},
];