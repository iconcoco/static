<template>
    <div class="fadeIn">
        <div class="table-container">
             <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">
                <el-form-item v-if="form.level==1" label="销售人员：">
                    <el-select v-model="form.source" placeholder="选择销售人员">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in sales" :key="index"
                            :label="item.userName"
                            :value="item.source"
                        ></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="查询年份：">
                    <el-date-picker
                        value-format="yyyy"
                        v-model="form.year"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="查询月份：">
                    <el-select v-model="form.month" placeholder="选择月">
                      <el-option value="01" label="1月"></el-option>
                      <el-option value="02" label="2月"></el-option>
                      <el-option value="03" label="3月"></el-option>
                      <el-option value="04" label="4月"></el-option>
                      <el-option value="05" label="5月"></el-option>
                      <el-option value="06" label="6月"></el-option>
                      <el-option value="07" label="7月"></el-option>
                      <el-option value="08" label="8月"></el-option>
                      <el-option value="09" label="9月"></el-option>
                      <el-option value="10" label="10月"></el-option>
                      <el-option value="11" label="11月"></el-option>
                      <el-option value="12" label="12月"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button @click="updateRate" type="success">修改系统汇率</el-button>
                <el-button v-if="form.level==1" @click="bindSetSalesBasic" type="warning">设置销售提成基数</el-button>
                
            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">销售提成列表</div>
            <el-table :data="table" border >
                <el-table-column prop="name" label="销售名称"></el-table-column>
                <el-table-column prop="USD" label="本月累计入账美元"></el-table-column>

                <el-table-column label="美元/人民币汇率">
                    <template slot-scope="scope">
                         {{rates.USD}}
                    </template>
                </el-table-column>

                <el-table-column prop="EUR" label="本月累计入账欧元"></el-table-column>

                <el-table-column label="欧元/人民币汇率">
                    <template slot-scope="scope">
                        {{rates.EUR}}
                    </template>
                </el-table-column>

                <el-table-column prop="JPY" label="本月累计入账日元"></el-table-column>

                <el-table-column label="日元/人民币汇率">
                    <template slot-scope="scope">
                         {{rates.JPY}}
                    </template>
                </el-table-column>

                <el-table-column prop="total" label="累计为人民币入账"></el-table-column>

                <el-table-column width="150" prop="deduct" label="本月提成人民币金额"></el-table-column>
            </el-table>

             <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.total"
                :chosefallback="pageChange"
            ></Pagination> 

        </div>

            <AdminModel
                title="系统汇率设置"
                confirmTxt="确认"
                v-model="isShow" 
                :confirm="bindRateConfirm"
                class="customer-details-adminModal"
            >
                <el-form :model="tableForm" :inline="true">

                    <el-form-item label="美元/人民币汇率：">
                        <el-input v-model="tableForm.USD" type="number" placeholder="请输入美元/人民币汇率"></el-input>
                    </el-form-item>

                    <el-form-item label="欧元/人民币汇率：">
                        <el-input v-model="tableForm.EUR" type="number" placeholder="请输入欧元/人民币汇率"></el-input>
                    </el-form-item>

                    <el-form-item label="英镑/人民币汇率：">
                        <el-input v-model="tableForm.GBP" type="number" placeholder="请输入英镑/人民币汇率"></el-input>
                    </el-form-item>

                    <el-form-item label="日元/人民币汇率：">
                        <el-input v-model="tableForm.JPY" type="number" placeholder="请输入日元/人民币汇率"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="澳元/人民币汇率：">
                        <el-input v-model="" type="number" placeholder="请输入澳元/人民币汇率"></el-input>
                    </el-form-item>

                    <el-form-item label="加拿大/人民币汇率：">
                        <el-input v-model="" type="number" placeholder="请输入加拿大/人民币汇率"></el-input>
                    </el-form-item> -->

                </el-form>

            </AdminModel>

            <AdminModel
                title="销售提成公式"
                confirmTxt="确认"
                v-model="showBasicModle" 
                :confirm="bindSetRate"
                class="customer-details-adminModal set-sales-rate-adminmodal"
            >
                <el-form :model="setRateForm" class="setRate" :inline="true">

                    <el-form-item label="销  售：">
                        <el-select v-model="setRateForm.source" placeholder="选择销售人员">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item,index) in sales" :key="index"
                                :label="item.userName"
                                :value="item.source"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生效起始时间：" name="startTime">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="setRateForm.startTime"
                            type="date"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="生效结束时间：" name="endTime">
                        <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="setRateForm.endTime"
                            type="date"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="Amazon北美站费率扣减基数：">
                        <el-input v-model="setRateForm.bmRateBase" placeholder="请输入费率扣减基数"></el-input>
                    </el-form-item>
                    <p>示例：提成 = 总交易量 * （实际费率 - <span class="no">0.2</span>）* 20%;</p>

                     <el-form-item label="Amazon欧洲站费率扣减基数：">
                        <el-input v-model="setRateForm.euRateBase" placeholder="请输入费率扣减基数"></el-input>
                    </el-form-item>

                     <el-form-item label="Amazon印度站费率扣减基数：">
                        <el-input v-model="setRateForm.ydRateBase" placeholder="请输入费率扣减基数"></el-input>
                    </el-form-item>

                     <el-form-item label="eBay费率扣减基数：">
                        <el-input v-model="setRateForm.ebayRateBase" placeholder="请输入费率扣减基数"></el-input>
                    </el-form-item>

                     <el-form-item label="Wish费率扣减基数：">
                        <el-input v-model="setRateForm.wishRateBase" placeholder="请输入费率扣减基数"></el-input>
                    </el-form-item>

                    <el-form-item label="提成基数：">
                        <el-input v-model="setRateForm.royaltyBase" placeholder="请输入提成基数"></el-input>
                    </el-form-item>
                    <p>示例：提成 = 总交易量 * （实际费率 - 0.2%）* <span class="no">20%</span>;</p>

                </el-form>
            </AdminModel>

       
    </div>
</template>

<script>
import { queryAllSalesData } from '../../../ext/localBase.js';
import { cookie,formatTimer } from '../../../utils/common.js';
import {
    querySalesCustomer,
    addExchangeConfig,
    queryFindSaleRoyalty,
    updateSaleRoyalty
} from '../../../utils/axios/api.js';

import AdminModel from '../../../components/adminModal.vue';

 import mixin from '../../../ext/mixin.js';


export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                level:'',
                source:'',
                year:'2018',
                month:'11',

                page:"1",
                size:"10",
                total:"1"
            },
            rates:{     //费率
                JPY: null,
                USD: null
            },
           
            table:[],   
            sales:[],       //销售人员名单
            isShow:false,
            showBasicModle:false,
            //修改汇率的表格
            rateForm:[
                 {
                    sourceCurrency:"USD",
                    targetCurrency:"CNY",
                    rate:"",
                },
                 {
                    sourceCurrency:"EUR",
                    targetCurrency:"CNY",
                    rate:"",
                },
                {
                    sourceCurrency:"JPY",
                    targetCurrency:"CNY",
                    rate:"",
                },
                {
                    sourceCurrency:"GBP",
                    targetCurrency:"CNY",
                    rate:"",
                },
            ],
            tableForm:{
                USD:"",
                EUR:"",
                JPY:"",
                GBP:"",
            },
            setRateForm:{
                source:'',
                endTime:'',
                startTime:'',
                bmRateBase:'',
                euRateBase:'',
                ydRateBase:'',
                ebayRateBase:'',
                wishRateBase:'',
                royaltyBase:'',
            },
            name:null
        }
    },
    components:{
        AdminModel
    },
    watch: {
        "setRateForm.source"(code){

            if(!code){
                 for (const key in this.setRateForm) {
                    key != 'source' && (this.setRateForm[key] = "");
                 }

                return;
            }

           queryFindSaleRoyalty({source:code}).then(res=>{
               if(res.code==0){

                   if(!res.data) return;

                   for (const key in this.setRateForm) {
                       if( key != 'source'){
                           if(["startTime","endTime"].indexOf(key) > -1){
                               this.setRateForm[key] = this.famat(res.data[key])
                           }else{
                               this.setRateForm[key] = String(res.data[key])
                           }
                       }
                   };
                   
               }else{
                   this.$message.error(res.msg);
               }
           });
        }
    },
    created(){
        //是否可以查看全部销售人员
        this.$route.name == 'AllsalesCommission' ? (this.form.level = "1") : (this.form.level = "")
        this.name = this.$route.name;

    },
    methods:{
        __LOADING(){
            this.reset(),
            this.loadingQuery(this.form),
            queryAllSalesData().then(res=>{ this.sales = res; });
        },
        loadingQuery(parmas){
            querySalesCustomer(parmas).then(res=>{
                
                 if(res.code==0){
                    this.table = res.data.sales;    //
                    this.rates = res.data.rates;    //本月费率

                    this.form.total = res.page.total
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
         bindToSubmit(){
            this.form.page = 1;
            this.loadingQuery(this.form);
        },
        reset(){
            let D = new Date();
            this.form.source = '';
            this.form.year =  D.getFullYear().toString();
            this.form.month =  (D.getMonth()+1) >9 ? (D.getMonth()+1).toString() : `0${D.getMonth()+1}`;

            //销售人员的默认选择
            let adminInfo = JSON.parse(cookie.get('adminUserInfo'));

            this.name == "AllsalesCommission"? 
            (this.form.source = "") :
            (this.form.source = adminInfo.source||'');
        },
        bindSetSalesBasic(){
            this.showBasicModle = true;
        },
        bindSetRate(){
            for (const key in this.setRateForm) {
                if(!this.setRateForm[key]){
                    let msg = '';
                    switch(key){
                        case 'source':{ msg='请选择销售人员' }break;
                        case 'endTime':{ msg='请选择结束时间' }break;
                        case 'startTime':{ msg='请选择开始时间' }break;
                        case 'bmRateBase':{ msg='请设置Amazon北美站费率扣减基数' }break;
                        case 'euRateBase':{ msg='请设置Amazon欧洲站费率扣减基数' }break;
                        case 'ydRateBase':{ msg='请设置Amazon印度站费率扣减基数' }break;
                        case 'ebayRateBase':{ msg='eBay费率扣减基数' }break;
                        case 'wishRateBase':{ msg='Wish费率扣减基数' }break;
                        case 'royaltyBase':{ msg='提成基数' }break;
                    };
                    return this.$message.warning(msg);
                }
            };

            updateSaleRoyalty(this.setRateForm).then(res=>{
                if(res.code==0){
                    this.$message.success(`设置成功！`);
                    this.showBasicModle = false;
                    //清空填入的数据
                    for (const key in this.setRateForm) {
                        this.setRateForm[key] = "";
                    };

                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //修改系统汇率弹窗
        updateRate(){
            this.isShow = true;
        },
        //确认修改汇率
        bindRateConfirm(){

            for (const key in this.tableForm) {
                if(!this.tableForm[key]) return this.$message.warning(`请输入汇率!`);
            };

            this.rateForm.map(item=>{ item.rate = this.tableForm[item.sourceCurrency] });
            // return log;

            addExchangeConfig(this.rateForm).then(res=>{
                if(res.code==0){
                    this.$message.success('修改成功！');
                    this.isShow = false;
                    this.loadingQuery(this.form);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        famat(time){
            return formatTimer(time);
        },
        //页码改变
         pageChange(n,pageSize){
             this.form.page = n;
             this.form.size = pageSize;
             this.loadingQuery(this.form);
         }
    },
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 0px;
}
</style>

<style lang="scss">
.set-sales-rate-adminmodal{
    .modal-container{
        width:430px;
        margin-left: -215px;
        margin-top: -255px;
    }
    .setRate .el-form-item__label{
        width:210px;
    }
}
</style>



