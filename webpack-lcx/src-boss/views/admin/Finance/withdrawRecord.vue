<template>
 <transition name="fade">
    <div>
        <div class="table-container form-tab">
            选择提现方式：
            <a @click="bindToFormTab(1)" :class="{active:activeForm==1}" href="javascript:;">提现人民币到国内</a>
            <a @click="bindToFormTab(2)" :class="{active:activeForm==2}" href="javascript:;">提现外币到香港</a>
        </div>
        <div class="table-container r-form-container">
            <!-- 提现人民币到国内 -->
            <el-form v-show="activeForm==1" class="admin-form-inline" :inline="true" :model="form">
                 <el-form-item label="子账号">
                    <el-input  placeholder="请输入子账号"   name="entityAccountNo" v-model="form.entityAccountNo" ></el-input>
                </el-form-item>

                <el-form-item label="店铺 ID" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="提现状态" name="username">
                    <el-select v-model="form.withdrawStatus" placeholder="请选择提现状态">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="进行中" value="1"></el-option>
                      <el-option label="成功" value="2"></el-option>
                      <el-option label="失败" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item label="银行账号" name="entityAccountNo">
                    <el-input name="entityAccountNo" v-model="form.entityAccountNo" placeholder="海外银行的子账号"></el-input>
                </el-form-item> -->

                <!-- <el-form-item label="换汇批号" name="settlementOrderNo">
                    <el-input name="settlementOrderNo" v-model="form.settlementOrderNo" placeholder="请输入换汇批号"></el-input>
                </el-form-item> -->

                 <el-form-item label="入账币种" name="targetCurrency">
                    <el-select v-model="form.targetCurrency" placeholder="请选择入账币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="提现币种" name="currency">
                    <el-select v-model="form.currency" placeholder="请选择提现币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="平 台" name="platform">
                    <el-select v-model="form.platform" placeholder="请选择平台">
                      <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="渠 道" name="channelId">
                    <el-select v-model="form.channelId" placeholder="请选择渠道">
                       <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="开始时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>
                 
                 <el-form-item class="finance-withdraw-item" label="可创建结汇状态" name="username">
                    <el-select v-model="form.settleStatus" placeholder="请选择可创建结汇状态">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="是" value="0"></el-option>
                      <el-option label="否" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindSubmitForm" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <!-- <el-button @click="bindCreatNo" type="success">创建结汇批次号</el-button> -->

            </el-form>

            <!-- 提现外币到香港 -->
            <el-form v-show="activeForm==2" class="admin-form-inline" :inline="true" :model="hkForm">
                <el-form-item label="子账号">
                    <el-input  placeholder="请输入子账号" v-model="hkForm.entityAccountNo"></el-input>
                </el-form-item>

                <el-form-item label="店铺 ID">
                    <el-input  placeholder="请输店铺ID" v-model="hkForm.storeId"></el-input>
                </el-form-item>

                <el-form-item label="提现状态">
                    <el-select v-model="hkForm.withdrawStatus" placeholder="请选择提现状态">
                      <el-option label="全部" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠 道" name="channelId">
                    <el-select v-model="hkForm.channelId" placeholder="请选择渠道">
                       <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="提现币种" >
                    <el-select v-model="hkForm.currency" placeholder="请选择提现币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="平 台" name="platform">
                    <el-select v-model="hkForm.platform" placeholder="请选择平台">
                      <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="开始时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="hkForm.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="hkForm.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindSubmitForm" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>

            </el-form>
        </div>

  

        
        <div  class="table-container">
            <div class="admin-tab-title">提现记录列表</div>
            <!-- 查询结果 -->

            <!-- 提现人民币到国内 -->
            <div v-if="activeForm==1" class="KYC-index">
                <div class="select-table-container">
                    <p class="all">
                        <el-checkbox 
                        v-model="All" 
                        :disabled="!Allow.length"
                        @change="bindHandleCheckAllChange"></el-checkbox>
                    </p>
                    <el-table :data="table" border>
                        <el-table-column fixed width="56" :resizable="false">
                            <template slot-scope="scope">
                                <el-checkbox 
                                :disabled="!((scope.row.status==2)&&(scope.row.settlementStatus==1 || scope.row.settlementStatus==4))"
                                :label="scope.row.id" 
                                v-model="exportKYC">
                                </el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column width="88" prop="entityAccountNo" label="子账号"></el-table-column>
                        <el-table-column width="148" label="提现时间">
                            <template slot-scope="scope">
                                {{formatT(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="platform"  label="平台"></el-table-column>
                        <el-table-column prop="channelCode"  label="渠道"></el-table-column>
                        <el-table-column prop="targetCurrency" label="入账币种"></el-table-column>
                        <el-table-column prop="balanceAmount" label="可提现金额">
                            <template slot-scope="scope">
                                {{(scope.row.balanceAmount/100).toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="申请提现金额">
                             <template slot-scope="scope">
                                {{(scope.row.amount/100).toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="targetAmount" label="实际代付金额">
                            <template slot-scope="scope">
                                {{(scope.row.targetAmount/100).toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="exchangeRate" label="结算汇率"></el-table-column>
                        <el-table-column prop="bankAccount" label="提现银行账号"></el-table-column>
                        <el-table-column prop="bankName" label="提现银行名称"></el-table-column>
                        <el-table-column prop="bankAccountName" label="提现账号名称"></el-table-column>
                        <el-table-column prop="currency" label="提现币种"></el-table-column>
                        <el-table-column label="是否可创建结汇">
                            <template slot-scope="scope">
                                <span class="yes" v-if="(scope.row.status==2)&&(scope.row.settlementStatus==1 || scope.row.settlementStatus==4)">是</span>
                                <span class="no" v-else>否</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="提现状态">
                            <template slot-scope="scope">
                                <span class="ing" v-if="scope.row.status==0">待处理</span>
                                <span class="yes" v-if="scope.row.status==2">处理成功</span>
                                <span class="yes" v-if="scope.row.status==1">已处理</span>
                                <span class="no" v-if="scope.row.status==3">处理失败</span>

                                <p v-if="scope.row.failStatus==1"><a class="primary" @click="bindAgainWithdrawApply(scope.row.withdrawNo)" href="javascript:;">重新发起</a></p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="channelRespContent" label="异常原因">
                             <template slot-scope="scope">
                                 <span v-if="scope.row.failStatus==1">{{scope.row.channelRespContent}}</span>
                             </template>
                        </el-table-column>

                    </el-table>
                </div>

                 <Pagination 
                    :page="form.pageNum"
                    :pageSize="form.pageSize"
                    :count="form.totalPages"
                    :chosefallback="pageChange"
                ></Pagination>

                <div class="bottom-handle-box">
                    <el-checkbox 
                        v-model="AllPage"
                        @change="bindCheckAllPage"
                        :disabled="!(exportAllData.length)"
                    >全选</el-checkbox>
                    <span @click="bindDeleteAll">删除</span>

                    <ul class="fr">
                        <li>已选择 <span>{{exportKYC.length}}</span> 条记录 </li>
                        <li>结款金额：<span>{{(exportAmount/100).toFixed(2)}}</span></li>
                        <li>币种：<span>{{exportCrrency}}</span></li>
                        <li>
                            <el-button @click="bindCreatNo" type="primary">创建结汇批次号</el-button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 提现外币到香港 -->
           <div v-if="activeForm==2" >
                <el-table :data="hkTable" border >
                    <el-table-column width="88" prop="entityAccountNo" label="子账号"></el-table-column>
                    <el-table-column width="148" label="提现时间">
                        <template slot-scope="scope">
                            {{formatT(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="platform" label="平台"></el-table-column>
                    <el-table-column prop="channelCode" label="渠道"></el-table-column>
                    <el-table-column prop="targetCurrency" label="提现币种"></el-table-column>
                    <el-table-column prop="balanceAmount" label="可提现金额">
                         <template slot-scope="scope">
                                 {{(scope.row.balanceAmount/100).toFixed(2)}}
                            </template>
                    </el-table-column>
                    <el-table-column prop="amount"  label="申请提现金额">
                          <template slot-scope="scope">
                                 {{(scope.row.amount/100).toFixed(2)}}
                            </template>
                    </el-table-column>
                    <el-table-column  prop="targetAmount" label="实际打款金额">
                         <template slot-scope="scope">
                                {{(scope.row.targetAmount/100).toFixed(2)}}
                            </template>
                    </el-table-column>
                    <el-table-column prop="bankAccount" label="提现银行卡账号"></el-table-column>
                    <el-table-column prop="bankName" label="提现银行名称"></el-table-column>
                    <el-table-column prop="currency" label="提现币种"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span class="ing" v-if="scope.row.status==0">待处理</span>
                            <span class="yes" v-if="scope.row.status==2">处理成功</span>
                            <span class="yes" v-if="scope.row.status==1">已处理</span>
                            <span class="no" v-if="scope.row.status==3">处理失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button type="success" @click="bindToDetaile(scope.row.id)">查看详情</el-button> -->
                            <a v-if="scope.row.channelType=='C'" href="javascript:;" class="primary" @click="bindToDetaile(scope.row.id)">查看详情</a>
                        </template>
                    </el-table-column>
                </el-table>

                <Pagination 
                    :page="hkForm.pageNum"
                    :pageSize="hkForm.pageSize"
                    :count="hkForm.totalPages"
                    :chosefallback="pageChange"
                ></Pagination>
           </div>
        </div>
    </div>
 </transition>
</template>

<script>
    // 提现记录
    
    import {withdrawRecord
    ,createNewSettleBatchNo
    ,againWithdrawApply
    ,queryValidSettleWithdrawList} from '../../../utils/axios/api.js'
    import {formatTimer,getTimer} from '../../../utils/common.js'

    import {
        queryPlatform,
        queryChannel,
        queryCurrency,
    } from '../../../ext/localBase.js';

     import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    channelType:'A',
                    storeId:'',
                    entityAccountNo:'',//子账号
                    platform:'',    //平台
                    channelId:'',   //渠道
                    targetCurrency:'',
                    currency:'USD',
                    startTime:'',
                    endTime:'',
                    withdrawStatus:'',//提现状态
                    settleStatus:'',//可创建结汇状态

                    pageNum:'1',
                    pageSize:'10',
                    totalPages:'1',
                },
                hkForm:{
                    channelType:'C',
                    entityAccountNo:'',
                    storeId:'',
                    withdrawStatus:'',
                    channelId:'',
                    currency:'',
                    platform:'',
                    startTime:'',
                    endTime:'',

                    pageNum:'1',
                    pageSize:'10',
                    totalPages:'1',
                },

                table:[],
                hkTable:[],

                activeForm:1,

                Allow:[],   //当前页可以选择的所有记录的ID
                exportKYC:[],   //已经选择的ID
                All:false,  //当前页的全选
                AllPage:false, //所有页面的全选
                exportCrrency:"",   //结汇批次号的币种
                exportAmount:0,   //结汇批次号的总金额
                exportAllData:[],

                platArr:[],
                ChannelArr:[],
                Currency:[],
            }
        },
        watch:{
          exportKYC(n){
             
                //1. 判断当前页是否全选
                if(n.length){
                    let f = true;
                    for (let index = 0; index <  this.Allow.length; index++) {
                        let el = this.Allow[index];
                        if(n.indexOf(el)<0){ f = false; break; }
                    };
                    this.All = f;
                    //所有页面的全选
                    this.AllPage = (n.length == this.exportAllData.length);
                };
              
                //2. 计算当前选择的总金额
                let num = 0;
                this.exportAllData.map(item=>{
                    let id = item.id;
                    if(n.indexOf(id)>-1){
                        let am = item.amount*(1-item.serviceRate);
                        num += am;
                    }
                });
                this.exportAmount = num;
          },
        },
        methods:{
            __LOADING(){
                //一进来先查询一番
                this.bindSubmitForm(),
                 Promise.all([
                    queryPlatform(),
                    queryChannel(),
                    queryCurrency(),
                ]).then(res=>{
                    let [a,b,c] = res;
                    this.platArr = a;
                    this.ChannelArr = b;
                    this.Currency = c;
                });
            },
            reset(){
                 let n = ['pageNum','pageSize','totalPages','channelType'];
                for (const key in this.form) {
                    if(n.indexOf(key)<0){
                        this.activeForm==1 ?
                        (this.form[key] = ""):
                        (this.hkForm[key] = "")
                    }
                }
            },
            loadingQuery(params){
                withdrawRecord(params).then(res=>{
                    if(res.code == 0){
                        if(this.activeForm==1){
                            this.table = res.data.content;
                            this.form.totalPages = res.data.totalPages;
                            //结汇批次号的币种显示
                            this.exportCrrency = params.currency;
                            //1. 先清空当前页面所有的可以选的数据

                            this.Allow = [];
                            let f = true;
                            this.table.map(item=>{
                                //查找可以选择的id
                                if(item.status==2 && (item.settlementStatus==1||item.settlementStatus==4)){
                                    this.Allow.indexOf(item.id)<0 && this.Allow.push(item.id);
                                    if(this.exportKYC.indexOf(item.id)<0){ f = false};
                                }
                            });

                            this.All = f;

                        }else{
                            this.hkTable = res.data.content;
                            this.hkForm.totalPages = res.data.totalPages;
                        }
                       
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            bindToDetaile(id){
                
                let data = null;
                for (let index = 0; index < this.hkTable.length; index++) {
                    const item = this.hkTable[index];
                    if(item.id == id) {data=item;break;}
                }
                //跳转详情页面
                this.$router.push({
                    name:'FinanceWithdrawRecordDetails',
                    params:{
                        data
                    }
                });
                
            },
            pageChange(n,pageSize){

                if(this.activeForm==1){
                    this.form.pageNum = n;
                    this.form.pageSize = pageSize;
                    this.loadingQuery(this.form)
                }else{
                    this.hkForm.pageNum = n;
                    this.hkForm.pageSize = pageSize;
                    this.loadingQuery(this.hkForm)
                }
               
            } ,
            //查询
            bindSubmitForm(){
                if(this.activeForm==1){
                    if(!this.form.currency) return this.$message.warning('请选择提现币种');

                    this.form.pageNum=1;
                    this.loadingQuery(this.form);
                    //1. 查询将之前选择的清空
                    this.exportKYC=[],
                    this.All=false;
                    this.AllPage=false;
                    //2. 查询当前条件可以选的所有记录数据
                    // this.bindQueryAllSettleNo({currency:this.form.currency});
                    this.bindQueryAllSettleNo(this.form);

                }else{
                    this.hkForm.pageNum=1;
                    this.loadingQuery(this.hkForm)
                }
            },
            formatT(n){
               return formatTimer(n);
            },
            bindToFormTab(index){

                this.activeForm = index;
                if(index==1){
                    this.loadingQuery(this.form);
                }else{
                    this.loadingQuery(this.hkForm);
                }
            },
            //当前页全选按钮
            bindHandleCheckAllChange(){
               
               if(this.All){//选择
                    for (let index = 0; index <  this.Allow.length; index++) {
                        let el = this.Allow[index];
                        if(this.exportKYC.indexOf(el)<0){ this.exportKYC.push(el) };
                    };

               }else{//取消选择

                    for (let index = 0; index <  this.Allow.length; index++) {
                        let el = this.Allow[index];

                        let dIndex = this.exportKYC.indexOf(el);
                        this.exportKYC.splice(dIndex,1);
                    };

               }

            },
            //所有页面的全选
            bindCheckAllPage(){
                if(this.AllPage){ 
                    this.exportAllData.map(item=>{
                        let id = item.id;
                        if(this.exportKYC.indexOf(id)<0){ this.exportKYC.push(id) };
                    });
                }else{ 
                    this.exportKYC=[]; 
                }
            },
            //删除所有的全选
            bindDeleteAll(){
                if(!this.exportKYC.length) return;
                this.$confirm('确定要删除以上所有打款记录吗?', '确认删除', {
                        confirmButtonText: '删除',
                        cancelButtonText: '取消'
                        }).then(()=>{
                             this.exportKYC=[];
                        }).catch(()=>{})
            },
            //创建结汇批次号
            bindCreatNo(){
                if(!this.form.currency) return this.$message.warning(`请选择提现币种`);
                if(!this.exportKYC.length) return this.$message.warning(`请选择列表选项`);
                createNewSettleBatchNo({
                    currency:this.exportCrrency,
                    idList:this.exportKYC,
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(res.msg);
                        this.bindSubmitForm();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //查询所有可以选择的记录
            bindQueryAllSettleNo(params){
                queryValidSettleWithdrawList(params).then(res=>{
                    if(res.code==0){
                        this.exportAllData = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            } ,
            //重新发起提现
            bindAgainWithdrawApply(withdrawNo){

                againWithdrawApply({
                    withdrawNo
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`发起成功`);
                        this.bindSubmitForm();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>

    @import './../../../css/element-variables.scss';

    .form-tab{
        padding-bottom: 20px;
        >a{
            display: inline-block;
            padding: 0 20px;
            height: 32px;
            line-height: 32px;
            color: #333;
            border-radius: 4px;
            border: 1px solid #fff;
            &.active{
                border-color:$--color-primary;
                color: $--color-primary;
            }
        }
    }

    .r-form-container{
        form{
            .el-button{
                padding-top: 0px;
                padding-bottom: 0px;
            }
        }
    }

    .bottom-handle-box{
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        background-color: #f0f9eb;
        border: 1px solid #c2e7b0;
        border-radius: 4px;
        >span{
            margin-left: 20px;
            color:  $--color-primary;
        }
        ul{
            li{
                float: left;
                margin-left: 30px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                color: #333;
                >span{
                    color: red;
                    font-weight: bold;
                }
                .el-button{
                    padding-top: 0px;
                    padding-bottom: 0px;
                }
            }
        }
    }
</style>

<style lang="scss">
.admin-form-inline{
    .finance-withdraw-item{
        .el-form-item__label{
            width:110px;
        }
    }
}

</style>



