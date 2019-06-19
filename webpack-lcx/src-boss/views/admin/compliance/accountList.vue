<template>
 <transition name="fade">
    <div>
        <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="客户类型">
                    <el-select v-model="form.customerType" placeholder="请选择客户类型">
                      <el-option label="个人" value="1"></el-option>
                      <el-option label="企业" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户类型">
                    <el-select v-model="form.holderType" placeholder="请选择账户类型">
                      <el-option label="对私" value="1"></el-option>
                      <el-option label="对公" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="审核状态">
                    <el-select v-model="form.status" placeholder="请选择审核状态">
                      <el-option label="待审核" value="1"></el-option>
                      <el-option label="审核通过" value="2"></el-option>
                      <el-option label="审核失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="实名状态">
                    <el-select v-model="form.personalStatus" placeholder="请选择实名状态">
                      <el-option label="待审核" value="1"></el-option>
                      <el-option label="审核通过" value="2"></el-option>
                      <el-option label="审核失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="客户ID">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-form-item label="企业名称">
                    <el-input v-model="form.enterpriseName" placeholder="请输入企业名称"></el-input>
                </el-form-item>

                <el-form-item label="持卡人">
                    <el-input v-model="form.accountName" placeholder="请输入持卡人"></el-input>
                </el-form-item>

                <el-form-item label="银行卡号">
                    <el-input v-model="form.bankNumber" placeholder="请输入银行卡号"></el-input>
                </el-form-item>
                
                <el-form-item label="银行名称">
                    <el-input v-model="form.bankName" placeholder="请输入银行名称"></el-input>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">提现账户审核列表</div>
            <el-table :data="table" border>
              <el-table-column prop="accountName" label="提现人名字"></el-table-column>
              <el-table-column prop="bankName" label="银行"></el-table-column>
              <el-table-column prop="bankNumber" label="银行卡号"></el-table-column>
              <el-table-column prop="customerNo" label="客户编号"></el-table-column>
              <el-table-column label="审核状态">
                  <template slot-scope="scope">
                        <span v-if="scope.row.status==1" class="ing">待审核</span>
                        <span v-if="scope.row.status==2" class="yes">审核通过</span>
                        <span v-if="scope.row.status==3" class="no">审核失败</span>
                  </template>
              </el-table-column>
              <el-table-column label="审核操作" width="220">
                  <template slot-scope="scope">
                        <el-button v-if="scope.row.status!=2" @click="bindCardVerify(scope.row.id,scope.row.customerNo,scope.row.bankNumber,scope.row.accountName)" type="warning"><span class="fa fa-credit-card-alt" ></span></el-button>
                        <el-button v-if="scope.row.status!=2"  @click="bindChangeBankStatus(scope.row.id,scope.row.status,2)" type="success" ><span class="fa fa-check"></span></el-button>
                        <el-button v-if="scope.row.status!=3" @click="bindChangeBankStatus(scope.row.id,scope.row.status,3)" type="danger" ><span class="fa fa-close"></span></el-button>
                  </template>
              </el-table-column>
              <el-table-column label="备注">
                   <template slot-scope="scope">
                        <!-- <input class="cares-input" 
                            v-model="remark[scope.row.id]"
                            placeholder="请添加备注"/> -->
                            <!-- @input="(event)=>{ return bindRemarChange(event,scope.row.id) }"  -->

                            <el-autocomplete
                            class="remark-container"
                             v-model="remark[scope.row.id]"
                            :fetch-suggestions="suggestions"
                            placeholder="输入备注"
                        ></el-autocomplete>
                   </template>
              </el-table-column>
            </el-table>

             <Pagination 
            :page="page.pageNum"
            :pageSize="page.pageSize"
            :count="page.totalSize"
            :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
 </transition>
</template>

<script>
    import { 
        queryHolderList,        //请求列表
        saveHolderAudit,        //保存接口
        validCard,              //银行卡验证
    }  from '../../../utils/axios/api.js';

    import mixin from '../../../ext/mixin.js';


    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                     customerType:'',
                    holderType:'',
                    status:'',
                    personalStatus:'',      //客户实名状态
                    customerNo:'',
                    enterpriseName:'',
                    accountName:'',
                    bankNumber:'',
                    bankName:'',
                },
                table:[],
                remark:{},
                page:{
                    pageNum:1,
                    totalSize:1,
                    pageSize:10
                }
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form)
            },
            suggestions(queryString, cb){
                cb([
                    { "value": "卡号不正确"},
                    { "value": "提现账户开户人与实名认证不一致"},
                    { "value": "银行支行地址错误"},
                    { "value": "预留手机号码不正确"},
                ]);
            },
            loadingQuery(params){

                let ajaxData = Object.assign({},params,this.page);
                
                queryHolderList(ajaxData).then(res=>{
                    if(res.code==0){
                        this.table = res.data;
                        
                        Object.assign(this.page,res.page);

                        this.table.forEach(item=>{
                            this.$set(this.remark,item.id,item.remark);
                        });

                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //点击查询
            bindFormSubmit(){
                this.page.pageNum = 1;
                this.loadingQuery(this.form)
            },
            //重置按钮
            reset(){
                for (const key in this.form) {
                    this.form[key] ='';
                }
            },
            //改变银行卡状态
            bindChangeBankStatus(id,f,status){
                if(f==status) return this.$message.warning(`与当前状态一致`);

                if(status==3 && !this.remark[id]) return this.$message.warning(`请添加审核失败备注`);


                saveHolderAudit({
                    id,
                    status,
                    remark:this.remark[id]
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功`);
                        //修改对应数据
                        this.table.forEach(item=>{
                            (item.id == id) && (item.status = status)
                        });
                    }else{  
                         this.$message.error(res.msg);
                    }
                })
            },
            //验证银行卡
            bindCardVerify(id,customerNo,bankNumber,accountName){
                validCard({
                    id,
                    customerNo,
                    bankNumber,
                    accountName,
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`通过验证！`);
                        this.bindChangeBankStatus(id,0,2);
                    }else if(res.code==2){
                        this.$message.error(`验证失败！`);
                        this.remark[id] = res.msg;
                        // this.$set(this.remark,id,res.msg);
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            // bindRemarChange(event,id){
            //     this.remark[id] = event.target.value;
            // },
            pageChange(n,per){
                this.page.pageNum = n;
                this.page.pageSize = per;
                this.loadingQuery(this.form);
            }
        },
        components:{
        },
    }
</script>

<style lang="scss" scoped>
    table{
        margin-bottom: 20px;
        .el-input{
            width: 90%;
        }
    }
</style>

<style lang="scss">
    .admin-form-inline {
        .account-name-item .el-form-item__label{
            width:110px;
        }
    }

    table{
        .remark-container{
            .el-input{
                width: 90%;
            }
        }
    }
</style>

