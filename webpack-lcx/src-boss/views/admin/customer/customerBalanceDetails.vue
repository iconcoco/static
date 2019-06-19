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

                <el-form-item label="查询店铺">
                    <el-select v-model="form.stores" placeholder="请选择查询的店铺">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in allStores" :key="index"
                            :label="item.name"
                            :value="item.storeId"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="loadingMap" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <div class="table-container mg-bt-0">
            <div class="admin-tab-title">客户入账详情</div>
            <div class="map">
                <FoldLine :data="FoldLineData"></FoldLine>
            </div>
        </div>
    </div>
</template>

<script>

import { 
    findInboundStatementDetal,
    storeInfo
} from '../../../utils/axios/api.js';

 import FoldLine from './../DashBoard/FoldLine.vue';

export default {
    data(){
        return{
            form:{
                customerNo:"",
                year:"",
                stores:'',
            },
            allStores:[],
            FoldLineData:{}
        }
    },
    created(){
            let customerNo = this.$route.params.customerNo;
            let m = this.$store.state.Memory.customerBalanceDetails;

            if(!customerNo && !m) return this.$router.push({name:"customerBalance"});
            
            if(!customerNo){
                Object.assign(this,m);
            }else{
                    this.form.customerNo = customerNo;

                     //查询该客户下所有的店铺
                    storeInfo({
                        customerNo: customerNo,
                        pageNum: 1,
                        pageSize: 10,
                        totalSize: 4,
                    }).then(res=>{
                        if(res.code==0){
                            this.allStores = res.data;
                            //请求当前页面数据
                            this.reset();
                            this.loadingMap();
                        }else{
                            this.$message.error(res.msg);
                        }
                    });
            };
        
    },
    components:{ FoldLine },
    methods:{
        loadingMap(){

            if(!this.form.year) return this.$message.warning(`请选择查询年份`);

            findInboundStatementDetal(this.form).then(res=>{
                if(res.code==0){

                    let months = ["01","02","03","04","05","06","07","08","09","10","11","12",]

                    let FoldLineData = {};

                    let  storeId = this.form.stores,
                        year = this.form.year;

                    //所有店铺下的
                    let storeIds = [];      //店铺ID
                    let storeName = {};     //店铺名称
                    //1. 布局所有店铺的位置，并保存店铺ID
                    this.allStores.map((store)=>{
                        storeIds.push(store.storeId);
                        //店铺的名字
                        storeName[store.storeId] = store.name
                    });
                    //storeIds = [11111,22222];
                    //storeName = {1111：xxx,2222:name};

                    //当前查询的是全部店铺还是单一店铺
                    if(storeId){
                        
                        months.map(month=>{
                            FoldLineData[`${year}-${month}`] = [{}];
                            let D = res.data[`${storeId}-${year}-${month}`];

                            let dName = storeName[storeId];
                            FoldLineData[`${year}-${month}`][0][dName] = D ? D.totalAmont  : 0;
                        });

                    }else{

                        //2.赋值给所有的月份
                        months.map(month=>{
                            FoldLineData[`${year}-${month}`] = [];

                            storeIds.map((storeId,index)=>{
                                FoldLineData[`${year}-${month}`][index] = {};
                                let dName = storeName[storeId];
                                FoldLineData[`${year}-${month}`][index][dName] = 0;
                            });

                        });
                       
                        //FoldLineData = { 
                        //     2018-10: [{11111:0},{2222:0}];
                        //     2018-11: [{11111:0},{2222:0}];
                        //  };

                        //3.重新修改对应的值
                        storeIds.map((storeId,index)=>{
                            //key ---  店铺的ID
                             months.map(month=>{
                                let D = res.data[`${storeId}-${year}-${month}`];    //查询到的值
                                if(D){
                                    let dName = storeName[storeId];
                                    FoldLineData[`${year}-${month}`][index][dName] = D.totalAmont ;
                                    //  console.log(D,key,`${year}-${month}`,FoldLineData[`${year}-${month}`][index]);
                                };
                                // console.log(D,key,`${year}-${month}`,FoldLineData[`${year}-${month}`][index][key]);
                            });
                        });

                    };

                     //4. 计算当月的总入账
                    for (const key in FoldLineData) {
                        
                        let mo = 0;
                        FoldLineData[key].map(item=>{
                            for (const j in item) {
                                mo += item[j];
                            }
                        });

                        FoldLineData[key].push({"总入账金额":mo});
                    };

                    this.FoldLineData = FoldLineData;

                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        reset(){
            this.form.year = new Date().getFullYear().toString();
            this.form.stores = '';
        },
    },
     destroyed() {
             let tabArr = this.$store.state.TabList;

             tabArr.forEach(item=>{
                  if(item.name==`customerBalanceDetails`){
                      return this.$store.commit('setModelRecordData',{
                            key:'customerBalanceDetails',
                            data:{
                                form:this.form,
                                allStores:this.allStores,
                                FoldLineData:this.FoldLineData,
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
</style>
