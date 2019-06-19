<template>
 <transition name="fade">
    <div>
        <div class="table-container KYC-index">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

                <el-form-item label="客户姓名：">
                    <el-input v-model="form.name" placeholder="请输入客户姓名"></el-input>
                </el-form-item>

                <el-form-item label="手机号码：">
                    <el-input v-model="form.phoneNo" placeholder="请输入注册手机号"></el-input>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
            </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">代言人活动管理列表</div>

            <el-table :data="table" border >
                <el-table-column prop="name" label="客户姓名"></el-table-column>
                <el-table-column prop="phoneNo" label="注册手机号"></el-table-column>
                <el-table-column prop="wechatName" label="微信账号"></el-table-column>
                <el-table-column prop="tjUserCount" label="推荐注册人数"></el-table-column>
                <el-table-column prop="yxUserCount" label="有效推荐人数"></el-table-column>
                <el-table-column prop="amount" label="奖励金额"></el-table-column>
                <el-table-column prop="amountYcl" label="已领取金额"></el-table-column>
                <el-table-column prop="amountDcl" label="待打款金额"></el-table-column>
                <el-table-column prop="amountKlq" label="可领取金额"></el-table-column>
            </el-table>

            <p class="totalCount">
                <span>推荐注册总人数：<b>{{totalCount.tjUserCount}}</b></span>
                <span>有效推荐总人数：<b>{{totalCount.yxUserCount}}</b></span>
                <span>有效转换率：<b>{{toPer(totalCount.yxUserCount/totalCount.tjUserCount)}}</b></span>
            </p>

             <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination> 
        </div>
    </div>
 </transition>
</template>

<script>

    import { spokmanActive,spokmanTotal } from '../../../utils/axios/api.js';

    import {toPercent} from '../../../utils/common.js';

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    phoneNo:'',
                    name:'',

                    pageNum:'1',
                    pageSize:'10',
                    totalSize:'1',
                },
                totalCount:{},
                table:[]
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form);
            },
            loadingQuery(params){

                Promise.all([
                    spokmanActive(params),
                    spokmanTotal()
                ]).then(res=>{

                    let [aRes,bRes] = res;
                    if(aRes.code==0){
                        this.form.totalSize = aRes.page.totalSize;
                        this.form.pageNum = aRes.page.pageNum;
                        this.table = aRes.data;
                    }else{
                        this.$message.error(res.msg);
                    };

                    if(bRes.code==0){
                        this.totalCount = bRes.data
                    }else{
                        this.$message.error(res.msg);
                    }
                    
                    
                });
            },
            reset(){
                this.form.phoneNo = "";
                this.form.name = "";
            },
            bindFormSubmit(){
                this.form.pageNum = 1;
                this.loadingQuery(this.form);
            },
            pageChange(n,pageSize){
                this.form.pageNum = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            toPer(params){
                return toPercent(params)
            }
        }
    }
</script>

<style lang="scss" scoped>
.totalCount{
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    span{
        display: inline-block;
        width: 30%;
        padding-left: 30px;
        b{
            color: #e6a23c;
            // color: red;
        }
    }
}
</style>
