<template>
 <transition name="fade">
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="客户编号" name="customerNo">
                    <el-input name="customerNo" v-model="form.customerNo" placeholder="请输入客户编号"></el-input>
                </el-form-item>

                <el-form-item label="店铺编号" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺编号"></el-input>
                </el-form-item>

                <el-form-item label="子账号" name="subAccountNo">
                    <el-input name="subAccountNo" v-model="form.subAccountNo" placeholder="请输入子账号"></el-input>
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

                <el-form-item label="银 行" name="bankCode">
                    <el-select v-model="form.bankCode" placeholder="请选择银行">
                       <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="提现币种" name="originalTotalCurrencyCode">
                    <el-select v-model="form.originalTotalCurrencyCode" placeholder="请选择提现币种">
                       <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="平台列表" name="platformCode">
                    <el-select v-model="form.platformCode" placeholder="请选择平台">
                       <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">平台出账列表</div>
            <!-- 查询结果 -->
            <el-table :data="table" border >
                <el-table-column prop="customerNo" label="客户编号"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="storeId" label="店铺编号"></el-table-column>
                <el-table-column prop="subAccountNo" label="子账号"></el-table-column>
                <el-table-column prop="platformCode" label="平台编码"></el-table-column>
                <el-table-column prop="bankCode" label="银行编码"></el-table-column>
                <!-- <el-table-column prop="channelCode" label="渠道编码"></el-table-column> -->
                <el-table-column prop="financialEventGroupId" label="批次号"></el-table-column>
                <el-table-column prop="originalTotalCurrencyCode" label="币种"></el-table-column>
                <el-table-column prop="originalTotalCurrencyAmount" label="金额"></el-table-column>
                <el-table-column prop="fundTransferDate" label="出账时间"></el-table-column>
                <el-table-column prop="fundTransferStatus" label="出账状态"></el-table-column>
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
    // 平台出账
    
    import {queryPlatformBilling} from '../../../utils/axios/api.js';
    import { getTimer } from '../../../utils/common.js';

    import {
        queryCurrency,
        queryPlatform,
        queryForeignBank,
    } from '../../../ext/localBase.js';

     import mixin from '../../../ext/mixin.js';
    
    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    customerNo:'',
                    storeId:'',
                    subAccountNo:'',
                    startDate:'',
                    endDate:'',
                    platformCode:'',
                    bankCode:'',
                    originalTotalCurrencyCode:'',
                    page:'1',
                    totalPages:'1',
                    size:'10',
                },
                table:[],

                Currency:[],
                 platArr:[],
                ForeigBank:[],
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                 Promise.all([
                    queryCurrency(),
                    queryForeignBank(),
                    queryPlatform(),
                ]).then(([a,b,c])=>{
                    this.Currency = a;
                    this.ForeigBank = b;
                    this.platArr = c;
                });
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

                queryPlatformBilling(params).then(res=>{
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
           } 
        },
    }
</script>


