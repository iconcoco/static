<template>
 <transition name="fade">
    <div>
         <div class="table-container form-tab">
            选择海外银行：
            <a v-for="(item,index) in ForeigBank" @click="bindToFormTab(index)" :class="{active:activeBank==index}" v-if="index!=0" :key="index" href="javascript:;">{{item.bankName}}</a>
        </div>

        <div class="table-container">
            <!-- 查询条件筛选 -->
            <!-- 1. IBC -->
            <el-form v-show="activeBank==1" class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="客户编号" name="customerNo">
                    <el-input name="customerNo" v-model="form.customerNo" placeholder="请输入客户编号"></el-input>
                </el-form-item>

                <el-form-item label="店铺编号" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺编号"></el-input>
                </el-form-item>

                <el-form-item label="子账号" name="subAccountNo">
                    <el-input name="subAccountNo" v-model="form.subAccountNo" placeholder="请输入子账号"></el-input>
                </el-form-item>

                <el-form-item label="开始时间" name="startDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startDate"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endDate"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="出账批次" name="ibocTxnRefNo">
                    <el-input name="ibocTxnRefNo" v-model="form.ibocTxnRefNo" placeholder="请输入出账批次"></el-input>
                </el-form-item>

                <el-form-item label="平台列表" name="platformCode">
                    <el-select v-model="form.platformCode" placeholder="请选择平台">
                       <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道列表" name="channelCode">
                    <el-select v-model="form.channelCode" placeholder="请选择渠道">
                      <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
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

                
              <el-form-item label="海外银行">
                  <el-select v-model="form.bankCode" placeholder="请选择银行">
                     <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                  </el-select>
              </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
               
            </el-form>

            <!-- 2.SolarisBank -->
            <div v-show="activeBank==2" >
                <ul class="admin-tab clearfix">
                    <li :class="{active:activeSolarisTab==1}" @click="bindChangeSolarisBankTab(1)">SolarisBank入账详情</li>
                    <li :class="{active:activeSolarisTab==2}" @click="bindChangeSolarisBankTab(2)">SolarisBank打款详情</li>
                </ul>
                <el-form v-show="activeSolarisTab==1" class="admin-form-inline" :inline="true" :model="SolarisForm">

                    <el-form-item v-if="activeSolarisTab==2" label="香港银行">
                        <el-select v-model="SolarisForm.outBankCode" placeholder="请选择香港银行">
                            <el-option v-for="(item,index) in  CHNBank" :key="index"
                                :label="item.bankName"
                                :value="item.bankCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="币  种">
                    <el-select v-model="SolarisForm.outCurrency" placeholder="请选择币种">
                        <el-option v-for="(item,index) in  Currency" :key="index"
                                :label="item.currencyName"
                                :value="item.currencyCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="汇款状态">
                        <el-select v-model="SolarisForm.outStatus" placeholder="请选择汇款状态">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="未转款" value="1"></el-option>
                            <el-option label="转款中" value="2"></el-option>
                            <el-option label="转款成功" value="3"></el-option>
                            <el-option label="转款失败" value="4"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="起始时间" name="startDate">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="SolarisForm.startDate"
                            type="date"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间" name="endDate">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="SolarisForm.endDate"
                            type="date"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-button @click="bindSolarisBankOneSubmit" type="primary" plain>查询</el-button>
                    <el-button @click="reset" type="primary">重置</el-button>
                    <!-- <el-button type="success">批量转款</el-button> -->
                </el-form>

                <el-form v-show="activeSolarisTab==2" class="admin-form-inline" :inline="true" :model="SolarisFormTwo">

                    <el-form-item label="香港银行">
                        <el-select v-model="SolarisFormTwo.inChannelCode" placeholder="请选择香港银行">
                            <el-option v-for="(item,index) in  CHNBank" :key="index"
                                :label="item.bankName"
                                :value="item.bankCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="币  种">
                    <el-select v-model="SolarisFormTwo.outCurrency" placeholder="请选择币种">
                        <el-option v-for="(item,index) in  Currency" :key="index"
                                :label="item.currencyName"
                                :value="item.currencyCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="汇款状态">
                        <el-select v-model="SolarisFormTwo.outStatus" placeholder="请选择汇款状态">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="未转款" value="1"></el-option>
                            <el-option label="转款中" value="2"></el-option>
                            <el-option label="转款成功" value="3"></el-option>
                            <el-option label="转款失败" value="4"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="起始时间" name="startDate">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="SolarisFormTwo.startDate"
                            type="date"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间" name="endDate">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="SolarisFormTwo.endDate"
                            type="date"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-button @click="bindSolarisBankTwoSubmit" type="primary" plain>查询</el-button>
                    <el-button @click="reset" type="primary">重置</el-button>
                    <!-- <el-button type="success">批量转款</el-button> -->
                </el-form>

                <ul class="hk-bank-account-details clearfix">
                    <li class="one-li">SolarisBank银行账户详情</li>
                    <li v-for="(item,index) in bankAmountData" :key="index">
                        <template v-if="item.currency=='CNY'">账户人民币余额</template>
                        <template v-if="item.currency=='USD'">账户美元余额</template>
                        <template v-if="item.currency=='EUR'">账户欧元余额</template>
                        <template v-if="item.currency=='GBP'">账户英镑余额</template>
                        : <span>{{formatM(item.amount)}}</span>
                    </li>
                </ul>
                
            </div>
        </div>

        <div class="table-container" v-if="activeBank==1">
             <div class="admin-tab-title">海外银行出账列表</div>

            <el-upload
              :show-file-list='false'
              name='file'   
              :action="fileActive"
              :on-success="bindUploadSuccess"
              :on-error="bindUploadError">
                 <el-button type="danger" >上传清分文件</el-button>
             </el-upload>

            <!-- 查询结果 -->
            <el-table :data="table" border >
                <el-table-column prop="customerNo" label="客户编号"></el-table-column>
                <el-table-column prop="storeId" label="店铺编号"></el-table-column>
                <el-table-column prop="subAccountNo" label="子账号"></el-table-column>
                <el-table-column prop="bankCode" label="银行编码"></el-table-column>
                <el-table-column prop="channelCode" label="渠道编码"></el-table-column>
                <el-table-column prop="createTime"  label="海外银行出账日期"></el-table-column>
                <el-table-column prop="currency" label="币种"></el-table-column>
                <el-table-column prop="amount"  label="海外银行净出账金额"></el-table-column>
                <el-table-column prop="ibocTxnRefNo" label="批次号"></el-table-column>
                <el-table-column prop="createTime" label="上传时间" width="160"></el-table-column>
                <!-- <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="platformCode" label="平台编码"></el-table-column>
                <el-table-column prop="amount" label="金额"></el-table-column> -->
            </el-table>

              <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>

        <div class="table-container KYC-index" v-if="activeBank==2">
            <div class="admin-tab-title" v-if="activeSolarisTab==1">SolarisBank打款详情</div>
            <div class="admin-tab-title" v-else>SolarisBank出账详情</div>
            <!-- SolarisBank入账详情 -->
            <div class="select-table-container" v-if="activeSolarisTab==1">
                 <p class="all" style="height:48px;line-height:48px;">
                    <el-checkbox 
                    v-model="All" 
                    :disabled="!Allow.length"
                    @change="bindHandleCheckAllChange"></el-checkbox>
                </p>
                <el-table :data="SolarisTable" border >

                    <el-table-column  fixed width="56" :resizable="false">
                        <template slot-scope="scope">
                            <el-checkbox 
                            :disabled="!((scope.row.status==1 || scope.row.status==4))"
                            :label="scope.row.bookingId" 
                            v-model="exportKYC">
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="recipientIban" label="子账号"></el-table-column>
                    <el-table-column prop="bookingId" label="Booking ID"></el-table-column>
                    <el-table-column prop="bookingDate" label="SolarisBank到账时间">
                        <template slot-scope="scope">
                            {{formatT(scope.row.bookingDate)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountValue" label="Amazon打款金额">
                        <template slot-scope="scope">
                            {{formatM(scope.row.amountValue)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountValue" label="SolarisBank到账金额">
                         <template slot-scope="scope">
                            {{formatM(scope.row.amountValue)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountCurrency" label="币种"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span  v-if="scope.row.status==1">未转款</span>
                            <span class="ing" v-if="scope.row.status==2">转款中</span>
                            <span class="ok" v-if="scope.row.status==3">转款成功</span>
                            <span class="no" v-if="scope.row.status==4">转款失败</span>
                        </template>
                    </el-table-column>

                </el-table>

                 <Pagination 
                    :page="SolarisForm.pageNumber"
                    :pageSize="SolarisForm.pageSize"
                    :count="SolarisForm.totalPages"
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
                        <li>结款金额：<span>{{formatM(exportAmount)}}</span></li>
                        <li>币种：<span>{{exportCrrency}}</span></li>
                        <li>
                            <el-button @click="bindTransForm" type="primary">批量转款</el-button>
                        </li>
                    </ul>
                </div>


            </div>
            <!-- SolarisBank打款详情 activeSolarisTable-->
            <div v-if="activeSolarisTab==2">
                <el-table :data="SolarisTableTwo" border>
                    <el-table-column width="60" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="channelCode" label="渠道编码"></el-table-column>
                    <el-table-column prop="payoutId" label="PayoutID"></el-table-column>
                    <el-table-column width="148" prop="outDate" label="SolarisBank出账时间">
                        <template slot-scope="scope">
                            {{formatT(scope.row.createdAt)}}
                        </template>
                    </el-table-column>
                    <el-table-column width="148" prop="inDate" label="香港银行到账时间">
                         <template slot-scope="scope">
                            {{formatT(scope.row.recipientDate)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="SolarisBank打款金额">
                        <template slot-scope="scope">
                            {{formatM(scope.row.amount)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="recipientAmount" label="香港银行到账金额">
                        <template slot-scope="scope">
                            {{formatM(scope.row.recipientAmount)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="交易备注"></el-table-column>
                    <el-table-column prop="currency" label="币种"></el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                        <!-- <template slot-scope="scope">
                            <span  v-if="scope.row.outStatus==1">未转款</span>
                            <span class="ing" v-if="scope.row.outStatus==2">转款中</span>
                            <span class="ok" v-if="scope.row.outStatus==3">转款成功</span>
                            <span class="no" v-if="scope.row.outStatus==4">转款失败</span>
                        </template> -->
                    
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <a class="primary" @click="bindToJumpDetalis(scope.row.id)" href="javascript:;">查看详情</a>
                        </template>
                    </el-table-column>
                </el-table>

                 <Pagination 
                    :page="SolarisFormTwo.pageNumber"
                    :pageSize="SolarisFormTwo.pageSize"
                    :count="SolarisFormTwo.totalPages"
                    :chosefallback="pageChange"
                ></Pagination>
            </div>
        </div>

        <AdminModel
            title="请选择转款渠道"
            confirmTxt="确认转款"
            v-model="exportModel"
            :confirm="bindChannelConfirm"
            class="IBC-bill-admin-model"
        >  
            <ul class="channel-select-container">
                <li>
                    <label>请选择渠道：</label>
                    <el-select v-model="exportChannel" placeholder="请选择渠道">
                        <el-option v-for="(item,index) in exportChannelDate" :key="index"
                            :label="item.recipientBankName" 
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </li>
                <li><label>转款金额：</label> {{exportAmount}}</li>
                <li><label>币种：</label> {{exportCrrency}}</li>
            </ul>
        </AdminModel>
    </div>
 </transition>
</template>

<script>
    // 结汇列表
    
    import {
        querySolarisBankBalance,
        solarisBankPayout,
        querySolarisBillList,
        queryValidSolarisBooking,
        querySolarisBooking,
        queryIbcBillList,
        querySolarisMappings,
    uploadFinancialAmount} from '../../../utils/axios/api.js'
    import { getTimer,formatTimer } from '../../../utils/common.js';
    import {
        queryPlatform,
        queryChannel,
        queryCurrency,
        queryForeignBank,
        queryCHNBank
    } from '../../../ext/localBase.js';

    import AdminModel from './../../../components/adminModal.vue';

    import mixin from '../../../ext/mixin.js';

    let ING = false;
    
    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    customerNo:'',
                    storeId:'',
                    subAccountNo:'',
                    ibocTxnRefNo:'',
                    startDate:'',
                    endDate:'',
                    platformCode:'',
                    channelCode:'',
                    currency:'',

                    bankCode:'',
                    page:'1',
                    totalPages:'1',
                    size:'10',
                },
                SolarisForm:{
                    outCurrency:'EUR',
                    outStatus:'',
                    sartDate:'',
                    endDate:'',

                    pageNumber:'1',
                    pageSize:'10',
                     totalPages:'1',
                },
                SolarisFormTwo:{
                    inChannelCode:'',
                    outCurrency:'GBP',
                    outStatus:'',
                    startDate:'',
                    endDate:'',

                    pageNumber:'1',
                    pageSize:'10',
                    totalPages:'1',
                },
                table:[],
                SolarisTable:[],
                SolarisTableTwo:[],

                fileActive:uploadFinancialAmount,

                platArr:[],
                ChannelArr:[],
                Currency:[],
                ForeigBank:[],
                CHNBank:[],


                Allow:[],//当前页可以选择的所有记录的ID bookingId
                All:false,//当前页面的全选
                AllPage:false,//所有页面的全选
                exportKYC:[],//所有已经选择ID bookingId
                exportAllData:[],//所有可以选择的记录的数据
                exportAmount:0,//转款金额
                exportCrrency:'',//转款币种
                exportChannel:'',//转款渠道

                exportChannelDate:[],
                exportModel:false,  //转款确认的modal

                bankAmountData:[{currency:"CNY",totalAmount:200}],

                activeBank:1,
                activeSolarisTab:1,
                
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
                    let bookingId = item.bookingId;
                    if(n.indexOf(bookingId)>-1){
                        let am = item.amountValue;
                        num += am;
                    }
                });
                this.exportAmount = num;
          },
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form),
                Promise.all([
                    queryPlatform(),
                    queryChannel(),
                    queryCurrency(),
                    queryForeignBank(),
                    queryCHNBank(),
                ]).then(res=>{
                    let [a,b,c,d,e] = res;
                    this.platArr = a;
                    this.ChannelArr = b;
                    this.Currency = c;
                    this.ForeigBank = d;
                    this.CHNBank = e;
                });
            },
            reset(){
               
                 switch(Number(this.activeBank)){
                     case 1:
                     {
                          let n = ['page','size','totalPages']; 
                            for (const key in this.form) {
                                if(n.indexOf(key)<0){
                                    this.form[key] = "";
                                }
                            }
                     }
                     break;
                     case 2:
                     {
                          let n = ['pageNumber','pageSize','totalPages'];
                          if(this.activeSolarisTab==1){

                                for (const key in this.SolarisForm) {
                                    if(n.indexOf(key)<0){
                                        this.SolarisForm[key] = "";
                                    }
                                }

                          }else{

                              for (const key in this.SolarisFormTwo) {
                                    if(n.indexOf(key)<0){
                                        this.SolarisFormTwo[key] = "";
                                    }
                                }

                          }
                     }
                     break;
                 }
            },
            loadingQuery(params){

                if(getTimer(params.startDate)>getTimer(params.endDate))return this.$message.error(`开始时间应该小于结束时间！`);

                queryIbcBillList(params).then(res=>{
                    this.table = res.content;
                    this.form.totalPages = res.totalPages
                });
            },
            //solaribank-form-one 
            loadingSolariBankTabOne(params){
                querySolarisBooking(params).then(res=>{
                    if(res.code==0){
                        this.SolarisTable = res.data.content;
                        this.SolarisForm.totalPages = res.data.totalPages;

                        //转款的币种显示
                        this.exportCrrency = params.outCurrency;
                        //当前页面所有可以选择集合
                        this.Allow = [];
                        //当前页面是否全选
                        let f = true;
                        this.SolarisTable.map(item=>{
                            //查找可以选择的id
                            if(item.status==1||item.status==4){
                                this.Allow.indexOf(item.bookingId)<0 && this.Allow.push(item.bookingId);
                                if(this.exportKYC.indexOf(item.bookingId)<0){ f = false};
                            }
                        });

                        this.All = f;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //solaribank-form-two
            loadingSolariBankTabTwo(params){
                querySolarisBillList(params).then(res=>{
                    if(res.code==0){
                        this.SolarisTableTwo = res.data.content;
                        this.SolarisFormTwo.totalPages = res.data.totalPages;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //solaribank 的账户余额
            loadingBankBalance(){
                querySolarisBankBalance().then(res=>{
                    if(res.code==0){
                        this.bankAmountData = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //solaribank-form-one  所有可以选择的记录
            queryAllSolari(params){
                queryValidSolarisBooking(params).then(res=>{
                    if(res.code==0){
                        this.exportAllData = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //solarisbank form submit
            bindSolarisBankOneSubmit(){
                if(!this.SolarisForm.outCurrency) return this.$message.warning('请选择币种');
                this.loadingBankBalance(); //查询solaribank的账户详情
                this.SolarisForm.pageNumber = '1';
                this.loadingSolariBankTabOne(this.SolarisForm)  ;
                //1. 查询将之前选择的清空
                this.exportKYC=[],
                this.All=false;
                this.AllPage=false;
                //2. 查询当前条件可以选的所有记录数据
                this.queryAllSolari({outCurrency:this.SolarisForm.outCurrency})
            },
            //solarisbank form two submit
            bindSolarisBankTwoSubmit(){
                if(!this.SolarisFormTwo.outCurrency) return this.$message.warning('请选择币种');
                this.SolarisFormTwo.pageNumber = 1;
                this.loadingSolariBankTabTwo(this.SolarisFormTwo);
            },
            bindFormSubmit(){
                this.form.page = 1;
               this.loadingQuery(this.form);
            },
            //页码选择的时候
           pageChange(n,size){
               switch(Number(this.activeBank)){
                   case 1:{
                        this.form.page = n;
                        this.form.size = size;
                        this.loadingQuery(this.form);
                   }
                   break;
                   case 2:{
                       if(this.activeSolarisTab==1){
                           this.SolarisForm.pageNumber = n;
                           this.SolarisForm.pageSize = size;
                           this.loadingSolariBankTabOne(this.SolarisForm);
                       }else{
                           this.SolarisFormTwo.pageNumber = n;
                           this.SolarisFormTwo.pageSize = size;
                           this.loadingSolariBankTabTwo(this.SolarisFormTwo);
                       }
                   }
                   break;
               }
             
           },
           //上传文件成功的时候
           bindUploadSuccess(res,file){
               if(res.code==0){
                   this.$message.success(`上传成功！`);
               }else{
                   this.$message.error(res.msg);
               }
           },
           //上传文件失败
           bindUploadError(){
               this.$message.error(`上传失败，请重新上传！`);
           },
           //solarisBank的tab选择
           bindChangeSolarisBankTab(index){
               this.activeSolarisTab = index;
           },
           //activeBank
           bindToFormTab(index){
                this.activeBank = index;
                if(index==2){
                    this.activeSolarisTab==1 && this.bindSolarisBankOneSubmit(this.SolarisForm);
                    this.activeSolarisTab==2 && this.loadingSolariBankTabTwo(this.SolarisFormTwo);
                }
           },
           //当前页面全选的状态变化
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
           //所有页面的全选状态变化
           bindCheckAllPage(){
               if(this.AllPage){ 
                    this.exportAllData.map(item=>{
                        let bookingId = item.bookingId;
                        if(this.exportKYC.indexOf(bookingId)<0){ this.exportKYC.push(bookingId) };
                    });
                }else{ 
                    this.exportKYC=[]; 
                }
           },
           //批量转款
           bindTransForm(){
                if(!this.exportKYC.length) return this.$message.warning(`请至少选中一项转款记录进行操作！`);
                if(ING) return this.$message.warning(`请勿频繁操作`);
                ING = true;
                querySolarisMappings({ currency:this.exportCrrency }).then(res=>{
                    ING = false;
                    if(res.code==0){
                        this.exportModel = true;
                        this.exportChannelDate = res.data;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
                
           },
            //导出选择渠道确认的事件
           bindChannelConfirm(){
                if(!this.exportChannel) return this.$message.warning(`请选择转款渠道!`);

                if(ING) return this.$message.warning(`请勿频繁操作`);
                ING = true;

                let submitForm = {
                    outCurrency:this.exportCrrency,
                    idList:this.exportKYC,
                    outAmount:this.exportAmount
                };

                //1. 循环添加渠道数据
                this.exportChannelDate.forEach(item=>{
                    if(item.id == this.exportChannel){
                        submitForm['accountId'] = item['accountId'];
                        submitForm['recipientAccountNumber'] = item['recipientAccountNumber'];
                    }
                });

                //2. 请求批量转款
                solarisBankPayout(submitForm).then(res=>{
                    ING = false;
                    if(res.code==0){
                        this.exportModel = false;
                        this.$message.success(res.msg);
                        this.bindSolarisBankOneSubmit(this.SolarisForm);
                    }else{
                        this.$message.error(res.msg);
                    }
                });
           },
           bindDeleteAll(){
               if(!this.exportKYC.length) return;
               this.$confirm('确定要删除以上所有打款记录吗?', '确认删除', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                     this.exportKYC=[];
                }).catch(()=>{})
           },

           bindToJumpDetalis(id){
               this.SolarisTableTwo.map(item=>{
                   if(item.id == id){
                        this.$router.push({
                            name:'IbcBillDetails',
                            params:{
                                createTime:item.createTime,
                                outCurrency:item.currency,
                                outAmount:item.amount,
                                payoutId:item.payoutId,
                                transNo:item.transNo,
                            }
                        })
                   };
               });
              
           },

            formatT(n){
               return formatTimer(n);
            },

            formatM(num=0){
                return (num/100).toFixed(2);
            }

            // hkBankData(code){
            //     return dataReshow(this.CHNBank,"bankName","bankCode",code)
            // },
        },
        components:{
            AdminModel
        }
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

     .el-button{
        padding-top: 0px !important;
        padding-bottom: 0px !important; 
    }

    .hk-bank-account-details{
        border: 1px solid #c2e7b0;
        background-color: #f0f9eb;
        border-radius: 4px;
        padding: 7px 20px;
        margin-top: 40px;
        position: relative;
        min-height: 30px;
        .one-li{
            position: absolute;
            top: -100%;
            font-size: 18px;
        }
        li{
            float: left;
            margin-right: 40px;
            span{
                color: red;
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

    .admin-tab{
        border: none;
        margin-bottom: 20px;
        margin-top: -20px;
        li{
            border: none;
            border-bottom : 2px solid transparent;
            &.active{
                border-bottom-color: $--color-primary;
            }
        }
    }

    .channel-select-container{
        // padding: 20px 0;
        // text-align: center;
        li{
            padding: 15px;
            label{
                display: inline-block;
                width:120px;
                text-align: right;
            }
        }
    }
</style>

<style lang="scss">
    // .IBC-bill-admin-model{

    // }
</style>




