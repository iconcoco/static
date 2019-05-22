<template>
        <!--店铺详细列表-->
        <div class="stroe-listTitile row fadeIn">
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th class="per20">时间</th>
                            <th class="per20">店铺名称</th>
                            <th class="">店铺所在地区</th>
                            <th class="">金额</th>
                            <th class="">类型</th>
                            <th class="">店铺余额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!dataArr || value.length==0" class="empty">
                            <td colspan="5">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in dataArr" :key="index">
                            <td data-label="时间">{{item.completeTime}}</td>
                            <td data-label="店铺名称">
                                <p>{{item.storeName}}<span v-if="item.isFlashWithdraw==1" title="闪提宝店铺" class="flash-icon"></span></p>
                                <p class="ING Subtxt">{{item.platformName}}</p>
                            </td>
                            <td data-label="店铺所在地区">
                                {{item.nationalName}}
                            </td>
                            <td data-label="金额">
                                <p> 
                                    <span class="no" v-if="item.type==1">+ {{formatMoney(item.amount)}}</span> 
                                    <span v-if="item.type==2">- {{formatMoney(item.amount)}}</span> 
                                </p>
                                <p class="ING Subtxt">{{item.currency}}</p>
                            </td>
                            <!-- el-option label="全部" value=""></el-option>
                        <el-option label="入账" value="3"></el-option>
                        <el-option label="提现" value="1"></el-option>
                        <el-option label="VAT缴税" value="2"></el-option> -->
                            <td data-label="类型">
                                <span v-if="item.businessType==3">入账</span>
                                <span v-if="item.businessType==1">提现</span>
                                <span v-if="item.businessType==2">VAT缴税</span>
                            </td>
                            <td data-label="店铺余额">
                                <p>{{item.settleAmount || '---'}}</p>
                                <p class="ING Subtxt">{{item.currency}}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CTable>
        </div>
</template>

<script>

    import { Pricemoney } from '../../../../js/common.js';

    import CTable from './../../../../components/CTable.vue';

    export default {
        data(){
            return{
                dataArr:[]
            }
        },
        props:['value'],
        created(){
            this.dataArr = this.value;
        },
        methods:{
            formatMoney(num){
                return Pricemoney(num);
            }
        },
        watch:{
            value(newData){
                this.dataArr = newData;
            }
        },
        components:{
            CTable,
        }
    }
</script>

<style lang="scss">
     //店铺列表标题
    .stroe-listTitile{
        table {
            td{
                p{
                    line-height: 24px;
                }
            }
            .Subtxt{
                font-size: 12px;
            }
        }
    }
</style>
