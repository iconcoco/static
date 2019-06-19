<template >
    <div class="fadeIn">
        <div class="table-container">
            <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">

              <el-form-item label="查询报表:">
                  <el-select v-model="form.type" placeholder="请选择查询报表">
                    <el-option value="0" label="全部"></el-option>
                    <el-option value="1" label="销售员每月有效客户对比"></el-option>
                    <el-option value="2" label="销售员每季度有效客户对比"></el-option>
                    <el-option value="3" label="单个销售员每月有效客户对比"></el-option>
                    <el-option value="4" label="销售员每月流失客户对比"></el-option>
                    <el-option value="5" label="销售员每季度流失客户对比"></el-option>
                    <el-option value="6" label="单个销售员每月流失客户对比"></el-option>
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

                 <el-button @click="loadingQuery" type="primary" plain>查询</el-button>
                <!-- <el-button @click="reset" type="primary">重置</el-button> -->

            </el-form>
        </div>

        <!-- 销售员每月有效客户对比 -->
         <div v-show="chartCode==0 || chartCode==1" class="table-container">
            <div class="admin-tab-title">销售员每月有效客户对比
                <el-select v-model="validForm.month" placeholder="选择月">
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
            </div>
            <div class="map">
                <Bars TID="ValidCustomer" :data="ValidCustomer"></Bars>
            </div>
        </div>
        <!-- 销售员每季度有效客户对比 -->
         <div v-show="chartCode==0 || chartCode==2" class="table-container">
            <div class="admin-tab-title">销售员每季度有效客户对比
               <el-select v-model="validForm.quarter" placeholder="选择季度">
                    <el-option value="1" label="第一季度"></el-option>
                    <el-option value="2" label="第二季度"></el-option>
                    <el-option value="3" label="第三季度"></el-option>
                    <el-option value="4" label="第四季度"></el-option>
                </el-select>
            </div>
            <div class="map">
                <Bars TID="ValidCustomerByQuarter" :data="ValidCustomerByQuarter"></Bars>
            </div>
        </div>

        <!-- 单个销售员每月有效客户对比 -->
         <div v-show="chartCode==0 || chartCode==3" class="table-container">
            <div class="admin-tab-title">单个销售员每月有效客户对比
                <el-select v-model="validForm.source" placeholder="请选择销售员">
                  <el-option v-for="(item,index) in sales" :key="index"
                    :label="item.userName"
                    :value="item.source"
                  ></el-option>
                </el-select>
            </div>
            <div class="map">
                <Bars TID="ValidCustomerByYear" :data="ValidCustomerByYear"></Bars>
            </div>
        </div>

        <!-- 销售员每月流失客户对比 -->
         <div v-show="chartCode==0 || chartCode==4" class="table-container">
            <div class="admin-tab-title">销售员每月流失客户对比
                 <el-select v-model="loseForm.month" placeholder="选择月">
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
            </div>
            <div class="map">
                <Bars TID="LoseCustomer" :data="LoseCustomer"></Bars>
            </div>
        </div>

        <!-- 销售员每季度流失客户对比 -->
         <div v-show="chartCode==0 || chartCode==5" class="table-container">
            <div class="admin-tab-title">销售员每季度流失客户对比
                 <el-select v-model="loseForm.quarter" placeholder="选择季度">
                    <el-option value="1" label="第一季度"></el-option>
                    <el-option value="2" label="第二季度"></el-option>
                    <el-option value="3" label="第三季度"></el-option>
                    <el-option value="4" label="第四季度"></el-option>
                </el-select>
            </div>
            <div class="map">
                <Bars TID="LoseCustomerByQuarter" :data="LoseCustomerByQuarter"></Bars>
            </div>
        </div>

        <!-- 单个销售员每月流失客户对比 -->
         <div v-show="chartCode==0 || chartCode==6" class="table-container">
            <div class="admin-tab-title">单个销售员每月流失客户对比
                 <el-select v-model="loseForm.source" placeholder="请选择销售员">
                  <el-option v-for="(item,index) in sales" :key="index"
                    :label="item.userName"
                    :value="item.source"
                  ></el-option>
                </el-select>
            </div>
            <div class="map">
                <Bars TID="LoseCustomerByYear" :data="LoseCustomerByYear"></Bars>
            </div>
        </div>

    </div>
</template>

<script>
  import {
   queryAllSalesData
} from '../../../ext/localBase.js';

import Bars from './../DashBoard/Bars.vue';

  import { cookie } from '../../../utils/common.js';

import { 
    queryValidCustomer,              //月有效客户
    queryValidCustomerByYear,        //年有效客户
    queryValidCustomerByQuarter,     //季度有效客户
    queryLoseCustomer,              //月流失客户
    queryLoseCustomerByYear,        //年流失客户
    queryLoseCustomerByQuarter,     //季度流失客户
} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';


export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                type:'',
                year:'',
            },
            validForm:{
                month:'',
                source:'',
                quarter:'',
            },
            loseForm:{
                month:'',
                source:'',
                quarter:'',
            },
            sales:[],
            chartCode:'0',

            ValidCustomer:{},
            ValidCustomerByYear:{},
            ValidCustomerByQuarter:{},
            LoseCustomer:{},
            LoseCustomerByYear:{},
            LoseCustomerByQuarter:{},
        }
    },
    components:{
        Bars
    },
    watch:{
        'this.validForm.month'(){ this.queryValidCustomer() },
        'this.loseForm.month'(){ this.queryLoseCustomer() },

        'this.validForm.source'(){ this.queryValidCustomerByYear() },
        'this.loseForm.source'(){ this.queryLoseCustomerByYear() },

        'this.validForm.quarter'(){ this.queryValidCustomerByQuarter() },
        'this.loseForm.quarter'(){ this.queryLoseCustomerByQuarter() },
    },
    methods:{
        __LOADING(){
             queryAllSalesData().then(res=>{ this.sales = res; }),
            this.reset();
            // this.loadingQuery() //watch 中由于reset方法出发已做请求
        },
        reset(){

            let D = new Date();

            let y = D.getFullYear(),
                m = D.getMonth()+1,
                d = D.getDate(),
                YY = y,
                MM = m < 10 ? '0'+m : m,
                DD = d < 10 ? '0'+d : d;
            //1. 初始化年-类型
            this.form.year =  YY.toString();
            this.form.type =  '0';
            //2. 初始化月份
            this.validForm.month =   MM.toString();;
            this.loseForm.month =   MM.toString();
            //3. 初始化季度
            let qua = {
                "1":[1,2,3],
                "2":[4,5,6],
                "3":[7,8,9],
                "4":[10,11,12],
            };

            for (const key in qua) {
                if(qua[key].indexOf(m)>-1){
                    this.validForm.quarter =   `${key}`;//季度
                    this.loseForm.quarter =   `${key}`;//季度
                }
            };
            //4. 销售人员的默认选择
            let adminInfo = JSON.parse(cookie.get('adminUserInfo'));
            this.validForm.source = adminInfo.source||'';            
            this.loseForm.source = adminInfo.source||'';            
        },
        loadingQuery(){

             this.chartCode = this.form.type;

            switch(Number(this.form.type)){
                case 0:
                {
                    this.queryValidCustomer();
                    this.queryValidCustomerByYear();
                    this.queryValidCustomerByQuarter();
                    this.queryLoseCustomer();
                    this.queryLoseCustomerByYear();
                    this.queryLoseCustomerByQuarter();
                }
                break;
                case 1:
                {   //月有效客户
                   this.queryValidCustomer();
                }
                break;
                case 2:
                {   //季度有效
                    this.queryValidCustomerByQuarter();
                }
                break;
                case 3:
                {   //年有效
                    this.queryValidCustomerByYear();
                }
                break;
                case 4:
                {   //月流失
                    this.queryLoseCustomer();
                }
                break;
                case 5:
                {   //季度流失
                    this.queryLoseCustomerByQuarter();
                }
                break;
                case 6:
                {   //年流失
                   this.queryLoseCustomerByYear();
                }
                break;
            };
        },
        queryValidCustomer(){//月有效客户
            let f = Object.assign(this.form,this.validForm);
            queryValidCustomer(f).then(res=>{
                if(res.code==0){
                    let ValidCustomer = {};
                    
                    res.data.map(item=>{
                        
                        if(!ValidCustomer.hasOwnProperty(item.name)){
                            ValidCustomer[item.name] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`月有效客户`);
                            k==`partCount` &&  (index=1 , key_CN=`月新增有效客户`);

                           index != null &&  (ValidCustomer[item.name][index][key_CN] = item[k])

                        }

                    });

                    this.ValidCustomer = ValidCustomer;

                }else{ this.$message.error(res.msg); };
            });
        },
        queryValidCustomerByYear(){//年有效客户
            let f = Object.assign(this.form,this.validForm);
            queryValidCustomerByYear(f).then(res=>{
                if(res.code==0){

                    let ValidCustomerByYear = {};
                    
                    res.data.map(item=>{
                        
                        if(!ValidCustomerByYear.hasOwnProperty(item.month)){
                            ValidCustomerByYear[`${this.form.year}-${item.month}`] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`有效客户`);
                            k==`partCount` &&  (index=1 , key_CN=`新增有效客户`);

                           index != null &&  (ValidCustomerByYear[`${this.form.year}-${item.month}`][index][key_CN] = item[k])

                        }

                    });

                    this.ValidCustomerByYear = ValidCustomerByYear;

                }else{ this.$message.error(res.msg); };
            });
        },
        queryValidCustomerByQuarter(){//季度有效客户
            let f = Object.assign(this.form,this.validForm);
            queryValidCustomerByQuarter(f).then(res=>{
                if(res.code==0){

                     let ValidCustomerByQuarter = {};
                    
                    res.data.map(item=>{
                        
                        if(!ValidCustomerByQuarter.hasOwnProperty(item.name)){
                            ValidCustomerByQuarter[item.name] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`季度有效客户`);
                            k==`partCount` &&  (index=1 , key_CN=`季度新增有效客户`);

                           index != null &&  (ValidCustomerByQuarter[item.name][index][key_CN] = item[k])

                        }

                    });

                    this.ValidCustomerByQuarter = ValidCustomerByQuarter;
                

                }else{ this.$message.error(res.msg); };
            });
        },
        queryLoseCustomer(){//月流失客户
            let f = Object.assign(this.form,this.loseForm);
            queryLoseCustomer(f).then(res=>{
                if(res.code==0){

                    let LoseCustomer = {};
                    
                    res.data.map(item=>{
                        
                        if(!LoseCustomer.hasOwnProperty(item.name)){
                            LoseCustomer[item.name] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`完全流失客户`);
                            k==`partCount` &&  (index=1 , key_CN=`部分流失客户`);

                           index != null &&  (LoseCustomer[item.name][index][key_CN] = item[k])

                        }

                    });

                    this.LoseCustomer = LoseCustomer;

                }else{ this.$message.error(res.msg); };
            });
        },
        queryLoseCustomerByYear(){//年流失客户
            let f = Object.assign(this.form,this.loseForm);
            queryLoseCustomerByYear(f).then(res=>{
                if(res.code==0){

                     let LoseCustomerByYear = {};
                    
                    res.data.map(item=>{
                        
                        if(!LoseCustomerByYear.hasOwnProperty(item.month)){
                            LoseCustomerByYear[`${this.form.year}-${item.month}`] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`完全流失客户`);
                            k==`partCount` &&  (index=1 , key_CN=`部分流失客户`);

                           index != null &&  (LoseCustomerByYear[`${this.form.year}-${item.month}`][index][key_CN] = item[k])

                        }

                    });

                    this.LoseCustomerByYear = LoseCustomerByYear;

                }else{ this.$message.error(res.msg); };
            });
        },
        queryLoseCustomerByQuarter(){//季度流失客户
            let f = Object.assign(this.form,this.loseForm);
            queryLoseCustomerByQuarter(f).then(res=>{
                if(res.code==0){
                    
                      let LoseCustomerByQuarter = {};
                    
                    res.data.map(item=>{
                        
                        if(!LoseCustomerByQuarter.hasOwnProperty(item.name)){
                            LoseCustomerByQuarter[item.name] = [
                                {},  //月有效
                                {},  //月新增
                            ];
                        };

                        for (const k in item) {

                            let index = null;
                            let key_CN = null;

                            k==`totalCount` &&  (index=0 , key_CN=`完全流失客户`);
                            k==`partCount` &&  (index=1 , key_CN=`部分流失客户`);

                           index != null &&  (LoseCustomerByQuarter[item.name][index][key_CN] = item[k])

                        }

                    });

                    this.LoseCustomerByQuarter = LoseCustomerByQuarter;

                }else{ this.$message.error(res.msg); };
            });
        },
    }
}
</script>


<style lang="scss" scoped>

.table-container{
    .admin-tab-title{
        .el-select{
            width: 110px;
            float: right;
            margin-top: -5px;
        }
    }
        &:last-child{
            margin-bottom: 0px;
        }
        .el-form-item{
            margin-bottom: 0px;
        }
        // &.indexDb{
        //     display: inline-block;
        //     width: 33%;
        //     float: left;
        //     margin-right: 5px;
        //     margin-bottom: 0px;
        //     &:last-child{
        //         margin-right: 0px;
        //     }
        // }
        .map{
            height: 420px;
        }
    }
</style>
