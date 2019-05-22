<template>
    <div class="fadeIn">
        <h2 class="banner-module-title">
            VAT缴税
            <p>
                （当前仅支持英国VAT缴费。请根据您需缴费的税务局当地的税单及法定货币选择缴费金额和币种。）
                <a href="javascript:;" class="cares-color">其他常见问题</a>
            </p>
        </h2>
        <div class="applyInfo">
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>申报国家</th>
                            <th>VAT税号</th>
                            <!-- <th>EORI号码</th> -->
                            <th>代缴税金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{Data.countryCode}}</td>
                            <td>{{Data.taxNo}}</td>
                            <!-- <td>86565</td> -->
                            <td>{{Data.amount/100}}</td>
                        </tr>
                    </tbody>
                </table>
            </CTable>
        </div>
        <p class="block-title">支付代缴费用</p>
         <CTable>
            <table>
                <thead>
                    <tr>
                        <th class="per20">店铺名称</th>
                        <th class="per20">国家</th>
                        <th class="per20">币种</th>
                        <th class="per20">可提现金额</th>
                        <th class="per20">缴税金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in table" :key="index">
                        <td>{{item.storeName}}</td>
                        <td>
                            <!-- {{fineValName(item.national,AllNationCode,'nation','code')}} -->
                            <span v-for="(code,iiindex) in item.national.split('/')" :key="iiindex">{{fineValName(code,AllNationCode,'nation','code')}}<i v-if="iiindex != item.national.split('/').length-1">/</i> </span>
                        </td>
                        <td>{{item.currency}}</td>
                        <td>{{item.balance}}</td>
                        <td>
                            <input type="text"
                                class="cares-input"
                                placeholder="请输入代缴金额"
                                @input="(event)=>payAmountChange(event,item.balance,index)"
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>

        <p class="PayCount">支付代缴税金额：<span class="cares-color">{{Data.amount/100}}{{Data.currency}}</span></p>
        <p class="PayCount">预付款金额：<span class="cares-color">{{totalSelect}}{{Data.currency}} </span> 剩余代缴税金额：<span class="cares-color">{{((Data.amount/100)-totalSelect)>0 ? (Data.amount/100)-totalSelect : 0}}{{Data.currency}}</span></p>


        <div class="line">
            <el-checkbox v-model="isRead">我已阅读并同意</el-checkbox><a href="javascript:;" @click="changeServiceStatus(true)" class="cares-color">《VAT服务条款》</a> 
        </div>

        <div class="btn">
            <span :class="isRead?'cares-button-primary':'cares-button-info'" @click="confirmToPay">确认付款</span>
            <span class="cares-button-primary pain" @click="returnBack">返回</span>
        </div>


        <VatService v-model="flag"
            :buttonEvent="serviceButtonEvent"
        ></VatService>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue'; 
import VatService from './../VATServiceAgreement.vue';
import {AllNationCode} from './../../../utils/localbase.js';
// queryWithdrawStoreList
import { queryWithdrawStoreList,vatPaytaxPay } from './../../../../../js/api.js';
export default {
    data(){
        return {
            flag:false,
            isRead:false,
            ING:false,
            table:[],
            AllNationCode:AllNationCode,
        }
    },
    props:['Data'],
    created(){
        this.queryWithdrawStore(this.Data.currency);
    },
    methods:{
        payAmountChange(event,t,index){

            let result =this.table.find((item,i)=>{
                return i == index
            });

            let val =  event.target.value || 0;
                val = parseFloat(val);
            let total = parseFloat(t);

            result['payAmount'] =  val>total ? total : val;
            event.target.value = val>total ? total : val;
        },
        queryWithdrawStore(currency){
            queryWithdrawStoreList({currency}).then(res=>{
                if(res.code==0){
                    this.table = res.data.map(item=>{
                        if(item.type==1) item['payAmount']=0;return item;
                    });
                }
            });
        },
        confirmToPay(){
            if(this.totalSelect != this.Data.amount/100) return this.$Message.warning(`缴税金额与待支付金额不等`);

            if(!this.isRead) return this.flag = true;

            if(this.ING) return;
            this.ING = true;

            let pays=[];
            this.table.forEach(item=>{
                if(item.payAmount>0){
                    pays.push({storeId:item.storeId,amount:item.payAmount});
                }
            });

            vatPaytaxPay({
                id:this.Data.id,
                pays:JSON.stringify(pays), 
            }).then(res=>{
                this.ING = false;
                if(res.code == 0){
                    //发起付款成功
                    this.$router.push({
                        name:'AuthenticationDone',
                        params:{
                            source:'PayTaxDone',
                            id:this.Data.id
                        }
                    });
                }else{
                    this.$Message.error(res.msg);
                }
            });
            
        },
         returnBack(){
            this.$router.push({
                name:"Reflesh",
                params:{
                    name:"VATpay"
                }
            });
        },
        changeServiceStatus(bol){
            this.flag = bol;
        },
        serviceButtonEvent(bol){
            this.isRead = bol;
            this.changeServiceStatus(false);
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    },
    computed:{
        totalSelect(){
            let num = 0;
            this.table.forEach(item=>{
                num += (item.payAmount || 0)
            });

            return num;
        }
    },
    components:{
        CTable,
        VatService
    }
}
</script>


<style lang="scss" scoped>
.applyInfo{
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
}
.banner-module-title{
    height: auto;
    line-height: normal;
    font-weight:bold;
    padding: 20px 0;
    font-size: 18px;
    p{
        margin-top: 5px;
        font-weight: normal;
        font-size: 14px;
    }
}

.line{
    padding: 20px 0;
    border-top: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
    margin: 20px 0;
    .el-checkbox{
        margin-right: 0px;
    }
    a{
        font-size: 14px;
    }
}

.PayCount{
    margin: 10px 0;
    font-size: 14px;
}

.btn{
    span{
        min-width: 80px;
        margin-right: 10px;
    }
}

.block-title{
    line-height: 80px;
}
</style>
