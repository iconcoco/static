<template>
 <transition name="fade">
    <div class="settlemen">
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="结汇单号" name="orderNo">
                    <el-input name="orderNo" v-model="form.orderNo" placeholder="请输入结汇单号"></el-input>
                </el-form-item>

                <el-form-item label="汇率差" name="exchangeRate">
                    <el-select name="exchangeRate" v-model="form.exchangeRate" placeholder="选择汇率差">
                      <el-option label="正" :value="1"></el-option>
                      <el-option label="负" :value="0"></el-option>
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

                <el-form-item label="结汇状态">
                    <el-select v-model="form.settlStatus" placeholder="结汇状态">
                      <ElOption label="全部" value=""></ElOption>
                      <ElOption label="处理中" value="0"></ElOption>
                      <ElOption label="待申请" value="1"></ElOption>
                      <ElOption label="申请中" value="2"></ElOption>
                      <ElOption label="结汇成功" value="3"></ElOption>
                      <ElOption label="结汇失败" value="4"></ElOption>
                    </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">结汇列表</div>

            <el-button @click="bindToSettle" type="primary">发起结汇</el-button>
            <!-- 查询结果 -->
            <el-table :data="table" border >
                <el-table-column width="55">
                    <template slot-scope="scope">
                         <el-radio v-if="[1,4].indexOf(scope.row.settlStatus)>-1" :label="scope.row.orderNo" v-model="settleForm.orderNo"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="结汇单号" width="230"></el-table-column>
                <el-table-column prop="outTxnAmount" label="最初结汇金额"></el-table-column>
                <el-table-column prop="serviceCharge" label="服务费"></el-table-column>
                <el-table-column prop="inTxnAmount" label="净结汇金额"></el-table-column>
                <el-table-column prop="settlementAmount" label="结汇金额"></el-table-column>
                <el-table-column prop="updateTime" label="交割时间" width="150"></el-table-column>
                <el-table-column prop="payRate" label="实际汇率"></el-table-column>
                <el-table-column prop="relativeRate" label="爬取汇率"></el-table-column>
                <el-table-column prop="exchangeRate" label="汇率差"></el-table-column>
                <el-table-column label="结汇状态">
                    <template slot-scope="scope">
                        <span class="ing" v-if="scope.row.settlStatus==0">处理中</span>
                        <span v-if="scope.row.settlStatus==1">待申请</span>
                        <span class="ing" v-if="scope.row.settlStatus==2">申请中</span>
                        <span class="yes" v-if="scope.row.settlStatus==3">结汇成功</span>
                        <span class="no" v-if="scope.row.settlStatus==4">结汇失败</span>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
 </transition>
</template>

<script>
    // 结汇列表
    
    import {querySettlementList,applySettlement} from '../../../utils/axios/api.js'
    import { getTimer } from '../../../utils/common.js';
     import mixin from '../../../ext/mixin.js';
    
    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    orderNo:'',
                    exchangeRate:'',
                    startDate:'',
                    endDate:'',
                    settlStatus:'',

                    page:'1',
                    totalPages:'1',
                    size:'10',
                },
                settleForm:{
                    orderNo:'',
                },
                table:[]
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form)
            },
            reset(){
                let n = ['page','size','totalPages'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.form[key] = "";
                    }
                }
            },
            loadingQuery(params){

                if(getTimer(params.startDate)>getTimer(params.endDate))return this.$message.error(`开始时间应该小于结束时间！`);

                querySettlementList(params).then(res=>{
                    this.table = res.content;
                    this.form.totalPages = res.totalPages;
                });
            },
            //确认查询按钮
            bindFormSubmit(){
                this.form.page = 1;
                this.loadingQuery(this.form);
            },
            //页码选择的时候
           pageChange(n,pageSize){
               this.form.page = n;
               this.form.size = pageSize;
               this.loadingQuery(this.form);
           },
           //发起结汇
           bindToSettle(){
               if(!this.settleForm.orderNo) return this.$message.warning(`请选择结汇的单号！`);
               applySettlement(this.settleForm).then(res=>{
                   this.settleForm.orderNo = "";
                   if(res.code==0){
                        this.$message.success(res.msg);
                        this.loadingQuery(this.form);
                   }else{
                       this.$message.error(res.msg);
                   }
               }).catch(err=>{
                   console.log(err);
               })
           },
           bindToViewDetails(){
               console.log(`查看详情`);
           }
        },
    }
</script>

<style lang="scss">
   .settlemen{
       table{
            .el-radio__label{
                display:none;
            }
            .radio{
                width: 60px;
            }
       }
   } 
</style>




