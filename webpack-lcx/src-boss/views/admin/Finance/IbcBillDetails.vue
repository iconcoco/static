<template>
    <div class="fadeIn">
       <div class="table-container">
           <div class="admin-tab-title">查看SolarisBank打款详情</div>
            <ul class="hk-remit-details-ul clearfix">
                <li>PayoutID：<span>{{pageData.payoutId}}</span></li>
                <li>打款金额：<span>{{(pageData.outAmount/100).toFixed(2)}}</span></li>
                <li>币种：<span>{{pageData.outCurrency}}</span></li>
                <li>创建时间：<span>{{formatTimer(pageData.createTime)}}</span></li>
            </ul>

            <el-table :data="table" border >
                <el-table-column prop="recipientIban" label="子账号"></el-table-column>
                <el-table-column prop="bookingId" label="Booking ID"></el-table-column>
                <el-table-column prop="bookingDate" width="210" label="SolarisBank到账时间">
                    <template slot-scope="scope">
                        {{formatTimer(scope.row.bookingDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="amountValue" label="Amazon打款金额">
                    <template slot-scope="scope">
                        {{(scope.row.amountValue/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="amountValue" label="SolarisBank到账金额">
                    <template slot-scope="scope">
                        {{(scope.row.amountValue/100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column prop="amountCurrency" label="币种"></el-table-column>
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
   querySolarisBookingByTransNo
    } from '../../../utils/axios/api.js';


export default {
    data(){
        return{
            form:{
                transNo:'',

                pageNumber:'1',
                pageSize:'10',
                totalPages:'1',
            },
            pageData:{
                 createTime:'',
                 outCurrency:'',
                 outAmount:'',
                 payoutId:'',
            },
            table:[],
        }
    },
    created(){
           //请求当前外键的审核字段和结果
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.IbcBillList;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"IbcBillList"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            //销售负责人
            this.pageData = OBJ;
            this.form.transNo = OBJ.transNo;
            this.loadingQuery(this.form);
        };
    },
    methods:{
        loadingQuery(params){
            querySolarisBookingByTransNo(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(n,size){
            this.form.pageNumber=n;
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
              if(item.name==`IbcBillList`){
                  return this.$store.commit('setModelRecordData',{
                        key:'IbcBillList',
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
