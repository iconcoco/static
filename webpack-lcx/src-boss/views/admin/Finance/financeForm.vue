<template>
 <transition name="fade">
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">
                <!-- 客户 ID -->
                <el-form-item label="客户 ID" name="customerNo">
                    <el-input name="customerNo" v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-form-item label="店铺 ID" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="银行账号" name="entityAccountNo">
                    <el-input name="entityAccountNo" v-model="form.entityAccountNo" placeholder="海外银行的子账号"></el-input>
                </el-form-item>

                <el-form-item label="开始时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="换汇批号" name="settlementOrderNo">
                    <el-input name="settlementOrderNo" v-model="form.settlementOrderNo" placeholder="请输入换汇批号"></el-input>
                </el-form-item>

                 <el-form-item label="平 台" name="platform">
                    <el-select v-model="form.platform" placeholder="请选择平台">
                        <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="渠 道" name="channelId">
                    <el-select v-model="form.channelId" placeholder="请选择渠道">
                       <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="当前币种" name="currency">
                    <el-select v-model="form.currency" placeholder="请选择当前币种">
                        <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="提现币种" name="targetCurrency">
                    <el-select v-model="form.targetCurrency" placeholder="请选择提现币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

        <div class="table-container">
             <div class="admin-tab-title">财务报表</div>
            <!-- 查询结果 -->
            <el-table 
                :data="table" 
                border 
                :span-method="financeTable"
                >
                <el-table-column prop="entityAccountNo" label="银行账号"></el-table-column>
                <el-table-column prop="arrivalDate" label="提现时间">
                    <template slot-scope="scope">
                            {{formatT(scope.row.arrivalDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="abroadBank" label="海外银行"></el-table-column>
                <el-table-column prop="channelCode" label="渠道"></el-table-column>
                <el-table-column prop="settlementOrderNo" label="换汇批号"></el-table-column>
                <el-table-column prop="currency" label="原币种"></el-table-column>
                <el-table-column prop="targetCurrency" label="提现币种"></el-table-column>
                <el-table-column prop="amount" label="提现金额"></el-table-column>

                <el-table-column prop="serviceRate" label="费率"></el-table-column>
                <el-table-column prop="deservedDollar" label="应得美金金额"></el-table-column>
                <el-table-column prop="actualExchangeAmount" label="实际换汇金额"></el-table-column>

                <el-table-column prop="exchangeRate" label="汇率"></el-table-column>
                <el-table-column prop="deservedRMB" label="应得人民币金额"></el-table-column>
                <el-table-column prop="afterActualExchangeAmount" label="实际换汇后金额"></el-table-column>

                <el-table-column prop="compensatedDollar" label="补美金"></el-table-column>
                <el-table-column prop="compensatedRMB" label="补人民币"></el-table-column>
                <el-table-column prop="netReceiptDollar" label="净收入美金"></el-table-column>
                <el-table-column prop="channelServiceCharge" label="渠道手续费"></el-table-column>
            </el-table>

              <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
 </transition>
</template>

<script>
    // 财务报表

    import {financeStatement} from '../../../utils/axios/api.js';
    import {formatTimer,getTimer} from '../../../utils/common.js';

    import {
        queryPlatform,
        queryChannel,
        queryCurrency,
    } from '../../../ext/localBase.js';

     import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    customerNo:'',
                    storeId:'',
                    entityAccountNo:'',
                    settlementOrderNo:'',
                    platform:'',
                    channelId:'',
                    targetCurrency:'',
                    currency:'',
                    startTime:'',
                    endTime:'',
                    pageNum:'1',
                    pageSize:10,
                    totalPages:'1'
                },
                table:[],

                platArr:[],
                ChannelArr:[],
                Currency:[],

                rowspan:0,
                colspan:0,
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                Promise.all([
                    queryPlatform(),
                    queryChannel(),
                    queryCurrency(),
                ]).then(res=>{
                    let [a,b,c] = res;
                    this.platArr = a;
                    this.ChannelArr = b;
                    this.Currency = c;
                })
            },
            //查询条件的置空
            reset(){
                let n = ['pageNum','pageSize','totalPages'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.form[key] = "";
                    }
                }
            },
            loadingQuery(params){

                 if(getTimer(params.startTime)>getTimer(params.endTime))return this.$message.error(`开始时间应该小于结束时间！`);

                financeStatement(params).then(res=>{
                   if(res.code==0){
                       this.table = res.data.content;
                       this.form.totalPages = res.data.totalPages;
                       
                   }else{
                       this.$message.error(res.msg)
                   }
                });
            },
            bindFormSubmit(){
               this.loadingQuery(this.form);
            },
           pageChange(n,per){
               this.form.pageNum = n;
               this.form.pageSize = per;
               this.loadingQuery(this.form);
           },
           formatT(n){
               return formatTimer(n);
           },
           financeTable({row, column, rowIndex, columnIndex}){
            //    if (columnIndex === 0) {
            //        console.log(columnIndex,rowIndex);
                   
            //         if (rowIndex % 2 === 0) {
            //             return {
            //                 rowspan: 2,
            //                 colspan: 1
            //             };
            //         } else {
            //             return {
            //                 rowspan: 0,
            //                 colspan: 0
            //             };
            //         }
            //     }
           }
        }
    }
</script>

<style lang="scss">
    
</style>

