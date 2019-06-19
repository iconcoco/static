<template>
    <div class="fadeIn clearfix">
       <div class="table-container">
            <el-form class="admin-form-inline subAccount-form" :inline="true" :model="form">

                <el-form-item class="data" label="开始时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.startDate"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="data" label="结束时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd"
                        v-model="form.endDate"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="统计标准：">
                    <el-select v-model="form.optionStatus" placeholder="请选择统计标准">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="平台" value="1"></el-option>
                      <el-option label="币种" value="2"></el-option>
                      <el-option label="费率" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="loadingQuery" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
       </div>
       <div v-show="chartCode==0 || chartCode==1" class="table-container index-db">
           <div class="admin-tab-title">平台入账统计</div>
           <div class="map">
                <Pie TID="Platform" :data="table.platform" :text="{
                    title:'平台入账统计',
                    tip:'平台入账'
                 }"></Pie>
           </div>
       </div>
       
       <div v-show="chartCode==0 || chartCode==2" class="table-container index-db">
           <div class="admin-tab-title">币种入账统计</div>
           <div class="map">
                <Pie TID="Currency" :data="table.currency" :text="{
                    title:'币种入账统计',
                    tip:'币种入账'
                 }"></Pie>
           </div>
       </div>

       <div v-show="chartCode==0 || chartCode==3" class="table-container index-db">
           <div class="admin-tab-title">费率入账统计</div>
           <div class="map">
               <Pie TID="Rate" :data="table.rate" :text="{
                    title:'费率入账统计',
                    tip:'费率入账'
                 }"></Pie>
           </div>
       </div>
    </div>
</template>

<script>

    import { queryCSDByDaily } from '../../../utils/axios/api.js';

    import Pie from '../DashBoard/Pie.vue';

    export default{
        data(){
            return{
                form:{
                    startDate:'',
                    endDate:'',
                    optionStatus:'0',
                },
                table:{
                    platform:{},
                    currency:{},
                    rate:{},
                },
                chartCode:'0'
            }
        },
        created(){
            let flag = this.$route.params.flag;
            if(!flag) return this.$router.push({name:'index'});

            this.reset();
            this.loadingQuery();
        },
        components:{
            Pie
        },
        methods:{
            loadingQuery(){
                queryCSDByDaily(this.form).then(res=>{
                    if(res.code==0){
                         this.chartCode = this.form.optionStatus;
                        //币种
                        if(res.data.currency){
                            let currency = {};
                            res.data.currency.map(item=>{
                                 let k_name = null;
                                item.currency=="EUR" && (k_name="欧元");
                                item.currency=="JPY" && (k_name="日元");
                                item.currency=="USD" && (k_name="美金");
                                currency[k_name] = {name:k_name,value:item.amount};
                            });
                            this.table.currency = currency;
                        };
                        //平台
                        if(res.data.platformCode){
                            let platformCode = {};
                            res.data.platformCode.map(item=>{
                                 let k_name = null;
                                item.platform_code=="BM" && (k_name="亚马逊北美");
                                item.platform_code=="OM" && (k_name="亚马逊欧美");
                                item.platform_code=="EBAY" && (k_name="ebay");
                                platformCode[k_name] = {name:k_name,value:item.amount};
                            });
                            this.table.platform = platformCode;
                        };
                        //费率
                        if(res.data.standardRate){
                            let standardRate = {};
                            res.data.standardRate.map(item=>{
                                standardRate[`${item.standard_rate}费率`] = {name:`${item.standard_rate}费率`,value:item.amount};
                            });
                            this.table.rate = standardRate;
                        };
                        
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

                this.form.startDate = `${YY}-${MM}-01`;
                this.form.endDate = `${YY}-${MM}-${DD}`;

                this.form.optionStatus = "0";

            },
        }
    }
</script>

<style lang="scss" scoped>
    .table-container{
        .el-form-item{
            margin-bottom: 0px;
        }
        &.index-db{
            display: block;
            width: 33%;
            float: left;
            margin-right: 5px;
            margin-bottom: 0px;
            &:last-child{
                margin-right: 0px;
            }
        }
        .map{
            height: 420px;
        }
    }
</style>

