<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">
                 <el-form-item label="店铺ID：">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                 <el-form-item label="店铺名称：">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名称"></el-input>
                </el-form-item>

                 <el-form-item class="customer_sale_item" label="店铺所属平台：">
                    <el-select v-model="form.platformName" placeholder="请选择店铺所属平台">
                        <el-option v-for="(item,index) in Platform" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

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
            </el-form>
        </div>

        <div class="table-container mg-bt-0">
            <div class="admin-tab-title">店铺流失统计</div>
            <el-table :data="table" border >
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="storeId" label="店铺ID"></el-table-column>
                <el-table-column prop="storeName" label="店铺名称"></el-table-column>
                <el-table-column prop="platformName" label="店铺所属平台"></el-table-column>
                <el-table-column label="店铺状态">
                    <template slot-scope="scope">
                        <span class="ing" v-if="scope.row.status==0">待激活店铺</span>
                        <span class="yes" v-if="scope.row.status==1">有效店铺</span>
                        <span class="no" v-if="scope.row.status==2">流失店铺</span>
                    </template>
                </el-table-column>
                <el-table-column prop="loseTime" label="流失时间"></el-table-column>
                <el-table-column label="操作">
                     <template slot-scope="scope">
                         <a class="primary" @click="bindToShopDe(scope.row.storeId)" href="javascript:;">查看详情</a>
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
} from '../../../ext/localBase.js';

import {
    findStoreLoseList
} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                storeId:'',
                storeName:'',
                platformName:'',
                customerNo:'',
                customerName:'',
                startTime:'',
                endTime:'',
                status:'',

                pageNum:'1',
                pageSize:'10',
                totalSize:'1'
            },
            Platform:[],
            table:[],
        }
    },
    methods:{
        __LOADING(){
            this.reset(),
            this.loadingQuery(this.form),
            queryPlatform().then(res=>{
                this.Platform = res;
            });
        },
        loadingQuery(params){
            findStoreLoseList(params).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(n,pageSize){
            this.form.pageNum = n;
            this.form.pageSize = pageSize;
            this.loadingQuery(this.form);
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
            };

            this.form.status = '2';
        },
        bindToShopDe(storeId){
            this.$router.push({
                name:"storeDetails",
                params:{
                    storeId
                }
            });
        }
    }
}
</script>

