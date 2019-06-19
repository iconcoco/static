<template>
    <div class="fadeIn">
         <div class="table-container">
             <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">
                <el-form-item label="店铺ID：">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="店铺名称：">
                    <el-input v-model="form.name" placeholder="请输入店铺名称"></el-input>
                </el-form-item>

                <el-form-item class="customer_sale_item" label="店铺所属平台：">
                    <el-select v-model="form.platformName" placeholder="请选择店铺所属平台">
                        <el-option v-for="(item,index) in Platform" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item label="店铺状态：">
                    <el-select v-model="form.status" placeholder="请选择店铺状态">
                        <el-option value="" label="全部"></el-option>
                      <el-option v-for="(item,index) in storeStatus" :key="index"
                        :label="item.status"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="客户ID：">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                 <el-form-item label="客户名称：" >
                    <el-input  v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                <el-form-item class="data" label="起始时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择起始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="data" label="结束时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                 <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <!-- <el-button type="success">导出报表</el-button> -->
             </el-form>
        </div>

         <div class="table-container mg-bt-0">
             <div class="admin-tab-title">店铺入账统计</div>
             <el-table :data="table" border >
               <el-table-column prop="customerNo" width="154" label="客户ID"></el-table-column>
               <el-table-column prop="customerName" label="客户名称"></el-table-column>
               <el-table-column prop="storeId" width="154" label="店铺ID"></el-table-column>
               <el-table-column prop="name" label="店铺名称"></el-table-column>
               <el-table-column prop="platformCode" label="店铺所属平台">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.platformCode,Platform,'platformName','platformCode')}}
                    </template>
               </el-table-column>
               <el-table-column label="店铺状态">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.status,storeStatus,'status','code')}}
                        <!-- <span class="ing" v-if="scope.row.status==0">待激活店铺</span>
                        <span class="yes" v-if="scope.row.status==1">有效店铺</span>
                        <span class="no" v-if="scope.row.status==2">流失店铺</span> -->
                    </template>
               </el-table-column>
               <el-table-column prop="currency" label="入账币种"></el-table-column>
               <el-table-column prop="sumAccount" label="入账金额"></el-table-column>
               <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a class="primary" @click="bindToStoreDe(scope.row.storeId,scope.row.customerNo,scope.row.currency)" href="javascript:;">查看详情</a>
                    </template>
               </el-table-column>
             </el-table>

              <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>
import {
    queryPlatform,
    storeStatus
} from '../../../ext/localBase.js';

import {
    findInboundStatementList
} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            form:{
                level:'',
                storeId:'',
                platformName:'',
                name:'',
                // status:'',
                customerNo:'',
                customerName:'',
                startTime:'',
                endTime:'',

                
                pageNum:'1',
                pageSize:'10',
                totalSize:'1'
            },
             Platform:[],
             table:[],
             storeStatus:storeStatus,
        }
    },
    created(){

        this.$route.name == 'AllStoreBalance' ? (this.form.level = "1") : (this.form.level = "");
        
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form),
            queryPlatform().then(res=>{
                this.Platform = res;
            });
        },
        loadingQuery(params){
            findInboundStatementList(params).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        bindToSubmit(){
            this.form.pageNum=1;
            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['pageNum','pageSize','totalSize'];
              for (const key in this.form) {
                  if(n.indexOf(key)<0){
                      this.form[key] = "";
                  }
              }
        },
        pageChange(n,pageSize){
            this.form.pageNum = n;
            this.form.pageSize = pageSize;
            this.loadingQuery(this.form);
        },
        bindToStoreDe(storeId,customerNo,currency){
            this.$router.push({
                name:"storeBalanceDetails",
                params:{
                    storeId,
                    customerNo,
                    currency
                }
            })
        },
        fineValName(code,LIST,NAME,itemCode){
             let I = LIST.find(item=>{
                 return item[itemCode]==code;
             });
             if(I){
                 return I[NAME];
             }
         },
    },
}
</script>
