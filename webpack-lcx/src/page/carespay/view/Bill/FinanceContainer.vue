<template>
    <div class="fadeIn">
        <ul class="FinaceTab">
            <li :class="{active:form.type==1}">
                <label for="label-input-one">提现记录</label>
                <input id="label-input-one" type="radio" value="1"  v-model="form.type" name="type">
            </li>
            <li :class="{active:form.type==2}">
                <label for="label-input-two">账单明细</label>
                <input id="label-input-two" type="radio" value="2"  v-model="form.type" name="type">
            </li>
            <li :class="{active:form.type==3}">
                <label for="label-input-three">付款记录</label>
                <input id="label-input-three" type="radio" value="3"  v-model="form.type" name="type">
            </li>
        </ul>
        <div class="cares-main">
            <h2 class="banner-module-title">
                <template v-if="form.type==1">提现记录</template>
                <template v-if="form.type==2">账单明细</template>
                <template v-if="form.type==3">付款记录</template>
            </h2>
                <!--主体内容-->
            <ElForm :model="form" :inline="true">

                <ElFormItem label="查询时间：">
                    <el-date-picker
                        type="daterange"
                        v-model="searceFormTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                         @change="(value)=>{ return this.handleChange(value,'search') }"
                        >
                    </el-date-picker>
                </ElFormItem>

                <span :class="{active:searceLi==1}" @click="changeStartDate(1,true)" class="time-zone">1个月</span>
                <span :class="{active:searceLi==2}" @click="changeStartDate(2,true)" class="time-zone">3个月</span>
                <span :class="{active:searceLi==3}" @click="changeStartDate(3,true)" class="time-zone">1年</span>

                <br/>
                <ElFormItem label="平台：" v-if="form.type != 3">
                    <el-select v-model="form.platformId" placeholder="请选择平台" class="stationName">
                        <el-option label="所有平台" value=""></el-option>
                        <el-option
                            v-for="(item,index) in platTypeArr"
                            :key="index"
                            :label="item.platformName"
                            :value="item.platformCode">
                        </el-option>
                    </el-select>
                </ElFormItem>

                <ElFormItem label="店铺：" v-if="form.type!=3">
                    <el-select v-model="form.storeId" @change="bindSearch(1)" placeholder="请选择店铺">
                        <el-option label="全部店铺" value=""></el-option>
                        <el-option
                            v-for="(item,index) in Fstore"
                            :key="index"
                            :label="item.storeName"
                            :value="item.storeId">
                        </el-option>
                    </el-select>
                </ElFormItem>

                <ElFormItem label="币种：">
                    <el-select v-model="form.currency" @change="bindSearch(1)" placeholder="请选择币种">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item,index) in currencyArr"
                            :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode">
                        </el-option>
                    </el-select>
                </ElFormItem>

                <ElFormItem label="状态：" v-if="form.type==3">
                    <el-select v-model="form.status" @change="bindSearch(1)" placeholder="请选择类型">
                        <el-option v-for="(item,index) in PayStatus" :key="index"
                            :label="item.name"
                            :value="item.status"
                        ></el-option>
                    </el-select>
                </ElFormItem>

                <ElFormItem label="类型：" v-if="form.type==2">
                    <el-select v-model="form.statementType" @change="bindSearch(1)" placeholder="请选择类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="入账" value="3"></el-option>
                        <el-option label="提现" value="1"></el-option>
                        <el-option label="VAT缴税" value="2"></el-option>
                    </el-select>
                </ElFormItem>

                <span class="cares-button-primary fr pain" style="margin-top:3px;" @click="open">导出明细</span>
            </ElForm>

            <!-- 账单明细 -->
            <Bill 
                v-show="switchType==2"
                v-model="billData"
            ></Bill>
            <!-- 提现记录 -->
            <Record 
                v-show="switchType==1"
                :data='recordData'
            ></Record>
            <!-- 提现记录 -->
            <PayRecord 
                v-show="switchType==3"
                :data="PayRecordData"
            ></PayRecord>

        </div>

          <!--分页 -->
          <div class="bill-page-container">
                <Pagination
                :page='form.pageNum'
                :pageSize='form.pageSize'
                :count='form.total'
                :countSize='form.totalSize'
                :chosefallback='bindChosePage'
                ></Pagination>
          </div>

        <!-- 导出明细弹窗 -->
         <el-popover class="caras-reminder cares-padding" v-model="Visible">
            <div class="cares-content border-radius-8" :class="{fadeIn:Visible}">
                <h4 class="title">导出明细</h4>
                
                <form>
                    <div class="form-item" >
                        <span>起止时间</span>
                        <div>
                            <el-date-picker
                                type="daterange"
                                v-model="exportFormTime"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                 @change="(value)=>{ return this.handleChange(value,'time') }"
                                >
                            </el-date-picker>
                        </div>
                    </div>

                    <div class="oter-item">
                        <span>快捷选择</span>
                        <div>
                            <ul class="clearfix">
                                <li :class="{active:exportLi==1}" style="margin-left:-30px;">
                                    <div>
                                        <i></i>
                                        <p @click="changeStartDate(1)">前一个月</p>
                                    </div>
                                </li>
                                <li :class="{active:exportLi==2}">
                                    <div>
                                        <i></i>
                                        <p @click="changeStartDate(2)">前三个月</p>
                                    </div>
                                    
                                </li>
                                <li :class="{active:exportLi==3}">
                                    <div>
                                        <i></i>
                                        <p @click="changeStartDate(3)">前一年</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-item line" v-if="form.type != 3">
                        <span>选择店铺</span>
                        <div>
                            <el-cascader
                            v-model="exportStore"
                                :options="options"
                                @change="(value)=>{ return this.handleChange(value,'store') }"
                                >
                            </el-cascader>
                        </div>
                    </div>

                     <!--文件类型-->
                    <div class="form-item line">
                        <span>文件类型</span>
                        <div class="fileType-Select">
                            <label :class="{active:exportForm.fileType==1}" for="fileType_E">Excel</label>
                            <label :class="{active:exportForm.fileType==2}" for="fileType_P">PDF</label>

                            <input id="fileType_E" type="radio" v-model="exportForm.fileType"  value="1">
                            <input id="fileType_P" type="radio" v-model="exportForm.fileType"  value="2">
                        </div>
                    </div>
                    
                    <!--按钮-->
                    <div class="button-comfirm">
                        <span class="cares-button-primary public-btn comfirm-export" @click="comfirmExport">确定导出</span><br/>
                        <span class="ING" @click="open">取消</span>
                    </div>
                    
                </form>
            </div>
        </el-popover>

    </div>
</template>

<script>
    import { 
        exprotWithdraw,         //导出提现记录
        queryWithdrawList,          //提现记录
        expStatement,               //导出明细、
        statementList,              //获取店铺账单
        vatrecordGetVatDetailList,              //获取付款记录
        existExpStatement,           
        existExprotWithdrawList,           
        existVatDetailList,           
        exprotVatDetailList,           
    } from '../../../../js/api.js';//

    import {
        queryCurrencyList,          //获取币种列表
        queryPlatformType,          //获取平台列表
        queryStoreList              //获取店铺列表
    } from '../../utils/localbase.js';

    import Bill from './Bill.vue';
    import Record from './PresentRecord.vue';
    import PayRecord from './PayRecord.vue';

    export default {
        data(){
             return {
                searceLi:'',
                searceFormTime:"",
                exportFormTime:"",
                exportStore:["",""],
                Visible:false,                          //控制导出明细弹出框隐藏显示
                //查询的表单数据
                form:{
                    type: '2',                          //1. 提现记录  2. 账单明细  3.付款记录
                    platformId:'',                      //平台类型的选择
                    storeId:'',                         //店铺的选择
                    currency:'',                         //查询币种
                    status:'',                          //状态

                    statementType:'',
                    startDate:'',                       //开始时间
                    endDate:'',                         //结束时间

                    pageNum:'1',                        //第几页
                    pageSize:'10',                      //每页多少条记录
                    total:'1',                          //总共多少页
                    totalSize:'1',                          //总共多少记录
                },
                //导出表格的数据
                exportForm:{
                    fileType:'1',                        //导出文件的类型，1.excel 2.pdf
                    startTime:``,                       //店铺ID
                    endTime:``,                         //店铺ID
                    platformId:``,                       //平台ID
                    storeId:``,                         //店铺ID
                },

                billData:[],                          //明细数据
                recordData:[],                        //账单记录数据
                PayRecordData:[],
                
                Fstore:[],
                switchType:'',
                platTypeArr:[],                         //平台类型的数组
                storeArr:[],                            //店铺列表
                currencyArr:[],                            //店铺列表
                PayStatus:[
                    {status:'',name:'全部'},
                    {status:'1',name:'待支付'},
                    {status:'2',name:'支付成功'},
                    {status:'3',name:'支付失败'},
                    {status:'4',name:'取消'},
                    {status:'5',name:'退款'},
                    {status:'6',name:'已退款'},
                ],

                options:[],
                exportLi:null,
            }
        },
        created () {
            this.switchType = this.form.type;
            //平台类型
            Promise.all([
              queryPlatformType(),
              queryStoreList(),  
              queryCurrencyList(),
            ]).then(([plat,store,currency])=>{
                this.platTypeArr = plat;
                this.storeArr = store;
                this.currencyArr = currency;

                //刚进入选择所有的店铺
                this.Fstore = store;

                 //2019-2-27  导出表格数据  店铺归类
                (function(){
                    let options = [
                        {
                            label:'全部平台',
                            value:'',
                            children:[{
                                    label:"全部店铺",
                                    value:"",
                                }
                            ]
                        }
                    ];
                    //1. 循环做联动菜单
                    this.platTypeArr.forEach(platItem=>{

                        let menuOptions = {
                            label:platItem.platformName,
                            value:platItem.platformCode,
                            children:[
                                {
                                    label:"全部",
                                    value:"",
                                }
                            ],
                        };
                        //对应的子菜单
                        this.storeArr.forEach(storeItem=>{
                            //对应的平台
                            if(storeItem.platformCode == platItem.platformCode){ 
                                menuOptions.children.push({
                                    label:storeItem.storeName,
                                    value:storeItem.storeId,
                                })
                            };
                            
                        });

                        options.push(menuOptions);

                    });
                    //2. 赋值
                    this.options = options;

                }).bind(this)();
            });
            //默认选择一月
            this.changeStartDate(1,true);
        },
        methods: {
            //请求->账单明细
            queryStatementList(params){
                let f = {
                    platformId:this.form.platformId,
                    storeId:this.form.storeId,
                    businessType:this.form.statementType,
                };
                statementList(Object.assign(f,params)).then(res=>{
                    if(res.code==0){
                        // this.$Message.success(`查询成功`);
                        this.billData = res.data;

                        this.form.total = res.page.total
                        this.form.totalSize = res.page.totalSize
                    }else{
                        this.$Message.error(res.msg);
                    }
                    //展示的表格
                    this.switchType = this.form.type;

                })
            },
            //请求->获取提现记录
            queryPresentRecord(params){
                 let f = {
                    platformId:this.form.platformId,
                    storeId:this.form.storeId,
                };
                queryWithdrawList(Object.assign(f,params)).then(res=>{
                    if(res.code==0){
                        // this.$Message.success(`查询成功`);
                        this.recordData = res.data;

                        this.form.total = res.page.total
                        this.form.totalSize = res.page.totalSize
                    }else{
                        this.$Message.error(res.msg);
                    }
                    //展示的表格
                    this.switchType = this.form.type;
                })
            },
            //请求->付款记录
            queryPayRecord(params){
                  let f = {
                    status:this.form.status,
                    };
                vatrecordGetVatDetailList(Object.assign(f,params)).then(res=>{
                    if(res.code==0){
                        this.PayRecordData = res.data;

                        this.form.total = res.page.total
                        this.form.totalSize = res.page.totalSize
                    }else{
                        this.$Message.error(res.msg);
                    }
                });

                 //展示的表格
                this.switchType = this.form.type;
            },
            //点击查询按钮
            bindSearch(val){
                 //展示的表格
                //
                this.form.startDate = this.searceFormTime ? this.searceFormTime[0] : '';
                this.form.endDate = this.searceFormTime ? `${this.searceFormTime[1]} 23:59:59` : '';

                this.form.pageNum = val;
                this.switchType = this.form.type;


                let {
                    startDate,currency, endDate, pageNum,pageSize,                      //每页多少条记录
                } = this.form;

                let commonForm ={startDate, currency,endDate, pageNum,pageSize};

                switch(this.form.type){
                    case `1`:
                    {   //提现记录
                    this.queryPresentRecord(commonForm);
                    }
                    break;
                    case `2`:
                    {   //账单明细
                    this.queryStatementList(commonForm);
                    }
                    break;
                    case `3`:
                    {   //付款记录
                    this.queryPayRecord(commonForm);
                    }
                    break;
                }
            },
            //分页组件的回调函数
            bindChosePage(val,pageSize){
              
               this.form.pageSize = pageSize;
               this.bindSearch(val);
            },
            open(){
                this.Visible = !this.Visible;
            },
            changeStartDate(flag,bol){
                var startDate = '';
                var curDate = new Date();
                var days = curDate.getDate();
                if(flag == 1){
                    startDate = this.addDate(curDate,-1,days);
                }else if(flag == 2){
                    startDate = this.addDate(curDate,-3,days);
                }else if(flag == 3){
                    startDate = this.addDate(curDate,-12,days);
                }

                if(bol){
                    if(this.searceLi == flag) return;
                    
                    this.searceLi = flag;
                    this.searceFormTime = [startDate,this.addDate(curDate,0,days)];
                    this.bindSearch(1);
                }else{
                    this.exportLi = flag;

                    this.exportForm.startTime = startDate;
                    this.exportForm.endTime = this.addDate(curDate,0,days);
                    this.exportFormTime = [startDate,this.addDate(curDate,0,days)];
                }
            },
            addDate(date,menths,days){
                var D=new Date(date);

                let re = D.setMonth(D.getMonth() + menths ,days);
                let y = new Date(re).getFullYear();
                let m = new Date(re).getMonth()+1;
                let d = new Date(re).getDate();
                return `${y}-${m<10? '0'+m : m }-${d<10 ? '0'+d:d}`;
            },
            //确认导出功能
            comfirmExport(){
                //检验日期

                for (const key in this.exportForm) {
                    if(!this.exportForm[key]){
                        let msg = null;
                        switch(key){
                            // case 'platformId':{msg='请选择需要导出数据的店铺' } break;
                            // case 'storeId':{msg='请选择需要导出数据的店铺' } break;
                            case 'startTime':{msg='请选择开始时间' } break;
                            case 'endTime':{msg='请选择结束时间' } break;
                        };
                        
                        if(msg) return this.$Message.warning(msg);
                    }
                };

                function time(val){
                    return new Date(val).getTime();
                };

                if(time(this.exportForm.startTime)>time(this.exportForm.endTime)) return this.$Message.error(`请重新选择时间的范围`);

                switch(Number(this.form.type)){
                    case 1 : 
                        {
                             existExprotWithdrawList(this.exportForm).then(res=>{
                                if(res.code==0){
                                    res.data ? (
                                        this.open(),
                                        window.open(`${exprotWithdraw}?uuid=${res.data}&fileType=${this.exportForm.fileType}`)
                                    ):(this.$Message.warning('没有相关记录！'));
                                }else{
                                    this.$Message.error(res.msg);
                                }
                            });  
                        } 
                    break;
                    case 2 : 
                        {
                            existExpStatement(this.exportForm).then(res=>{
                                if(res.code==0){
                                    res.data ? (
                                        this.open(),
                                        window.open(`${expStatement}?uuid=${res.data}&fileType=${this.exportForm.fileType}`)
                                    ):(this.$Message.warning('没有相关记录！'));
                                }else{
                                    this.$Message.error(res.msg);
                                }
                            });
                        } 
                    break;
                    case 3 : 
                    {
                        this.exportForm.platformId = ``, this.exportForm.storeId =`` ;                      //店铺I;
                        existVatDetailList(this.exportForm).then(res=>{
                            if(res.code==0){
                                res.data ? (
                                    this.open(),
                                    window.open(`${exprotVatDetailList}?uuid=${res.data}&fileType=${this.exportForm.fileType}`)
                                ):(this.$Message.warning('没有相关记录！'));
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                    break;
                };
                
            },

           handleChange(value,type){
               if(type=='time'){
                    this.exportForm["startTime"] = value ? value[0] : '',
                    this.exportForm["endTime"] = value ? value[1] : '';

                    this.exportLi= null;
               };
               if(type == 'store'){
                   this.exportForm.platformId =  value[0];
                   this.exportForm.storeId =  value[1];
               }
               if(type == 'search'){
                   this.searceLi= null;
                    this.bindSearch(1);
               }
           },

        },
        watch:{
            'form.type'(){
                this.bindSearch(1)
            },
            'form.platformId'(code){
                let FARRAY = [];
                this.form.storeId="";
                this.storeArr.forEach(item=>{
                    if(item.platformCode == code){ FARRAY.push(item) };
                });
                this.Fstore = FARRAY;

                this.bindSearch(1);
            },
        },
        components:{
            Bill,
            PayRecord,
            Record
        }
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
.FinaceTab{
    height: 36px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    margin-bottom: 10px;
    li{
        width: 30%;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        transition: all .2s;
        label{
            display: inline-block;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        input{
            display: none;
        }

        &.active{
            background-color: $--color-primary-two;
            color: #fff;
        }
    }
}

.el-form-item{
    margin-right: 10px;
}

.time-zone{
    display: inline-block;
    width: 120px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    margin-right: 15px;
    cursor: pointer;
    &.active{
        border-color: $--color-primary-one;
        background:url('../../../../images/carepay/band_select.png') no-repeat right bottom;
    }
}

    //内容
.cares-main{
    min-height: 500px;
    padding-bottom: 20px;
    form{
        padding: 20px 0;
        font-size: 14px;
        color:#666;
        border-bottom:1px solid #f1f1f1;
        margin-bottom: 10px;
        padding-bottom:0px;
        .el-button{
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
        }
        //类型的选择
        .el-select{
            width: 160px;
        }
    }
}
</style>


<style lang="scss">
    @import './../../../../css/common/theme.scss';

   .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:240px;
    }
    .el-input--prefix .el-input__inner{
        padding-left: 28px !important;
    }

    .el-select{
        width: 240px;
    }

    .cares-main{
        .el-form-item__label{
            padding:0;
            margin-right:10px;
        }
        .el-form-item{
            margin-right:20px;
        }
    }
    //弹出框
    .caras-reminder{
        .cares-content{
            width:365px;
            height: 450px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -225px;
            margin-left: -236px;
            //标题
            h4.title{
                line-height: 60px;
                text-align: center;
                font-weight: normal;
                font-size: 16px;
                color:#333;
                border-radius: 8px 8px 0px 0px;
            }
            form{
                padding:0 20px;
                .form-item{
                    padding-bottom:20px;
                    margin-bottom:5px;
                    >span{
                        display: block;
                    }
                    .item{
                            //单独控制选择切换
                            text-align: center;
                            font-size: 14px;
                            display: inline-block;
                        p{
                            display: inline-block;
                            font-size: 12px;
                            color:#f15a24;
                            cursor: pointer;
                            >span{
                                border-bottom: 1px solid #f15a24;
                            }
                        }
                    }

                    .fileType-Select{
                        input{
                            display: none;
                        }
                        label{
                            display: inline-block;
                            width: 60px;
                            height: 30px;
                            border: 1px solid #fff;
                            border-radius: 15px;
                            line-height: 30px;
                            text-align: center;
                            cursor: pointer;
                            &.active{
                                border-color: $--color-primary-one;
                                background-color: $--color-primary-one;
                                color: #fff;
                            }
                        }
                    }
                }
                //按钮
                .button-comfirm{
                    padding-top:12px;
                    text-align: center;
                    >span{
                        width: 50%;
                        margin-bottom: 10px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }
            }

            .oter-item{
                padding-bottom: 15px;
                border-bottom: 1px solid #f1f1f1;
                >span{
                    display: inline-block;
                    color: #999;
                    vertical-align: top;
                    position: relative;
                    padding-right: 20px;
                    margin-top: -6px;
                }
                >div{
                     display: inline-block;
                }

                ul{
                    height: 4px;
                    border-radius: 2px;
                    background-color: #ddd;
                    li{
                        display: inline-block;
                        color: #ddd;
                        // border-top: 4px solid #999;
                        position: relative;
                        width: 80px;
                        i{
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: #fff;
                            border: 2px solid #ddd;
                        }
                        >div{
                            position: absolute;
                            width: 100%;
                            text-align: center;
                            top: -23px;
                            right: -40px;
                            background: transparent;
                            z-index: 2;
                            p{
                                cursor: pointer;
                            }
                        }
                        &.active{
                            i{
                                width: 8px;
                                height: 8px;
                                border-color: $--color-primary-two-hover;
                            }
                            p{
                                color:#333;
                            }
                        }
                    }
                }
            }
        }
    }

</style>
