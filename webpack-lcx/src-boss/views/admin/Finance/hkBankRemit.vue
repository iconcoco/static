<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">
                <el-form-item label="香港银行">
                    <el-select v-model="form.outBankCode" placeholder="请选择香港银行">
                        <el-option v-for="(item,index) in  CHNBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="汇款渠道">
                  <el-select v-model="form.inChannelCode" placeholder="请选择汇款渠道">
                      <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="币  种">
                    <el-select v-model="form.outCurrency" placeholder="请选择币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item class="hk_arrival_item" label="汇款资金平台">
                   <el-select v-model="form.inChannelCode" placeholder="请选择资金平台">
                      <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
              </el-form-item> -->

                <el-form-item label="汇款状态">
                    <el-select v-model="form.status" placeholder="请选择汇款状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="待汇款" value="0"></el-option>
                      <el-option label="处理中" value="1"></el-option>
                      <el-option label="处理成功" value="2"></el-option>
                      <el-option label="处理失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开始时间" name="startDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startDate"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endDate"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>

             <ul class="hk-bank-account-details clearfix">
                <li class="one-li">{{hkBankData(hkBankCode)}}银行账户详情</li>
                <li v-for="(item,index) in bankAmountData" :key="index">
                    <template v-if="item.currency=='CNY'">账户人民币余额</template>
                    <template v-if="item.currency=='USD'">账户美元余额</template>
                    <template v-if="item.currency=='EUR'">账户欧元余额</template>
                    <template v-if="item.currency=='GBP'">账户英镑余额</template>
                    : <span>{{item.totalAmount}}</span>
                </li>
            </ul>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">香港汇款详情</div>
            <el-table :data="table" border >
                <el-table-column prop="" width="50" label="序号">
                    <template slot-scope="scoped">
                        {{scoped.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="settleBatchNo" label="结汇批次号"></el-table-column>
                <el-table-column prop="settleBatchNoDate" label="创建结汇批次号时间"></el-table-column>
                <el-table-column prop="outDate" width="148" label="汇款时间">
                    <template slot-scope="scoped">
                        {{formatTimer(scoped.row.outDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="inChannelCode" label="汇款渠道"></el-table-column>
                <el-table-column prop="outCurrency" label="币种"></el-table-column>
                <el-table-column prop="settleAmount" label="待结汇金额">
                     <template  slot-scope="scope">
                       {{(scope.row.settleAmount/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="outAmount" label="汇款金额">
                     <template  slot-scope="scope">
                       {{(scope.row.outAmount/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="outTransNo" label="汇款交易编号"></el-table-column>
                <el-table-column prop="ramark" label="交易备注"></el-table-column>
                <el-table-column prop="status" label="汇款状态">
                    <template slot-scope="scoped">
                        <span class="ing" v-if="scoped.row.status==0">待汇款</span>
                        <span class="ing" v-if="scoped.row.status==1">处理中</span>
                        <span class="yes" v-if="scoped.row.status==2">处理成功</span>
                        <span class="no" v-if="scoped.row.status==3">处理失败</span>
                    </template>
                </el-table-column>
                <el-table-column width="140" label="操作">
                    <template slot-scope="scoped"> 
                        <el-button @click="bindToShowModel('新增汇款记录',0,scoped.row.id)" v-if="scoped.row.status==0" type="primary"> <span class="fa fa-plus"></span> </el-button>
                        <el-button @click="bindToShowModel('修改汇款记录',1,scoped.row.id)" v-if="scoped.row.status==1" type="warning"><span class="fa fa-edit"></span></el-button>
                        <el-button @click="bindToSettleDetails(scoped.row.id)" type="success"><span class="fa fa-file-text"></span></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination 
            :page="form.pageNumber"
            :pageSize="form.pageSize"
            :count="form.totalPages"
            :chosefallback="pageChange"
            ></Pagination>
        </div>


        <AdminModel
        :title="tip"
        confirmTxt="确认"
        v-model="isShow" 
        :confirm="bindRateConfirm"
        class="hk-bank-arrival-model hk-bank-remit-model"
        >
            <el-form class="admin-form-inline" :model="modelForm" :inline="true">

                <el-form-item label="香港银行">
                    <el-select v-model="modelForm.outBankCode" placeholder="请选择香港银行">
                        <el-option v-for="(item,index) in  CHNBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="汇款渠道">
                  <el-select v-model="modelForm.inChannelCode" placeholder="请选择汇款渠道">
                      <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="币  种">
                  <el-select v-model="modelForm.outCurrency" placeholder="请选择币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="汇款金额">
                    <el-input v-model="modelForm.outAmount" placeholder="请输汇款金额"></el-input>
                </el-form-item>

                 <el-form-item label="汇款时间" name="startDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd hh:mm:ss"
                        v-model="modelForm.outDate"
                        type="datetime"
                        placeholder="请选择汇款时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="交易编号">
                    <el-input v-model="modelForm.outTransNo" placeholder="请输入汇款交易编号"></el-input>
                </el-form-item>

                 <el-form-item label="汇款备注">
                    <el-tooltip content="汇款备注输入如：2018-12-21|1|200" placement="top-end">
                        <span class="el-icon-question remark-tip"></span>
                    </el-tooltip>
                    <el-input v-model="modelForm.ramark" placeholder="请输入汇款备注"></el-input>
                </el-form-item>

            </el-form> 
        </AdminModel>
    </div>
</template>

<script>

import {
        queryCurrency,
        queryPlatform,
        queryForeignBank,
        queryCHNBank,
        queryChannel,
    } from '../../../ext/localBase.js';

import { 
    queryHkBankOutAccountFlow,
    queryHkBankAccountBanlace,
    saveHkBankAccountFlow,
    updateHkBankOutAccountFlow,
    } from '../../../utils/axios/api.js';

import { dataReshow,formatTimer } from '../../../utils/common.js';

import AdminModel from '../../../components/adminModal.vue';

 import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                outBankCode:'', //银行
                inChannelCode:'',   //渠道 
                outCurrency:'',     //币种
                status:'',          //状态
                startDate:null,   
                endDate:null,

                pageNumber:'1',
                pageSize:'10',
                totalPages:'1',
            },
            table:[],
            bankAmountData:[],
            hkBankCode:'',
            modelForm:{
                id:'',
                outBankCode:'',
                inChannelCode:'',
                outCurrency:'',
                outAmount:'',
                outDate:'',
                outTransNo:'',
                ramark:'',
                transType:'1',
            },
            isShow:false,

            tip:'新增汇款记录',

            Currency:[],
            platArr:[],
            CHNBank:[],
            ChannelArr:[],
        }
    },
    methods:{
        __LOADING(){
            Promise.all([
                queryCurrency(),
                queryPlatform(),
                queryCHNBank(),
                queryChannel(),
            ]).then(res=>{
                let [a,b,c,d] = res;
                this.Currency = a;
                this.platArr = b;
                this.CHNBank = c;
                this.ChannelArr = d;

                //香港银行需要默认的数据不能选择全部
                this.form.outBankCode = this.CHNBank[0].bankCode;
                this.loadingQuery(this.form);
            })
        },
        loadingQuery(params){
              //查询列表
            queryHkBankOutAccountFlow(params).then(res=>{
                if(res.code==0){
                   this.table = res.data.content;
                   this.form.totalPages = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            });

            //查询银行账户详情
            queryHkBankAccountBanlace({outBankCode:params.outBankCode}).then(res=>{
                if(res.code==0){
                    this.bankAmountData = res.data;
                    this.hkBankCode = params.outBankCode;
                }else{
                    this.$message.error(res.msg);
                }
            });

        },
        pageChange(n,size){
            this.form.pageNumber=n;
            this.form.pageSize=size;
            this.loadingQuery(this.form);
        },
        bindToSettleDetails(id){
            this.table.map(item=>{
                if(item.id == id){
                     this.$router.push({
                        name:"hkRemitDetails",
                        params:{
                            settleBatchNo:item.settleBatchNo,
                            settleAmount:item.settleAmount,
                            outCurrency:item.outCurrency,
                            settleBatchNoDate:item.settleBatchNoDate,
                        }
                    });
                };
            });
           
        },
        bindToShowModel(txt,index,id){
            this.tip=txt;
            this.isShow = true;
            
            this.table.map(item=>{
                if(item.id==id){
                    for (const key in this.modelForm) {
                        if (key!="transType") {
                            if(key == 'outAmount'){
                                this.modelForm[key] = (item[key]/100).toFixed(2);
                            }else{
                                this.modelForm[key] = item[key];
                            }
                        }
                    };
                    this.modelForm.outDate=this.formatTimer(this.modelForm.outDate);
                }
            });

        },
        bindRateConfirm(){
            //1. 验证必填
            for (const key in this.modelForm) {
                if (!this.modelForm[key]) {
                    let msg ='';
                    key == 'outBankCode' && (msg = '请选择香港银行');
                    key == 'inChannelCode' && (msg = '请选择汇款渠道');
                    key == 'outCurrency' && (msg = '请选择币种');
                    key == 'outAmount' && (msg = '请输入金额');
                    key == 'outDate' && (msg = '请输入汇款时间');
                    key == 'outTransNo' && (msg = '请输入交易编号');
                    key == 'ramark' && (msg = '请输入备注');

                    return this.$message.warning(msg);
                }
            };

            let data =  Object.assign({status:1},this.modelForm);

            data.outAmount = (data.outAmount*100).toFixed(0);

            //修改接口
             updateHkBankOutAccountFlow(data).then(res=>{
                if(res.code==0){
                    this.$message.success(res.msg);
                    this.form.pageNumber = 1;
                    this.loadingQuery(this.form);
                    //1. 清空所填数据
                    for (const k in this.modelForm) {
                        if (k!=='transType') {
                            this.modelForm[k] = '';
                        }
                    };
                    //2. 关闭弹窗
                    this.isShow = false;
                }else{
                    this.$message.error(res.msg);
                }  
            });
        },
        bindFormSubmit(){
            this.form.pageNumber=1;
            this.loadingQuery(this.form);
        },
        reset(){
             let n = ["outBankCode","pageNumber","pageSize","totalPages","startDate","endDate"];
            //选择的数据变成空字符
            for (const key in this.form) {
                if (n.indexOf(key)<0) {
                    this.form[key]="";
                }
            };
            //日期变成null
            this.form["startDate"] = null;
            this.form["endDate"] = null;
        },
         hkBankData(code){
            return dataReshow(this.CHNBank,"bankName","bankCode",code)
        },
         formatTimer(code){
            return formatTimer(code);
        }
    },
    components:{
        AdminModel
    }
}
</script>

<style lang="scss" scoped>
.hk-bank-account-details{
    border: 1px solid #c2e7b0;
    background-color: #f0f9eb;
    border-radius: 4px;
    padding: 7px 20px;
    margin-top: 40px;
    position: relative;
    min-height: 30px;
    .one-li{
        position: absolute;
        top: -100%;
        font-size: 18px;
    }
    li{
        float: left;
        margin-right: 40px;
        span{
            color: red;
        }
    }
}

.remark-tip{
    position: absolute;
    right: -21px;
    top: 12px;
}
</style>

<style lang="scss">
    .hk-bank-arrival-model.hk-bank-remit-model{
        .modal-container{
            margin-top: -270px;
        }
    }
</style>

