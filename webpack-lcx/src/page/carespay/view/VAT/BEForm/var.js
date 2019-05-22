//英国...
export const STATUS_PART1 = [
    {status:0,name:'待申报',customerStatus:[0]},

    {status:1,name:'申报金额计算中',customerStatus:[1,2]},
    {status:2,name:'申报金额计算中'},

    {status:3,name:'申报金额待确认',customerStatus:[3]},

    {status:4,name:'申报金额有异议',customerStatus:[4,13]},
    {status:13,name:'申报金额有异议'},

    {status:5,name:'提交税局中',customerStatus:[5,6]},
    {status:6,name:'提交税局中'},

    {status:7,name:'支付信息下发，支付回执待上传',customerStatus:[7]},
    
    {status:9,name:'申报金额已缴纳，审核中',customerStatus:[9]},

    {status:8,name:'支付回执审核中',customerStatus:[8,10]},
    {status:10,name:'支付回执审核中'},

    
    {status:11,name:'申报成功',customerStatus:[11]},
    {status:12,name:'申报异常',customerStatus:[12]},

    
];

//法国、意大利、西班牙
export const STATUS_PART2 = [
    {status:0,name:'待申报',customerStatus:[0]},
    {status:1,name:'申报金额计算中',customerStatus:[1,2]},
    {status:2,name:'申报金额计算中'},

    {status:3,name:'申报金额待确认',customerStatus:[3]},

    {status:4,name:'申报金额有异议',customerStatus:[4,14]},
    {status:14,name:'申报金额有异议'},

    {status:5,name:'待缴纳税金',customerStatus:[5]},

    {status:6,name:'申报审核中',customerStatus:[6,7,16]},
    {status:7,name:'申报审核中'},
    {status:16,name:'申报审核中'},

    {status:9,name:'申报审核失败',customerStatus:[9,15]},
    {status:15,name:'申报审核失败'},


    {status:8,name:'提交税局中',customerStatus:[8,10,13]},
    {status:13,name:'提交税局中'},
    {status:10,name:'提交税局中'},

    {status:11,name:'申报成功',customerStatus:[11]},
    {status:12,name:'申报异常',customerStatus:[12]},
];


//缴税状态
export const PAY_STATUS = [
    {status:0,name:'待支付',customerStatus:[0]},
    {status:1,name:'待审核',customerStatus:[1]},

    {status:2,name:'审核失败',customerStatus:[2]},
    {status:3,name:'付款税局中',customerStatus:[3,4,7]},
    {status:4,name:'付款税局中'},
    {status:7,name:'付款税局中'},

    {status:5,name:'缴税成功',customerStatus:[5]},
    {status:6,name:'缴税失败',customerStatus:[6]},

]