<template>
    <div class="fadeIn">
        <div class="table-container">
            <div class="block">
                <h5>入账信息</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>客户名称：</span>{{PAGEDATA.customerName}}</li>
                    <li><span>入账金额：</span>{{PAGEDATA.realAmount}}</li>
                    <li><span>入账币种：</span>{{PAGEDATA.currency}}</li>
                    <li><span>入账时间：</span>{{PAGEDATA.taxPayUpdateTime}}</li>
                </ul>
            </div>

            <div class="block">
                <h5>支付店铺</h5>
                <ElTable :data="table" border >
                <ElTableColumn prop="storeName" label="店铺名称"></ElTableColumn>
                <ElTableColumn prop="platformCode" label="国家站点">
                    <template slot-scope="scoped">
                        {{fineValName(scoped.row.platformCode,Platform,'platformName','platformCode')}}
                    </template>
                </ElTableColumn>
                <ElTableColumn prop="currency" label="币种"></ElTableColumn>
                <ElTableColumn prop="amount" label="支付金额">
                    <template slot-scope="scoped">
                        {{scoped.row.amount/100}}
                    </template>
                </ElTableColumn>
                </ElTable>
            </div>
        </div>
    </div>
</template>

<script>

import {vatrecordGetTaxDetailById} from './../../../utils/axios/api.js';
import {
    queryPlatform
} from '../../../ext/localBase.js';
export default {
    data(){
        return{
            PAGEDATA:{},
            table:[],

            Platform:[],
        }
    },
    created(){

        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.vatBalanceTaxDetails;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"vatBalance"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            let ID = OBJ.id;
            this.PAGEDATA = OBJ;
            this.queryPageData(ID);

            queryPlatform().then(res=>{
                 this.Platform = res;
            });
        };
    },
    methods:{
        queryPageData(id){

            vatrecordGetTaxDetailById({id}).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
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
    destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='vatBalanceTaxDetails'){
                return  this.$store.commit('setModelRecordData',{
                     key:'vatBalanceTaxDetails',
                     data:this._data
                 });
            }
        });
    }
}
</script>


<style lang="scss" scoped>
    @import './../../../css/element-variables.scss';
    .block{
        padding-top: 10px;
        border-bottom: 1px solid #e5e5e5;
    }

    h5{
      font-size: 14px;
      color: #333;
  }

  .item-container{
    padding: 20px 0;
    li{
        display: inline-block;
        margin-right: 40px;
        color: #666;
        min-width: 20%;
        // max-width: 20%;
        line-height: 30px;
        span{
            color: #333;
        }
    }  
}
</style>