<template >
    <div class="fadeIn clearfix">
        <div class="table-container ">
            <el-form :model="form" class="admin-form-inline subAccount-form" :inline="true">

              <el-form-item label="查询报表:">
                  <el-select v-model="form.type" placeholder="请选择查询报表">
                    <el-option value="0" label="全部"></el-option>
                    <el-option value="1" label="销售员月入账金额对比"></el-option>
                    <el-option value="2" label="销售员季度入账金额对比"></el-option>
                    <el-option value="3" label="单个销售员每月入账金额对比"></el-option>
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

        <div class="table-container indexDb"  v-show="chartCode==0 || chartCode==1">
            <div class="admin-tab-title">销售月入账金额对比
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
            </div>
            <div class="map">
                  <BarSingle :matter='true' TID="T_salesBound" :data="salesBound"></BarSingle>
            </div>
        </div>

        <div class="table-container indexDb"  v-show="chartCode==0 || chartCode==2">
            <div class="admin-tab-title">销售员季度入账金额对比

                 <el-select v-model="form.quarter" placeholder="选择季度">
                    <el-option value="1" label="第一季度"></el-option>
                    <el-option value="2" label="第二季度"></el-option>
                    <el-option value="3" label="第三季度"></el-option>
                    <el-option value="4" label="第四季度"></el-option>
                </el-select>
            </div>
            <div class="map">
                  <BarSingle :matter='true' TID="T_salesboundByQuarter" :data="salesboundByQuarter"></BarSingle>
            </div>
        </div>

        <div class="table-container indexDb"  v-show="chartCode==0 || chartCode==3">
            <div class="admin-tab-title">单个销售员每月入账金额对比

                <el-select v-model="form.source" placeholder="请选择销售员">
                  <el-option v-for="(item,index) in sales" :key="index"
                    :label="item.userName"
                    :value="item.source"
                  ></el-option>
                </el-select>
            </div>
            <div class="map">
                  <BarSingle TID="T_USER" :data="salesboundByYear"></BarSingle>
            </div>
        </div>
    </div>
</template>

<script>
  import BarSingle from './../DashBoard/BarSingle.vue';

  import { cookie } from '../../../utils/common.js';

  import {
   queryAllSalesData
} from '../../../ext/localBase.js';

import { 
    queryMonthinbound,              //销售月入账统计
    queryMonthinboundByYear,        //单销售每月入账统计
    queryMonthinboundByQuarter,     //销售季度入账统计
} from '../../../utils/axios/api.js';
import mixin from '../../../ext/mixin.js';
export default {
    mixins:[mixin()],
    data(){
        return{
            form:{
                type:'',
                year:'',

                month:'',
                source:'',
                quarter:'',
            },
            chartCode:'0',
            salesBound:{},
            salesboundByYear:{},
            salesboundByQuarter:{},
            sales:[]
        }
    },
    components:{
        BarSingle
    },
    watch:{
        'this.form.month'(){
            this.Monthinbound();
        },
        'this.form.source'(){
            this.MonthinboundByYear();
        },
        'this.form.quarter'(){
            this.MonthinboundByQuarter();
        },
    },
    methods:{
        __LOADING(){
            queryAllSalesData().then(res=>{ this.sales = res; }),
            this.reset();
            // this.loadingQuery() //watch变换已做请求
        },
        loadingQuery(){
             this.chartCode = this.form.type;

            switch(Number(this.form.type)){
                case 0:
                {
                    this.Monthinbound();
                    this.MonthinboundByYear();
                    this.MonthinboundByQuarter();
                }break;
                case 1:
                {
                     this.Monthinbound();
                }break;
                case 2:
                {
                    this.MonthinboundByQuarter();
                    
                }break;
                case 3:
                {
                    this.MonthinboundByYear();
                }break;
            }
        },
        Monthinbound(){ //销售月入账金额对比
            queryMonthinbound(this.form).then(res=>{
                if(res.code==0){
                    let salesBound = {};

                    res.data.map(item=>{
                        salesBound[item.name] = {};
                        salesBound[item.name]['value'] = item.statement;
                        salesBound[item.name]['环比'] = item.relative;
                        salesBound[item.name]['同比'] = item.basis;
                        // salesBound[item.name]['value'] = Math.ceil(Math.random()*100) ;
                    });

                    this.salesBound = salesBound;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        MonthinboundByYear(){ //单个销售员每月入账金额对比 salesboundByYear
            queryMonthinboundByYear(this.form).then(res=>{
                if(res.code==0){

                     let salesboundByYear = {};

                    res.data.map(item=>{
                        salesboundByYear[`${this.form.year}-${item.month}`] = {};
                        salesboundByYear[`${this.form.year}-${item.month}`]['value'] = item.statement;
                        // salesboundByYear[item.month]['value'] = Math.ceil(Math.random()*100);
                    });

                    this.salesboundByYear = salesboundByYear;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        MonthinboundByQuarter(){
            queryMonthinboundByQuarter(this.form).then(res=>{
                if(res.code==0){
                     let salesboundByQuarter = {};

                    res.data.map(item=>{
                        salesboundByQuarter[item.name] = {};
                        salesboundByQuarter[item.name]['value'] = item.statement;
                        salesboundByQuarter[item.name]['同比'] = item.basis;
                        salesboundByQuarter[item.name]['环比'] = item.relative;
                        // salesboundByQuarter[item.name]['value'] = Math.ceil(Math.random()*100);
                    });

                    this.salesboundByQuarter = salesboundByQuarter;
                }else{
                    this.$message.error(res.msg);
                }
            });
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
            this.form.month =  MM.toString();
            //3. 初始化季度
            let qua = {
                "1":[1,2,3],
                "2":[4,5,6],
                "3":[7,8,9],
                "4":[10,11,12],
            };

            for (const key in qua) {
                if(qua[key].indexOf(m)>-1){
                    this.form.quarter = `${key}`;//季度
                }
            };
            //4.销售人员的默认选择
            let adminInfo = JSON.parse(cookie.get('adminUserInfo'));
            this.form.source = adminInfo.source||'';
        },
    },
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
