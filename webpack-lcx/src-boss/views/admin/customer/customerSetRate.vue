<template>
    <div class="fadeIn">
        <div class="table-container">
            <div class="admin-tab-title">修改客户费率</div>
            <ul class="cus_info">
                <li><span>客户ID：</span> {{customerInfo.customerNo}}</li>
                <li><span>客户类型：</span>
                    <template v-if="customerInfo.customerType==1">个人客户</template>
                    <template v-if="customerInfo.customerType==2">企业客户</template>
                </li>
                <li><span>客户名称：</span> {{customerInfo.customerName}}</li>
                <li><span>平 台：</span>
                     <el-select v-model="form.platformCode" placeholder="请选择平台">
                       <el-option v-for="(item,index) in PLAT_ARR" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                       ></el-option>
                    </el-select>
                </li>
                <li><span>客户费率：</span>
                    <el-select v-model="form.rate" placeholder="请选择费率区间">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="(item,index) in rateZoom" :key="index"
                             :value="item.rateCode"
                            :label="item.rateCode"
                        ></el-option>
                    </el-select>
                </li>
               <li style="padding-left:250px;">
                    <el-button @click="bindConfirm" type="primary" plain>确认</el-button>
                    <el-button @click="bindBack" type="danger">取消</el-button>
                </li>
               
            </ul>
        </div>
    </div>
</template>

<script>

import {
    findCustomerRateList,
    updateCustomerRate
} from '../../../utils/axios/api.js';

import { queryRateZoom,queryPlatform } from '../../../ext/localBase.js'

export default {
    data(){
        return{
            customerInfo:{
                createdTime:'',
                customerName:'',
                customerNo:'',
                customerType:'',
                id:'',
                phoneNo:'',
                rate:'',
            },
            rateZoom:[],
            form:{
               rate:'', 
               platformCode:'',
            },
            PLAT_ARR:[],

            RATE:[],
        }
    },
    created(){
        let customerNo = this.$route.params.customerNo;
        if(!customerNo) return this.$router.push({name:"customerRate"});

        this.loadingQuery(customerNo);
         queryRateZoom().then(res=>{
                this.rateZoom = res;
                this.RATE = res;
        });

        queryPlatform().then(res=>{ this.PLAT_ARR = res })
       
    },
    methods:{
        loadingQuery(customerNo){
             findCustomerRateList({
                customerNo,
                pageNum:'1',
                pageSize:'10',
                totalSize:'1'
            }).then(res=>{
                if(res.code==0){
                        this.customerInfo = res.data[0];
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        bindConfirm(){
            if(!this.form.platformCode) return this.$message.warning('请选择平台');
            if(this.form.rate === '') return this.$message.warning('请选择费率');
            if(this.form.rate == this.customerInfo.rate) return this.$message.warning('费率未作更改');

            updateCustomerRate({
                customerNo:this.customerInfo.customerNo,
                rate:this.form.rate,
                platformCode:this.form.platformCode
            }).then(res=>{
                 if(res.code==0){
                    this.$message.success('修改成功！');
                    this.$router.push({ name:'customerRate' ,params:{ reflesh:true }});
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        bindBack(){
            this.$router.push({name:"customerRate"});
        }
    },
    watch:{
        "form.platformCode"(c){
            this.form.rate='';

            let nr = [];
            this.RATE.map(item=>{
                if(item.ratePlat==c){
                    nr.push(item);
                }
            });

            this.rateZoom = nr;
        }
    }
}
</script>

<style lang="scss" scoped>
    ul.cus_info{
        >li{
            width: 50%;
            height: 50px;
            line-height: 50px;
            padding-left: 100px;
            color: #333;
            >span{
                display: inline-block;
                width: 150px;
                text-align: right;
                margin-right: 10px;
                color: #999;
            }
        }
    }
</style>

