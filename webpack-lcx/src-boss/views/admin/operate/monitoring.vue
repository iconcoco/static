<template>
 <transition name="fade">
    <div>
       <div class="table-container KYC-index">
            <div class="admin-tab-title">代言人活动页面监控报表</div>
           <el-table :data="table" border >
                <el-table-column prop="days" label="日期"></el-table-column>
                <el-table-column prop="registerPageView" label="注册首页访问量"></el-table-column>
                <el-table-column prop="bindEmailPageView" label="绑定邮箱页面访问页"></el-table-column>
                <el-table-column prop="bindStorePageView" label="绑定店铺页访问量"></el-table-column>
                <el-table-column prop="authPageView" label="实名认证页访问量"></el-table-column>
                <el-table-column prop="validCount" label="有效注册用户数"></el-table-column>
                <el-table-column prop="changeRate" label="注册成功转化率"></el-table-column>
           </el-table>

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
    import { spokmanDataValid } from '../../../utils/axios/api.js';
     import mixin from '../../../ext/mixin.js';
    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    pageNum:'1',
                    pageSize:'10',
                    totalSize:'1'
                },
                table:[]
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form)
            },
            loadingQuery(params){
                spokmanDataValid(params).then(res=>{
                    if(res.code==0){
                        this.table = res.data.list;
                        this.form.totalSize = res.data.totalSize;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            pageChange(n,pageSize){
                this.form.pageNum = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            }
        },
    }
</script>

