<template>
 <transition name="fade">
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">
                 <!-- <el-form-item label="渠 道" name="username">
                    <el-select v-model="form.username" placeholder="请选择渠道">
                      <el-option label="亚马逊" value="11"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="交割批号" name="deliveryOrderNo">
                    <el-input name="deliveryOrderNo" v-model="form.deliveryOrderNo" placeholder="请输入交割批号"></el-input>
                </el-form-item>

                <el-form-item label="业务编号" name="bizCode">
                    <el-input name="bizCode" v-model="form.bizCode" placeholder="请输入业务编号"></el-input>
                </el-form-item>

                <el-form-item label="充值时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择充值时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="交割时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择交割时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <!-- <el-button @click="bindRecharge()" type="primary">充值备用金</el-button> -->

            </el-form>
        </div>
        
        <div  class="table-container">
            <div class="admin-tab-title">备用金管理列表</div>
            <!-- 查询结果 -->
            <el-table :data="table" border  :span-method="spareColdTable">
                <el-table-column prop="channelName" label="渠道"></el-table-column>
                <el-table-column prop="spareFundAccountId" label="备用金账户"></el-table-column>
                <el-table-column prop="bizCode" label="业务编号"></el-table-column>
                <el-table-column prop="amount" label="备用金额"></el-table-column>
                <el-table-column prop="deliveryOrderNo" label="交割订单号"></el-table-column>
                <el-table-column prop="currentBalance" label="余额"></el-table-column>
                <el-table-column label="创建时间" width="150">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createdDate)}}
                    </template>
                </el-table-column>
                <el-table-column prop="bizName" label="业务名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a class="primary" @click="bindRecharge(scope.row.id)" href="javascript:;">充值</a>   
                    </template>
                </el-table-column>
            </el-table>

              <Pagination 
                :page="form.pageNum"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>

            <!-- 充值备用金弹框 -->
            <AdminModal class="sparecold-adminModal" 
            title="备用金充值"
            confirmTxt="添加"
            v-model="rechargeForm.show" 
            :confirm="bindSaveRecharge">
               <el-form :inline="true" :model="rechargeForm">
                   <el-form-item label="充值金额">
                       <el-input v-model="rechargeForm.amount" placeholder="请输入充值金额"></el-input>
                   </el-form-item>

                   <el-form-item class="channel">
                       <el-select v-model="rechargeForm.channelCode" placeholder="选择渠道">
                           <el-option v-for="(item,index) in  ChannelArr" v-if="index>0" :key="index"
                                :label="item.channelName"
                                :value="item.channelCode"
                            ></el-option>
                       </el-select>
                   </el-form-item>
                </el-form>
            </AdminModal>
        </div>
    </div>
</transition>
</template>

<style lang="scss">
    .sparecold-adminModal{
        .content{
                text-align: center;
                padding: 37px 0;
                .el-form-item{
                    margin: 0;
                }
                .channel{
                    width: 120px;
                }
            }
    }
       
</style>


<script>
    // 备用金
    import {querySpareGold,saveChargeSpare} from '../../../utils/axios/api.js'
    import {formatTimer,fiterTableRow,rowspanFn} from '../../../utils/common.js'
    import {queryChannel} from '../../../ext/localBase.js'

    import AdminModal from '../../../components/adminModal.vue';
     import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                   deliveryOrderNo:'',
                   bizCode:'',
                   startTime:'',
                   endTime:'',
                   pageNum:'1',
                   pageSize:'10',
                   totalSize:'1'
                },
                table:[],

                rechargeForm:{
                    show:false,
                    id:'',
                    amount:'',
                    channelCode:''
                },

                ChannelArr:[],
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                queryChannel().then(res=>{
                    this.ChannelArr = res;
                }) 
            },
            reset(){
                let n = ['pageNum','pageSize','totalSize'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.form[key] = "";
                    }
                }
            },
            loadingQuery(params){
                querySpareGold(params).then(res=>{
                    if(res.code==0){
                        this.table = fiterTableRow(res.data.content || [],`channelName`);
                        this.form.totalSize = res.data.totalPages
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            spareColdTable({row, column, rowIndex, columnIndex}){

                return rowspanFn([0],columnIndex,rowIndex,row,this.table,`channelName`);

            },
            //查询按钮
            bindFormSubmit(){
                this.form.page = 1;
                this.loadingQuery(this.form);
            },
            //弹出充值备用金模态框
            bindRecharge(id){
                this.rechargeForm.show = true;
                this.rechargeForm.id = id || "";
            },
            //确认充值备用金
            bindSaveRecharge(){
                // if(!this.rechargeForm.id) return this.$message.warning(`缺少ID`);
                if(!this.rechargeForm.amount) return this.$message.warning(`请输入充值金额`);
                if(!this.rechargeForm.channelCode) return this.$message.warning(`请选择渠道`);
                saveChargeSpare(this.rechargeForm).then(res=>{
                    if(res.code==0){
                        this.$message.success(`充值成功!`);
                        this.loadingQuery(this.form);
                    }else{  
                        this.$message.error(res.msg);
                    }
                });
            },
            //隐藏备用金模态框
            bindHideChargeModule(){
                this.rechargeForm.show = false;
            },
            //页码选择的时候
           pageChange(n,pageSize){
               this.form.pageNum = n;
               this.form.pageSize = pageSize;
               this.loadingQuery(this.form);
           },
           formatDate(p){
               return formatTimer(p);
           }
        },
        components:{
            AdminModal
        },
    }
</script>


