<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline" :inline="true">

                <ElFormItem label="客户ID">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </ElFormItem>

                <ElFormItem label="店铺ID">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </ElFormItem>

                <ElFormItem label="客户名称">
                    <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </ElFormItem>

                <el-form-item label="生效时间"  class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="reportTime"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="失效时间"  class="widthAuto">
                    <el-date-picker
                        type="daterange"
                        v-model="loseTime"
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
                <el-button @click="changeModelStatus(true)" type="success">新增</el-button>

            </el-form>
        </div>

         <Block title="闪提宝限免店铺列表">
            <el-table :data="table" border>
                <ElTableColumn prop="customerNo" label="客户ID"></ElTableColumn>
                <ElTableColumn prop="customerName" label="客户名称"></ElTableColumn>
                <ElTableColumn prop="storeId" label="店铺ID"></ElTableColumn>
                <ElTableColumn prop="storeName" label="店铺名称"></ElTableColumn>
                <ElTableColumn prop="platformCode" label="平台">
                    <template slot-scope="scope">
                        {{platformName(scope.row.platformCode)}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="sourceName" label="销售负责人"></ElTableColumn>
                <ElTableColumn prop="activatTime" label="生效时间">
                     <template slot-scope="scope">
                        {{scope.row.activatTime | formatDate}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="finishTime" label="失效时间">
                    <template slot-scope="scope">
                        {{scope.row.finishTime | formatDate}}
                    </template>
                </ElTableColumn>
            </el-table>

             <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </Block>


        <AdminModel
            title="新增闪提宝限免店铺"
            v-model="modelStatus"
            :confirm="addNewOne"
        >
            <ElForm :model="modelForm"  class="admin-form-inline suspicious-form" :inline="true">
                <ElFormItem label="店铺ID：">
                    <el-input v-model="modelForm.storeId" placeholder="输入店铺ID"></el-input>
                </ElFormItem>
                <ElFormItem label="限免时效：">
                    <el-select v-model="modelForm.activatDay" placeholder="选择活动限免时效">
                        <ElOption label="180天" value="180"></ElOption>
                    </el-select>
                </ElFormItem>
            </ElForm>
        </AdminModel>

    </div>
</template>

<script>

import AdminModel from './../../../components/adminModal.vue';

import {
    getListFlashwithdraw,
    addStoreTaste
} from '../../../utils/axios/api.js';

import {queryPlatform} from '../../../ext/localBase.js';

import { formatTimer } from '../../../utils/common.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                customerNo:'',
                storeId:'',
                customerName:'',
                activatStartTime:'',
                activatEndTime:'',
                finishStartTime:'',
                finishEndTime:'',

                pageNum:'1',
                pageSize:'10',
                totalSize:'1',
            },

            modelForm:{
                storeId:'',
                activatDay:'',
            },

            Platform:[],

            reportTime:[],
            loseTime:[],

            table:[],
            modelStatus:false
        }
    },
    methods:{
         __LOADING(){
            this.loadingQuery(this.form);
            queryPlatform().then(res=>{
                this.Platform = res;
            });
        },
        loadingQuery(params){
            getListFlashwithdraw(params).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                    this.form.totalSize = res.page.total;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindToSubmit(){
            this.form.pageNum = 1;

            this.reportTime.length && (this.form.activatStartTime = `${this.reportTime[0]} 00:00:00`);
            this.reportTime.length && (this.form.activatEndTime = `${this.reportTime[1]} 23:59:59`);

            this.loseTime.length && (this.form.finishStartTime = `${this.loseTime[0]} 00:00:00`);
            this.loseTime.length && (this.form.finishEndTime = `${this.loseTime[1]} 23:59:59`);

            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['pageNum','pageSize','totalSize'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = ""
                }
            };

            this.reportTime = [];
            this.loseTime = [];
        },

        pageChange(n,per){
            this.form.pageNum = n;
            this.form.pageSize = per;
            this.loadingQuery(this.form);
        },

        changeModelStatus(bol){
            this.modelStatus = bol
        },

        addNewOne(){
            for (const key in this.modelForm) {
                if(!this.modelForm[key]){
                    let msg = null;
                    key == 'storeId' && (msg = '请输入店铺ID');
                    key == 'activatDay' && (msg = '请选择限免时效');
                    return this.$message.warning(msg);
                }
            }

            addStoreTaste(this.modelForm).then(res=>{
                if(res.code==0){
                    this.$message.success('添加成功！');
                    this.changeModelStatus(false);
                    this.bindToSubmit();
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
         platformName(code){
            let str = null;
            this.Platform.forEach(item=>{
                if(item.platformCode==code){ str = item.platformName }
            }) ;
            return str;
        },
    },
    components:{
        AdminModel
    },
    filters:{
        formatDate(value){
            return formatTimer(value)
        }
    }
}
</script>
