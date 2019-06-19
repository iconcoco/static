<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :inline="true" :model="form">

                 <el-form-item label="客户姓名：">
                    <el-input v-model="form.name" placeholder="请输入客户姓名"></el-input>
                </el-form-item>

                 <el-form-item label="公司名称：">
                    <el-input v-model="form.company" placeholder="请输入公司名称"></el-input>
                </el-form-item>

                 <el-form-item label="手机号码：">
                    <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                 <el-form-item label="客户状态：">
                    <el-select v-model="form.status" placeholder="请选择客户类型">
                        <el-option v-for="(item,index) in customerStatusData"
                            :key="index"
                            :value="item.key"
                            :label="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="录入时间">
                    <el-date-picker
                        type="daterange"
                        v-model="createdTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="最后跟进时间">
                    <el-date-picker
                        type="daterange"
                        v-model="followTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>


                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <Block
            title="待分配客户列表"
            class="KYC-index"
        >
            <el-button type="success" @click="bindToHandOut">分配客户</el-button>
            <div class="select-table-container">
                <p class="all">
                    <el-checkbox 
                        v-model="AllSelect" 
                        @change="bindHandleCheckAllChange"
                        :disabled="!table.length"
                    ></el-checkbox>
                </p>
                <el-table :data="table" border >
                    <el-table-column fixed width="56" :resizable="false">
                         <template slot-scope="scope">
                            <el-checkbox
                             :label="scope.row.id" v-model="handOutData"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="客户姓名"></el-table-column>
                    <el-table-column prop="company" label="公司名称"></el-table-column>
                    <el-table-column prop="businessScope" label="经营范围"></el-table-column>
                    <el-table-column prop="businessChannelDesc" label="经营渠道"></el-table-column>
                    <el-table-column prop="amountScope" label="月交易额度">
                         <template slot-scope="scope">
                            {{amountScopeName(scope.row.amountScope)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payTypeDesc" label="现有收款方式"></el-table-column>
                    <el-table-column prop="phone" width="100" label="手机"></el-table-column>
                    <el-table-column prop="preDistrUserName" label="前跟进人"></el-table-column>
                    <el-table-column prop="status" label="客户状态">
                         <template slot-scope="scope">
                            {{statusFormat(scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdTime" width="150" label="录入时间">
                        <template slot-scope="scope">
                            {{formatTimer(scope.row.createdTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastFollowTime" width="150" label="最后跟进时间">
                        <template slot-scope="scope">
                            {{formatTimer(scope.row.lastFollowTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- id -->
                            <a class="primary" @click="bindToFollowDetail(scope.row.id)" href="javascript:;">查看详情</a>
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
        </Block>
        <AdminModel
            v-model="isShowModel"
            title="客户分配"
            :confirm="bindModelConfirm"
        >
            <el-form :inline="true" class="modal-form" :model="modalForm">
                <el-form-item label="分配跟进人">
                    <el-select v-model="modalForm.distrUser" placeholder="请选择分配人">
                        <el-option v-for="(item,index) in saleStatusData" :key="index"
                            :label="item.userName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </AdminModel>
    </div>
</template>

<script>

import AdminModel from './../../../components/adminModal.vue';

 import {formatTimer} from '../../../utils/common.js'; 
 import {
     salesVolume,
     queryCustomerStatus,
     queryAbleSale
} from '../../../ext/localBase.js'; 

import { getCustomerList,distrCustomer } from './../../../utils/axios/api.js';
import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            form :{
                name:"",
                company:"",
                phone:"",
                status:"",
                startCreatedTime:"",
                endCreatedTime:"",
                startFollowTime:"",
                endFollowTime:"",

                isDistr:'0',

                page:1,
                size:10,
                totalPages:1
            },
            createdTime:[],
            followTime:[],

            modalForm:{
                distrUser:'',
            },
            table:[],
            handOutData:[],
            AllSelect:false,
            isShowModel:false,

            customerStatusData:[],
            saleStatusData:[],
        }
    },
    watch:{
        handOutData(n){
            this.AllSelect = n.length == this.table.length;
        }
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form),
            Promise.all([
                queryCustomerStatus(),
                queryAbleSale(),
            ]).then(([a,b])=>{
                this.customerStatusData = a;
                this.saleStatusData = b;
            });
        },
        loadingQuery(parmas){
            getCustomerList(parmas).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalPages = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(){
            this.form.page = 1;

            this.form.startCreatedTime = this.createdTime[0];
            this.form.endCreatedTime = this.createdTime[1];
            this.form.startFollowTime = this.followTime[0];
            this.form.endFollowTime = this.followTime[1];

            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['page','size','totalPages','isDistr'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = ""
                }
            };

            this.createdTime = [],
            this.followTime=[];
        },
        bindHandleCheckAllChange(bol){
            if(bol){
                this.table.forEach(item=>{
                    this.handOutData.indexOf(item.id)<0 && this.handOutData.push(item.id);
                });
            }else{
                this.handOutData = [];
            }
        },
        bindToHandOut(){
            if(!this.handOutData.length) return this.$message.warning(`至少选择一条记录！`);
            this.isShowModel = true;
        },
         bindToFollowDetail(id){
            let data = null
            this.table.forEach(item=>{
                if(item.id == id) data = item;
            });
             this.$router.push({
                name:'followCustomerDetail',
                params:{
                    data
                }
            });
        },
        bindModelConfirm(){
            distrCustomer({
                customerIds:this.handOutData.join(","),
                distrUser:this.modalForm.distrUser
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`分配成功！`);
                    this.isShowModel = false;
                    this.loadingQuery(this.form);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        pageChange(n,per){
           this.form.page = n;
           this.form.size = per;
           this.loadingQuery(this.form);
        },
        formatTimer(code){
            return formatTimer(code)
        },
        statusFormat(code){
            let str = null
            this.customerStatusData.forEach(item=>{
                item.key == code && (str = item.value)
            });
            return str;
        },
        amountScopeName(code){
            let str = null
            salesVolume.forEach(item=>{
                item.saleCode == code && (str = item.saleName)
            });
            return str;
        }
    },
    components:{
        AdminModel
    }
}
</script>

<style lang="scss" scoped>
.modal-form{
    padding-top: 20px;
    text-align: center;
}
</style>
