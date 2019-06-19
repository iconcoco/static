<template>
    <div class="fadeIn">
        <div class="table-container">
            <div class="alert-total">
                <i class="el-icon-info"></i>
                {{AlertCount.alertCustomerNumber}}个客户共 {{AlertCount.alertStoreNumber}}个店铺有Alert待处理
                <a class="primary fr" href="javascript:;" @click="bindToSubmit(true)">查看详情</a>
            </div>

            <el-form :model="form" :inline="true" class="admin-form-inline">

                <el-form-item label="店铺名称：">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名称"></el-input>
                </el-form-item>

                <el-form-item label="店铺ID：">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="平台：">
                    <el-select v-model="form.platformCode" placeholder="请选择平台">
                        <el-option v-for="(item,index) in PlatData" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="国家：">
                    <el-select v-model="form.countryCode" placeholder="请选择国家">
                        <el-option v-for="(item,index) in NationCode" :key="index"
                            :label="item.nation"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="客户ID：">
                    <el-input v-model="form.customerId" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-button @click="bindToSubmit(false)" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

        <Block title="店铺风险监控">
            <el-table :data="table" border >
                <el-table-column prop="storeId" label="店铺ID"></el-table-column>
                <el-table-column prop="storeName" label="店铺名称"></el-table-column>
                <el-table-column prop="platformCode" label="平台">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.platformCode,PlatData,'platformName','platformCode')}}
                    </template>
                </el-table-column>
                <el-table-column prop="nationalCode" label="国家">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.nationalCode,NationCode,'nation','code')}}
                    </template>
                </el-table-column>
                <el-table-column prop="customerNo" label="客户ID"></el-table-column>
                <el-table-column prop="alert" label="Alert"></el-table-column>
                <el-table-column label="详情">
                    <template slot-scope="scope">
                        <a 
                        href="javascript:;" 
                        @click="bindToDetail(scope.row)"
                        class="primary">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>

             <Pagination 
            :page="form.pageNumber"
            :pageSize="form.pageSize"
            :count="form.totalSize"
            :chosefallback="pageChange"
            ></Pagination>
        </Block>
    </div>
</template>

<script>
import {
    queryAlertNumber,
    queryStorePage,
} from '../../../utils/axios/api.js';
import { NationCode,queryPlatform } from './../../../ext/localBase.js';
import mixin from './../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                storeId:'',
                storeName:'',
                platformCode:'',
                countryCode:'',
                customerId:'',
                isAlert:'',         //1
                pageNumber:1,
                pageSize:10,
                totalSize:1,
            },
            AlertCount:{
                alertCustomerNumber:0,
                alertStoreNumber:0,
            },
            table:[],
            listType:false,

            NationCode:NationCode,
            PlatData:[],
        }
    },
    methods:{
        __LOADING(){
            //如果有客户ID  就查当前的客户所有的店铺列表
            this.form.customerId = this.$route.params.customerNo || '';

            this.loadingQuery(this.form);
            queryPlatform().then(res=>{
                this.PlatData=res;
            });
        },
        loadingQuery(params){
            queryStorePage(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalSize = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            });

            queryAlertNumber().then(res=>{
                if(res.code==0){
                    this.AlertCount = res.data
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(bol){

            this.listType = bol;
            this.form.pageNumber=1

            !bol ? (
                this.loadingQuery(this.form)
            ) : this.loadingQuery({
                pageNumber:1,
                pageSize:this.form.pageSize,
                isAlert:1,
            });
        },
        reset(){
            let n = ['pageNumber','pageSize','totalSize'];
            for (const key in this.form) {
                if(!n.includes(key)){
                    this.form[key] = ""
                }
            };
        },
        pageChange(n,per){
            this.form.pageNumber = n,
            this.form.pageSize = per;

            !this.listType ? (
                this.loadingQuery(this.form)
            ):(
                this.loadingQuery({
                    pageNumber:n,
                    pageSize:this.form.pageSize,
                    isAlert:1,
                })
            );

        },
        bindToDetail(params){
            this.$router.push({
                name:'storeRiskDetail',
                params:params
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
    }
}
</script>

<style lang="scss" scoped>
.alert-total{
    width: 50%;
    height: 32px;
    line-height: 32px;
    background-color: rgba(255, 251, 230, 1);
    border: 1px solid rgba(255, 229, 143, 1);
    border-radius: 6px;
    padding: 0 10px;
    margin-bottom: 20px;
    color: #666;
    i{
        color:rgb(219, 183, 62); 
    }
}
</style>
