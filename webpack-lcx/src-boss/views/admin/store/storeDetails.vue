<template>
    <div class="fadeIn">
        <div class="table-container">
            <div class="admin-tab-title">店铺基本信息</div>
            <ul class="cus_info">
                <li><span>店铺名称：</span>{{storeInfo.name}}</li>
                <li><span>店铺ID：</span>{{storeInfo.storeId}}</li>
                <li><span>店铺所属平台：</span>{{storeInfo.platformName}}</li>
                <li><span>授权状态：</span>
                    <i class="no" v-if="storeInfo.authStatus=='0'">未授权</i>
                    <i class="yes" v-if="storeInfo.authStatus==1">已授权</i>
                </li>
                <li><span>店铺状态：</span>
                    <i class="ing" v-if="storeInfo.status=='0'">待激活店铺</i>
                    <i class="yes" v-if="storeInfo.status==1">有效店铺</i>
                    <i class="no" v-if="storeInfo.status==2">流失店铺</i>
                </li>
                <li><span>提现方式：</span>
                    <i class="yes" v-if="storeInfo.isAutoWithdraw==1">自动</i>
                    <i v-else>手动</i>
                </li>
                <li v-if="storeInfo.isAutoWithdraw==1"><span>提现账户：</span>{{storeInfo.autoWithdrawAccount}}</li>
                <li><span>客户名称：</span>{{storeInfo.customerName}}</li>
                <li><span>绑定店铺时间：</span>{{storeInfo.createTime}}</li>
                <li><span>店铺授权时间：</span>{{storeInfo.authTime}}</li>
                <li><span>店铺流失时间：</span>{{storeInfo.wastageTime}}</li>
                <li><span>KYC资料：</span><a class="primary" v-if="storeInfo.storeId" @click="bindToStoreKYC(storeInfo.storeId)" href="javascript:;">查看详情</a></li>
                <li><span>子账号：</span>{{storeInfo.accountNo}}</li>
                <li><span>店铺链接：</span> <a v-if="storeInfo.storeUrl" target="_blank" :href="storeInfo.storeUrl">{{storeInfo.storeUrl}}</a> </li>

            </ul>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">店铺销售信息</div>
            <ul class="cus_info">
                <li><span>经营类目：</span>{{storeInfo.productCategories}}</li>
                <li><span>入账币种：</span>{{storeInfo.currency}}</li>
                <li><span>预计年销售量：</span>{{storeInfo.expectedSale}}</li>
                <!-- <li><span>去年历史销售量：</span>xxx</li> -->
                <li><span>店铺累计入账：</span>{{storeInfo.sumAccount}}</li>
                <li><span>店铺入账记录：</span><a class="primary" @click="bindToStoreAdmission(storeInfo.storeId,storeInfo.customerNo,storeInfo.currency)" href="javascript:;">查看详情</a></li>
                <li style="padding-left:250px;">
                    <el-button   @click="bindReturn" type="primary">返回</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

 import {
        storeInfo
    } from '../../../utils/axios/api.js';

export default {
    data(){
        return{
            storeInfo:{
                name:'',
                storeId:'',
                platformName:'',
                authStatus:'',
                status:'',
                customerName:'',
                customerNo:'',
                createTime:'',
                authTime:'',
                wastageTime:'',
                accountNo:'',
                storeUrl:'',

                productCategories:'',
                currency:'',
                expectedSale:'',
                sumAccount:'',

                userId:'',
                enterpriseId:'',
                id:'',
            }
        }
    },
    created(){
        let storeId = this.$route.params.storeId;
        let nationalCode = this.$route.params.storeCountry;
         let m = this.$store.state.Memory.storeDetails;

         if(!storeId && !m) return this.$router.push({name:"storeInfo"});

        if(!storeId){
             Object.assign(this,m);
         }else{
              this.loadingQuery(storeId,nationalCode)
         };
       
    },
    methods:{
        loadingQuery(storeId,nationalCode){
            storeInfo({
                nationalCode,
                storeId,
                pageNum:'1',
                pageSize:'10',
            }).then(res=>{
                if(res.code==0){
                    res.data.length && (this.storeInfo = res.data[0]);
                    // this.storeInfo = res.data[0] || null;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        //店铺入账记录
        bindToStoreAdmission(storeId,customerNo,currency){
            this.$router.push({
                name:"storeBalanceDetails",
                params:{
                    storeId,
                    customerNo,
                    currency
                }
            })
        },
        //店铺KYC
        bindToStoreKYC(){
             this.$router.push({ 
                 name: 'KYCdetail',
                 params: {
                    userId: this.storeInfo.userId,
                    enterpriseId: this.storeInfo.enterpriseId,
                    storeNo: this.storeInfo.id,

                    platformAppId: this.storeInfo.platformAppId,
                    platformCode: this.storeInfo.platformCode,
                    platformEnId: this.storeInfo.platformEnId,
                    customerNo: this.storeInfo.customerNo,
                    storeId: this.storeInfo.storeId,
                }
            });
        },
        bindReturn(){
            window.history.back();
        }
    },
    destroyed() {
         let tabArr = this.$store.state.TabList;

         tabArr.forEach(item=>{
              if(item.name==`storeDetails`){
                  return this.$store.commit('setModelRecordData',{
                        key:'storeDetails',
                        data:{
                            storeInfo:this.storeInfo,
                        }
                    });
              };
         });

    },
}
</script>


<style lang="scss" scoped>
    ul.cus_info{
        li{
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
            .el-button {
                padding: 0 30px;
            }
        }
    }
</style>
