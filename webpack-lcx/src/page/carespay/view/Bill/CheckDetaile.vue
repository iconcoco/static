<template>
 <transition name="fade">
    <div>
        <div class="cares-main ">
                <!--主体内容-->
            <form  class="row">
                <!--明细目录-->
                <span>选择类型：</span>
                
                <label for="cash-record" class="select-type" :class="{active:form.type==1}">
                    提现记录
                    <input id="cash-record" type="radio" value="1"  v-model="form.type" name="type">
                </label>

                <label for="withdraw-detaile" class="select-type" :class="{active:form.type==2}">
                    账单明细
                    <input id="withdraw-detaile" type="radio" value="2" v-model="form.type" name="type">
                </label>

                 <el-select v-model="form.platformId" placeholder="请选择平台" class="stationName">
                    <!-- <el-option label="所有平台" value=""></el-option> -->
                    <el-option
                        v-for="(item,index) in platTypeArr"
                        :key="index"
                        :label="item.platformName"
                        :value="item.platformCode">
                    </el-option>
                </el-select>

                <el-select v-model="form.storeId" @change="bindSearch(1)" placeholder="请选择店铺" class="stroeName">
                    <!-- <el-option label="全部店铺" value=""></el-option> -->
                    <el-option
                        v-for="(item,index) in Fstore"
                        :key="index"
                        :label="item.storeName"
                        :value="item.storeId">
                    </el-option>
                </el-select>

                <el-select v-model="form.currency" @change="bindSearch(1)" placeholder="请选择币种" class="stroeName">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="(item,index) in currencyArr"
                        :key="index"
                        :label="item.currencyName"
                        :value="item.currencyCode">
                    </el-option>
                </el-select>

                <!-- <span class="cares-button-primary search"  @click="bindSearch(1)">查询</span> -->
                <span class="cares-button-primary fr pain" style="margin-top:3px;" @click="open">导出明细</span>

            </form>
            <!-- 显示的组件 -->
            <!-- 账单明细 -->
            <Bill v-show="switchType==2"
                v-model="billData"
            ></Bill>
            <!-- 提现记录 -->
            <Record v-show="switchType==1"
                :data='recordData'
            ></Record>

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

                    <div class="form-item line">
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
                        <span class="cares-button-danger public-btn cancel" @click="open">取消</span>
                        <span class="cares-button-primary public-btn comfirm-export" @click="comfirmExport">确定导出</span>
                    </div>
                    
                </form>
            </div>
        </el-popover>

    </div>
 </transition>
</template>

<script>
    import { 
        exprotWithdraw,         //导出提现记录
        queryWithdrawList,          //提现记录
        expStatement,               //导出明细、
        statementList,              //获取店铺账单
        existExpStatement,           
        existExprotWithdrawList,           
    } from '../../../../js/api.js';//

    import {
        queryCurrencyList,          //获取币种列表
        queryPlatformType,          //获取平台列表
        queryStoreList              //获取店铺列表
    } from '../../utils/localbase.js';

    import Bill from './Bill.vue';
    import Record from './PresentRecord.vue';

    export default {
        data(){
             return {
                exportFormTime:"",
                exportStore:[],
                Visible:false,                          //控制导出明细弹出框隐藏显示
                //查询的表单数据
                form:{
                    type: '2',                          //1. 提现记录  2. 账单明细
                    platformId:'',                      //平台类型的选择
                    storeId:'',                         //店铺的选择
                    currency:'',                         //查询币种

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
                
                Fstore:[],
                switchType:'',
                platTypeArr:[],                         //平台类型的数组
                storeArr:[],                            //店铺列表
                currencyArr:[],                            //店铺列表
                billData:[],                          //明细数据
                recordData:[],                        //账单记录数据

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
            ]).then(res=>{
                let [plat,store,currency] = res;
                this.platTypeArr = plat;
                this.storeArr = store;
                this.currencyArr = currency;

                //刚进入选择所有的店铺
                this.Fstore = store;


                 //2019-2-27  导出表格数据  店铺归类
                (function(){
                    let options = [];
                    //1. 循环做联动菜单
                    this.platTypeArr.forEach(platItem=>{

                        let menuOptions = {
                            label:platItem.platformName,
                            value:platItem.platformCode,
                            children:[],
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

            switch(this.form.type){
                case `1`:
                {   //提现记录
                   this.queryPresentRecord();
                }
                break;
                case `2`:
                {   //账单明细
                   this.queryStatementList();
                }
                break;
            };


        },
        methods: {
            //请求->账单明细
            queryStatementList(){

                statementList(this.form).then(res=>{
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
            queryPresentRecord(){

                queryWithdrawList(this.form).then(res=>{
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
            //点击查询按钮
            bindSearch(val){
                 //展示的表格

                this.form.pageNum = val;
                this.switchType = this.form.type;
                switch(this.form.type){
                    case `1`:
                    {   //提现记录
                    this.queryPresentRecord();
                    }
                    break;
                    case `2`:
                    {   //账单明细
                    this.queryStatementList();
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
            changeStartDate(flag){
                this.exportLi = flag;
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
                this.exportForm.startTime = startDate;
                this.exportForm.endTime = this.addDate(curDate,0,days);

                this.exportFormTime = [startDate,this.addDate(curDate,0,days)];
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

                if(this.form.type=='1'){
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
                    
                }else{
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
                
            },

           handleChange(value,type){
               if(type=='time'){
                    this.exportForm["startTime"] =  value[0],
                    this.exportForm["endTime"] =  value[1];
               };
               if(type == 'store'){
                   this.exportForm.platformId =  value[0];
                   this.exportForm.storeId =  value[1];
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
            Record
        }
    }
</script>


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
    //内容
    .cares-main{
        min-height: 500px;
        padding-bottom: 20px !important;
        form{
            padding: 20px 0;
            font-size: 14px;
            color:#666;
            border-bottom:1px solid #f1f1f1;
            margin-bottom: 10px;
            .el-button{
                height: 32px;
                line-height: 32px;
                padding: 0 10px;
            }
            //类型的选择
            .select-type{
                display: inline-block;
                height: 32px;
                line-height: 32px;
                padding: 0 25px;
                border-radius: 16px;
                color: #666;
                font-size: 14px;
                margin-right: 20px;
                border: 1px solid #fff;
                cursor: pointer;
                transition:all .2s;
                &:hover{
                    box-shadow:0 0 5px 0px rgba(0,0,0,.2);
                }
                &.active{
                    color:$--color-primary-two;
                    border-color: $--color-primary-two;
                    box-shadow:0 0 5px 0px $--color-primary-two-hover;
                }
                input{
                    display: none;
                }
            }
            
            .el-select{
                width: 160px;
                margin-left: 10px;
            }

            .search{
                width:50px;

                margin-left: 20px;
            }
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
            .el-date-editor.el-input,
             .el-date-editor.el-input__inner,
            .el-cascader,
            .el-input,
            {
                width: 100%;
                height: 32px;
                line-height: 32px;
                .el-range__close-icon,
                .el-range__icon,
                .el-range-separator
                {
                    line-height: 24px;;
                }
            }
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
                                border-color: $--color-primary-two;
                            }
                        }
                    }
                }
                //按钮
                .button-comfirm{
                    padding-top:12px;
                    text-align: center;
                    >span{
                        width: 80px;
                        margin: 0 5px;
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
