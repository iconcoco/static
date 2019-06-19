<template>
    <div class="fadeIn">
       <div class="table-container">
            <div class="admin-tab-title">查看批次号详情</div>
            <ul class="hk-remit-details-ul clearfix">
                <li>结汇批次号：<span>{{pageData.settleBatchNo}}</span></li>
                <li>结汇金额：<span>{{pageData.settleAmount/100}}</span></li>
                <li>币种：<span>{{pageData.outCurrency}}</span></li>
                <li>创建时间：<span>{{formatTimer(pageData.settleBatchNoDate)}}</span></li>
            </ul>

            <el-table :data="table" border >
                <el-table-column prop="entityAccountNo" label="子账号"></el-table-column>
                <el-table-column prop="createdTime" label="提现时间">
                    <template  slot-scope="scope">
                        {{formatTimer(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="channelCode" label="渠道"></el-table-column>
                <el-table-column prop="targetCurrency" label="入账币种"></el-table-column>
                <el-table-column prop="amount" label="申请提现金额">
                     <template slot-scope="scope">
                         {{(scope.row.amount/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="balanceAmount" label="实际可提现金额">
                     <template slot-scope="scope">
                         {{(scope.row.balanceAmount/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="targetAmount" label="实际代付人民币金额">
                    <template slot-scope="scope">
                         {{(scope.row.targetAmount/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="exchangeRate" label="结算汇率"></el-table-column>
                <el-table-column prop="bankAccountName" label="开户名称"></el-table-column>
                <el-table-column prop="bankAccount" label="提现银行账号"></el-table-column>
                <el-table-column prop="bankName" label="提现银行名称"></el-table-column>
                <el-table-column prop="settlementOrderNo" label="结汇批次号"></el-table-column>
                <el-table-column prop="settlementStatus" label="状态">
                    <template slot-scope="scope">
                        <span class="ing" v-if="scope.row.settlementStatus==0">处理中</span>
                        <span v-if="scope.row.settlementStatus==1">待申请</span>
                        <span class="ing" v-if="scope.row.settlementStatus==2">申请中</span>
                        <span class="yes" v-if="scope.row.settlementStatus==3">结汇成功</span>
                        <span class="no" v-if="scope.row.settlementStatus==4">结汇失败</span>
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
    </div>
</template>

<script>

import { formatTimer } from '../../../utils/common.js';
import { 
   queryWithdrawByBatchNo
    } from '../../../utils/axios/api.js';

export default {
    data(){
        return{
            table:[],
            pageData:{
                 settleBatchNo:'',
                 settleAmount:'',
                 outCurrency:'',
                 settleBatchNoDate:'',
            },
            form:{
                batchNo:'',
                pageNumber:'1',
                pageSize:'10',
                totalPages:'1'
            }
        }
    },
    created(){
         //请求当前外键的审核字段和结果
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.hkRemitDetails;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"hkBankRemit"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            //销售负责人
            this.pageData = OBJ;
            this.form.batchNo = OBJ.settleBatchNo;
            this.loadingQuery(this.form);
        };

    },
    methods:{
        loadingQuery(params){
            if(!params.batchNo) return;
            queryWithdrawByBatchNo(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(n,size){
            this.form.pageNumber = n;
            this.form.pageSize = size;
            this.loadingQuery(this.form);
        },
         formatTimer(code){
            return formatTimer(code);
        }
    },
     destroyed() {
         let tabArr = this.$store.state.TabList;

         tabArr.forEach(item=>{
              if(item.name==`hkRemitDetails`){
                  return this.$store.commit('setModelRecordData',{
                        key:'hkRemitDetails',
                        data:{
                            table:this.table,
                            pageData:this.pageData,
                            form:this.form,
                        }
                    });
              };
         });

    },
}
</script>


<style lang="scss" scoped>
    .hk-remit-details-ul{
        padding-top: 10px;
        li{
            float: left;
            font-size: 14px;
            color: #333;
            padding: 5px 0;
            margin-right: 40px;
            span{
                color: red;
            }
        }
    }
</style>

