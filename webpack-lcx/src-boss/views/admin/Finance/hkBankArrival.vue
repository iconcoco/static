<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">

              <el-form-item label="香港银行">
                    <el-select v-model="form.inBankCode" placeholder="请选择香港银行">
                        <el-option v-for="(item,index) in  CHNBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
              </el-form-item>

              <el-form-item label="海外银行">
                  <el-select v-model="form.outBankCode" placeholder="请选择海外银行">
                     <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                  </el-select>
              </el-form-item>

              <el-form-item label="币  种">
                  <el-select v-model="form.outCurrency" placeholder="请选择币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
              </el-form-item>

              <!-- <el-form-item class="hk_arrival_item" label="打款资金平台">
                   <el-select v-model="form.inChannelCode" placeholder="请选择资金平台">
                      <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
              </el-form-item> -->

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

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button @click="bindToShowModal" type="success">新增到账记录</el-button>

            </el-form>

            <ul class="hk-bank-account-details clearfix">
                <li class="one-li">{{hkBankData(hkBankCode)}}银行账户详情</li>
                <li v-for="(item,index) in bankAmountData" :key="index">
                    <template v-if="item.currency=='USD'">账户美元余额</template>
                    <template v-if="item.currency=='EUR'">账户欧元余额</template>
                    <template v-if="item.currency=='GBP'">账户英镑余额</template>
                    <template v-if="item.currency=='CNY'">账户人民币余额</template>
                    : <span>{{item.totalAmount}}</span>
                </li>
            </ul>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">香港银行到账详情</div>

            <el-table :data="table" border >
              <el-table-column prop="" width="50" label="序号">
                  <template slot-scope="scoped">
                      {{scoped.$index+1}}
                  </template>
              </el-table-column>
              <el-table-column prop="outBankCode" label="海外银行">
                  <template slot-scope="scoped">
                      {{outBankData(scoped.row.outBankCode)}}
                  </template>
              </el-table-column>
              <el-table-column prop="outTransNo" width="148" label="海外银行汇款批次号"></el-table-column>
              <el-table-column prop="outDate" width="148" label="海外银行出账时间">
                  <template slot-scope="scoped">
                     {{formatTimer(scoped.row.outDate)}}
                  </template>
              </el-table-column>
              <el-table-column prop="inDate" width="148" label="香港银行到账时间">
                  <template slot-scope="scoped">
                     {{formatTimer(scoped.row.inDate)}}
                  </template>
              </el-table-column>
              <el-table-column prop="outAmount" label="海外银行出账金额">
                    <template slot-scope="scoped">
                     {{((scoped.row.outAmount||0)/100).toFixed(2)}}
                  </template>
              </el-table-column>
              <el-table-column prop="inAmount" label="香港银行到账金额">
                  <template slot-scope="scoped">
                     {{((scoped.row.inAmount||0)/100).toFixed(2)}}
                  </template>
              </el-table-column>
              <el-table-column prop="ramark" label="交易备注"></el-table-column>
              <el-table-column prop="inCurrency" label="币种"></el-table-column>
            </el-table>

             <Pagination 
            :page="form.pageNumber"
            :pageSize="form.pageSize"
            :count="form.totalPages"
            :chosefallback="pageChange"
            ></Pagination>
        </div>

        <AdminModel
            title="新增到账记录"
            confirmTxt="确认"
            v-model="isShow" 
            :confirm="bindRateConfirm"
            class="hk-bank-arrival-model"
        >
            <el-form class="admin-form-inline" :model="modelForm" :inline="true">

                <el-form-item label="香港银行">
                    <el-select v-model="modelForm.inBankCode" placeholder="请选择香港银行">
                        <el-option v-for="(item,index) in  CHNBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="海外银行">
                    <el-select v-model="modelForm.outBankCode" placeholder="请选择海外银行">
                        <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="币  种">
                  <el-select v-model="modelForm.inCurrency" placeholder="请选择币种">
                      <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="到账金额">
                    <el-input v-model="modelForm.inAmount" placeholder="请输入到账金额"></el-input>
                </el-form-item>

                 <el-form-item label="到账时间" name="startDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd hh:mm:ss"
                        v-model="modelForm.inDate"
                        type="datetime"
                        placeholder="请选择到账时间">
                    </el-date-picker>
                </el-form-item>
                
                 <el-form-item label="到账备注">
                    <el-tooltip content="到账备注输入如：CBEC000000QDPAY+.3,080.24" placement="top-end">
                        <span v-show="modelForm.outBankCode=='IBC'" class="el-icon-question remark-tip"></span>
                    </el-tooltip>
                    <el-input v-model="modelForm.ramark" placeholder="请输入到账备注"></el-input>
                </el-form-item>
                

            </el-form> 
        </AdminModel>
    </div>
</template>

<script>

import {
        queryCurrency,
        queryPlatform,
        queryForeignBank,
        queryCHNBank,
    } from '../../../ext/localBase.js';

import { 
    queryHkBankInAccountFlow,
    queryHkBankAccountBanlace,
    saveHkBankAccountFlow,
    } from '../../../utils/axios/api.js';

import { dataReshow,formatTimer } from '../../../utils/common.js';

import AdminModel from '../../../components/adminModal.vue';
import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                outBankCode:'', //海外银行
                outCurrency:'', //币种
                inBankCode:'',  //香港银行
                startDate:null,   
                endDate:null,

                pageNumber:'1',
                pageSize:'10',
                totalPages:'1',
            },
            table:[],
            bankAmountData:[],
            hkBankCode:'',
            isShow:false,
            //新增记录的表格
            modelForm:{
                inBankCode:'',
                outBankCode:'',
                inCurrency:'',
                inAmount:'',
                inDate:'',
                ramark:'',
                transType:'2',
            },

            Currency:[],
            platArr:[],
            ForeigBank:[],
            CHNBank:[],
        }
    },
    components:{
        AdminModel
    },
    methods:{
        __LOADING(){
            Promise.all([
                queryCurrency(),
                queryPlatform(),
                queryForeignBank(),
                queryCHNBank(),
            ]).then(res=>{
                let [a,b,c,d] = res;
                this.Currency = a;
                this.platArr = b;
                this.ForeigBank = c;
                this.CHNBank = d;

                //香港银行需要默认的数据不能选择全部
                this.form.inBankCode = this.CHNBank[0].bankCode;
                this.loadingQuery(this.form);
            })
        },
        loadingQuery(params){
            //查询列表
            queryHkBankInAccountFlow(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages
                }else{
                    this.$message.error(res.msg);
                }
            });

            //查询银行账户详情
            queryHkBankAccountBanlace({outBankCode:params.inBankCode}).then(res=>{
                if(res.code==0){
                    this.bankAmountData = res.data;
                    this.hkBankCode = params.inBankCode;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        reset(){
            let n = ["inBankCode","pageNumber","pageSize","totalPages","startDate","endDate"];
            //选择的数据变成空字符
            for (const key in this.form) {
                if (n.indexOf(key)<0) {
                    this.form[key]="";
                }
            };
            //日期变成null
            this.form["startDate"] = null;
            this.form["endDate"] = null;

        },
        bindFormSubmit(){
            this.form.pageNumber = 1;
            this.loadingQuery(this.form);
        },
        pageChange(n,size){
            this.form.pageNumber=n;
            this.form.pageSize=size;
            this.loadingQuery(this.form);
        },
        bindToShowModal(){this.isShow = true},
        bindRateConfirm(){ 
            //1. 验证必填
            for (const key in this.modelForm) {
                if (!this.modelForm[key]) {
                    let msg ='';
                    key == 'inBankCode' && (msg = '请选择香港银行');
                    key == 'outBankCode' && (msg = '请选择海外银行');
                    key == 'inCurrency' && (msg = '请选择币种');
                    key == 'inAmount' && (msg = '请输入金额');
                    key == 'inDate' && (msg = '请输入到账时间');
                    key == 'ramark' && (msg = '请输入备注');

                    return this.$message.warning(msg);
                }
            };

            let data =  Object.assign({},this.modelForm);

            data.inAmount = (data.inAmount*100).toFixed(0);
            //2. 发送保存接口
            saveHkBankAccountFlow(data).then(res=>{
                if(res.code==0){
                    this.$message.success(res.msg);
                    this.form.pageNumber = 1;
                    this.loadingQuery(this.form);
                    //1. 清空所填数据
                    for (const k in this.modelForm) {
                        if (k!=='transType') {
                            this.modelForm[k] = '';
                        }
                    };
                    //2. 关闭弹窗
                    this.isShow = false;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        hkBankData(code){
            return dataReshow(this.CHNBank,"bankName","bankCode",code)
        },
        outBankData(code){
            return dataReshow(this.ForeigBank,"bankName","bankCode",code)
        },
        formatTimer(code){
            return formatTimer(code);
        }
    }
}
</script>

<style lang="scss" scoped>
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
.remark-tip{
    position: absolute;
    right: -21px;
    top: 12px;
}
</style>

<style lang="scss">
    .admin-form-inline{
        .hk_arrival_item{
            .el-form-item__label{
                width:100px;
            }
        }
    }

    .hk-bank-arrival-model{
        .modal-container{
            margin-top: -230px;
        }
        form{
            text-align:center;
            padding-top:20px;
        }
    }
</style>
