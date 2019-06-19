<template>
 <transition name="fade">
    <div class="KYC-index">
        <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">

                 <el-form-item label="客户类型">
                    <el-select v-model="form.customerType" placeholder="请选择客户类型">
                      <el-option label="个人" value="1"></el-option>
                      <el-option label="企业" value="2"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="客户ID">
                    <el-input v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                 <el-form-item label="店铺ID">
                    <el-input v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                 <el-form-item label="客户名称">
                    <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                 <el-form-item label="企业名称">
                    <el-input v-model="form.companyName" placeholder="请输入企业名称"></el-input>
                </el-form-item>

                 <el-form-item class="account-name-item" label="申请人KYC状态">
                    <el-select v-model="form.personalStatus" placeholder="申请人KYC状态">
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                        <el-option label="审核失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="account-name-item"  label="企业KYC状态">
                    <el-select v-model="form.companyStatus" placeholder="企业KYC状态">
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                        <el-option label="审核失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="account-name-item"  label="店铺KYC状态">
                    <el-select v-model="form.storeStatus" placeholder="店铺KYC状态">
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                        <el-option label="审核失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="account-name-item"  label="客户风险评级">
                    <el-select v-model="form.customerRiskLevel" placeholder="客户风险评级">
                        <el-option label="低风险" value="1"></el-option>
                        <el-option label="中风险" value="2"></el-option>
                        <el-option label="高风险" value="3"></el-option>
                        <el-option label="EDD" value="4"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="account-name-item"  label="店铺风险评级">
                    <el-select v-model="form.storeRiskLevel" placeholder="店铺风险评级">
                        <el-option label="低风险" value="1"></el-option>
                        <el-option label="中风险" value="2"></el-option>
                        <el-option label="高风险" value="3"></el-option>
                        <el-option label="EDD" value="4"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item class="account-name-item"  label="店铺平台类型">
                     <el-select v-model="form.platformCode" placeholder="请选择店铺所属平台">
                       <el-option v-for="(item,index) in PLAT_ARR" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                       ></el-option>
                     </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button @click="bindExportKYC" type="success">导出KYC文件</el-button>


            </el-form>
        </div>

        <div class="table-container">
            
            <div class="admin-tab-title">KYC审核列表</div>

            <div class="select-table-container">
                <p class="all">
                    <el-checkbox 
                        v-model="All" 
                        @change="bindHandleCheckAllChange"
                        :disabled="!Allow.length"
                    ></el-checkbox>
                </p>
                <el-table :data="keyList" border  >
                    <!-- <el-table-column width="56" type="selection"> -->
                    <el-table-column width="56" :resizable="false">
                        <template slot-scope="scope">
                            <el-checkbox
                                :disabled="!(scope.row.platformCode=='EU')"
                             :label="scope.row.storeId" v-model="exportKYC"></el-checkbox>
                        </template>
                    </el-table-column>

                    <el-table-column prop="customerNo" width="160" label="客户ID"> </el-table-column>
                    
                    <el-table-column prop="customerType" label="客户类型">
                        <template slot-scope="scope">
                            {{scope.row.customerType =='1'?'个人':'公司'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="customerName" label="客户名称"> </el-table-column>

                    <el-table-column prop="actualStoreId" label="店铺ID"> </el-table-column>

                    <el-table-column prop="storeName" label="店铺名称"> </el-table-column>

                    <el-table-column prop="personalStatus" label="申请人KYC状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.personalUpdateTime" placement="top">
                                <span class="yes" v-if="scope.row.personalStatus==2">审核通过</span>
                                <span class="no" v-if="scope.row.personalStatus==3">审核失败</span>
                                <span class="ing" v-if="scope.row.personalStatus<=1">待审核</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column prop="companyStatus" label="企业KYC状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.companyUpdateTime" placement="top">
                                <span class="yes" v-if="scope.row.companyStatus==2">审核通过</span>
                                <span class="no" v-if="scope.row.companyStatus==3">审核失败</span>
                                <span class="ing" v-if="scope.row.companyStatus<=1">待审核</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column prop="storeStatus" label="店铺KYC状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.storeUpdateTime" placement="top">
                                <span class="yes" v-if="scope.row.storeStatus==2">审核通过</span>
                                <span class="no" v-if="scope.row.storeStatus==3">审核失败</span>
                                <span class="ing" v-if="scope.row.storeStatus<=1">待审核</span>

                                <span class="waiting" v-if="scope.row.storeStatus==4">海外银行待审核</span>
                                <span class="ing" v-if="scope.row.storeStatus==5">海外银行审核中</span>
                                <span class="yes" v-if="scope.row.storeStatus==6">海外银行审核通过</span>
                                <span class="no" v-if="scope.row.storeStatus==7">海外银行审核失败</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column prop="customerRiskLevel" label="客户风险评级">
                        <template  slot-scope="scope">
                            待定
                        </template>
                    </el-table-column>

                    <el-table-column prop="storeRiskLevel" label="店铺风险评级">
                        <template  slot-scope="scope">
                            待定
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template  slot-scope="scope">
                            <!-- <a class="primary" @click="bindJumpToKyc(scope.row.storeId)" href="javascript:;">KYC审核</a> -->
                            <a class="primary" @click="bindJumpToKyc(scope.$index)" href="javascript:;">KYC审核</a>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
              

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
        queryKycIndexList,
    exportKycInfo 
    } from '../../../utils/axios/api.js';

    import { queryPlatform } from '../../../ext/localBase.js';

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins: [mixin()],
        data(){
            return{
                keyList:[],
                form:{
                    customerType:'',
                    customerNo:'',
                    storeId:'',
                    customerName:'',
                    companyName:'',
                    personalStatus:'',
                    companyStatus:'',
                    storeStatus:'',
                    customerRiskLevel:'',
                    storeRiskLevel:'',

                    platformCode:''

                },
                page:{
                    pageNum:1,
                    totalSize:1,
                    pageSize:10
                },
                PLAT_ARR:[],
                exportKYC:[],
                All:false,
                Allow:[],
            }
        },
        watch:{
           exportKYC(n){
            //    console.log(n.length==this.keyList.length);
               this.All = (n.length==this.Allow.length)
           }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                queryPlatform().then(res=>{ this.PLAT_ARR = res });
            },
            loadingQuery(params){
                let ajaxData = Object.assign({},params,this.page);

                queryKycIndexList(ajaxData).then(res=>{
                    if(res.code==0){
                        this.keyList = res.data;

                        this.Allow = [];
                        this.All = false;
                        this.exportKYC=[];


                        this.keyList.map(item=>{
                            if(item.platformCode=='EU'){
                                this.Allow.push(item.storeId);
                            }
                        });

                        Object.assign(this.page,res.page)
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //点击查询
            bindFormSubmit(){
                this.page.pageNum = 1;
                this.loadingQuery(this.form);
            },
            //点击重置
            reset(){
                for (const key in this.form) {
                    this.form[key] = "";
                }
            },
            bindExportKYC(){
                if(!this.exportKYC.length) return this.$message.warning(`请选择需要导出文件的选项！`);
                window.open(`${exportKycInfo}${this.exportKYC.join(",")}`);
            },
            //跳转到kyc
            bindJumpToKyc(listIndex){
                // let id = this.kycForm.kycId;
                // if(!id) return this.$message.warning(`没有店铺ID！`);
                this.keyList.forEach((item,index)=>{
                    // if(item.storeId == id){
                    if(listIndex == index){
                        //跳转到KYC审核的界面
                        this.$router.push({ 
                            name: 'KYCdetail',
                            params: { 
                                userId:item.id,
                                enterpriseId:item.enterpriseId,
                                storeNo:item.storeNo,

                                platformAppId:item.platformAppId,
                                platformCode:item.platformCode,
                                platformEnId:item.platformEnId,
                                customerNo:item.customerNo,
                                storeId:item.storeId,
                                nationalCode:item.nationalCode,
                                otherStatus:item.otherStatus,
                                currency:item.currency
                            }
                         });
                    }
                });
            },
            //全选按钮
            bindHandleCheckAllChange(){
                if(this.All){
                   this.Allow.map(storeid=>{
                      if(this.exportKYC.indexOf(storeid)<0) {
                          this.exportKYC.push(storeid);
                      }
                   });
               }else{
                   this.exportKYC = [];
               }
                
            },
            //页码变化
            pageChange(n,per){
                this.page.pageNum = n;
                this.page.pageSize = per;
                this.loadingQuery(this.form);
            }
        },
    }
</script>

<style lang="scss">
    .KYC-index{
        table{
            // margin-bottom: 20px;
            .el-radio__label,
            .el-checkbox__label{
                display: none;
            }
        }
    }

    .select-table-container{
        position: relative;
        .all{
            position: absolute;
            height: 48px;
            line-height: 68px;
            left: 22px;
            z-index: 20;
        }
    }
</style>


<style lang="scss" scoped>
    .KYC-index{
        .radio{
            width:60px;
        }
    }
</style>

