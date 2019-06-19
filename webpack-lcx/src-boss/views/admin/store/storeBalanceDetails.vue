<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form  class="admin-form-inline subAccount-form" :model="form" :inline="true">

                <el-form-item class="data" label="查询年份：">
                    <el-date-picker
                        value-format="yyyy"
                        v-model="form.year"
                        type="year"
                        placeholder="请选择年份">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="loadingMap" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">店铺年入账详情</div>
            <div class="map">
                <FoldLine :data="FoldLineData"></FoldLine>
            </div>
        </div>

        <div class="table-container mg-bt-0">
            <div class="admin-tab-title">店铺月入账详情
                 <el-select v-model="monthForm" placeholder="选择月">
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
                 <BarSingle TID="FoldLineMonthData" :data="FoldLineMonthData"></BarSingle>
            </div>
        </div>
    </div>
</template>


<script>
import { 
    findInboundStatementDetal,
    findInboundStatementDetal_S 
} from '../../../utils/axios/api.js';

 import FoldLine from './../DashBoard/FoldLine.vue';
  import BarSingle from './../DashBoard/BarSingle.vue';

export default {
    data(){
        return{
            form:{
                stores:"",
                customerNo:"",
                year:"",
            },
            monthForm:"",

            FoldLineData:[],
            FoldLineMonthData:[],
            currency:''
        }
    },
    components:{
        FoldLine,
        BarSingle
    },
    watch:{
        monthForm(n,o){
            if(!o) return;
            this.queryFindInbound();
        }
    },
    created(){
         let OBJ = this.$route.params;
         let m = this.$store.state.Memory.storeBalanceDetails;

         if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"storeBalance"});

        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            //销售负责人
            this.form.stores = OBJ.storeId;
            this.form.customerNo = OBJ.customerNo;
            this.currency = OBJ.currency;

            this.reset();
            this.loadingMap();

        };

        
    },
    methods:{
        loadingMap(){

             if(!this.form.year) return this.$message.warning(`请选择查询年份`);

            findInboundStatementDetal(this.form).then(res=>{
                if(res.code==0){

                    let month = ["01","02","03","04","05","06","07","08","09","10","11","12",]

                    let FoldLineData = {};
                    let storeId = this.form.stores,
                        year = this.form.year,
                        currency = null;

                    //一个店铺就一个币种
                    switch(this.currency){
                        case 'USD':{ currency ='入账美金' } break;
                        case 'AUD':{ currency ='入账澳元' } break;
                        case 'JPY':{ currency ='入账日元' } break;
                        case 'EUR':{ currency ='入账欧元' } break;
                        case 'GBP':{ currency ='入账英镑' } break;
                    }

                    if(!currency) return console.log(`未定义currency${this.currency}`);

                    //chart数据
                    month.map(month=>{
                        
                        FoldLineData[`${year}-${month}`] = [{}];

                        let D = res.data[`${storeId}-${year}-${month}`];
                        FoldLineData[`${year}-${month}`][0][currency] = D ? D.amount : 0;
                        
                    });

                    this.FoldLineData = FoldLineData;

                }else{
                    this.$message.error(res.msg);
                }
            });

            this.queryFindInbound();
        },
        reset(){

             let D = new Date();

            let y = D.getFullYear(),
                m = D.getMonth()+1,
                d = D.getDate(),
                YY = y,
                MM = m < 10 ? '0'+m : m,
                DD = d < 10 ? '0'+d : d;

            this.form.year = YY.toString();
            this.monthForm = MM.toString();
        },
        queryFindInbound(){
            if(!this.form.year) return this.$message.warning(`请选择查询年份`);

            let FormData = Object.assign({month:this.monthForm },this.form);
            findInboundStatementDetal_S(FormData).then(res=>{
                if(res.code==0){

                     let FoldLineMonthData = {};
                     let storeId = this.form.stores,
                        year = this.form.year,
                        currency = null;

                    //一个店铺就一个币种
                    switch(this.currency){
                        case 'USD':{ currency ='入账美金' } break;
                        case 'AUD':{ currency ='入账澳元' } break;
                        case 'JPY':{ currency ='入账日元' } break;
                        case 'EUR':{ currency ='入账欧元' } break;
                        case 'GBP':{ currency ='入账英镑' } break;
                    }

                    if(!currency) return console.log(`未定义currency${this.currency}`);
                    /////
                    for (const key in res.data) {
                        for (const j in res.data[key]) {
                            if(j=='month'){
                                FoldLineMonthData[res.data[key][j]] =  {"value": res.data[key][`amount`] } 
                            }
                        }
                    };

                    this.FoldLineMonthData = FoldLineMonthData;

                }else{
                    this.$message.error(res.msg);
                }
            });
        }
    },
    destroyed() {
         let tabArr = this.$store.state.TabList;

         tabArr.forEach(item=>{
              if(item.name==`storeBalanceDetails`){
                  return this.$store.commit('setModelRecordData',{
                        key:'storeBalanceDetails',
                        data:{
                            form:this.form,
                            monthForm:this.monthForm,
                            FoldLineData:this.FoldLineData,
                            FoldLineMonthData:this.FoldLineMonthData,
                            currency:this.currency,
                        }
                    });
              };
         });

    },
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 0px;
}

.map{
    height: 400px;
}

.admin-tab-title{
    .el-select{
        width: 110px;
        float: right;
        margin-top: -5px;
    }
}
</style>

