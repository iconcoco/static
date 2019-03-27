<template>
       <!--店铺详细列表-->
        <div class="stroe-listTitile row fadeIn">
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>提现时间</th>
                            <th>店铺名称</th>
                            <th>地区</th>
                            <th>提现金额</th>
                            <th>服务费</th>
                            <th>实际到账金额</th>
                            <th>入账银行信息</th>
                            <th>汇率</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!dataArr || data.length==0" class="empty">
                            <td colspan="9">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in dataArr" :key="index">
                            <td>{{item.applyDate}}</td>
                            <td>
                                <p>{{item.storeName}}</p>
                                <p class="ING Subtxt">{{item.platformName}}</p>
                            </td>
                            <td>{{item.nationalName}}</td>
                            <td>
                                <p>{{formatMoney(item.withdrawAmount)}}</p>
                                <p class="ING Subtxt">{{item.currency}}</p>
                            </td>
                            <td>
                                <p>{{formatMoney(item.serviceCharge)}}</p>
                                <p class="ING Subtxt">{{item.currency}}</p>
                            </td>
                            <td>
                                <p>{{item.targetAmount}}</p>
                                <p class="ING Subtxt">{{item.targetCurrency || 'CNY'}}</p>
                            </td>
                            <td>
                                <p>{{item.bankName}}</p>
                                <p class="ING Subtxt">{{item.bankNumber}}</p>
                            </td>
                            <td>{{item.exchangeRate}}</td>
                            <td>
                                <span v-if="item.status==0" class="point ING"></span> 
                                <span v-if="item.status==1" class="point ING"></span> 
                                <span v-if="item.status==2" class="point yes"></span> 
                                <span v-if="item.status==3" class="point no"></span> 
                                {{item.withdrawStatus}}
                            </td>

                            <!-- <td data-label="提现时间">{{item.applyDate}}</td>
                            <td data-label="店铺名称"></td>
                            <td data-label="到账时间">{{item.inAccountDate}}</td>
                            <td data-label="提现金额">{{item.currency}} {{formatMoney(item.withdrawAmount)}}</td>
                            <td data-label="手续费">{{item.serviceCharge}}</td>
                            <td data-label="费率">{{item.serviceRate}}</td>
                            <td data-label="入账账号尾号">{{item.bankNumber}}</td>
                            <td data-label="汇率">{{item.exchangeRate}}</td>
                            <td data-label="状态">{{item.withdrawStatus}}</td> -->
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
        props:['data'],
        created() {
            this.dataArr = this.data
        },
        methods:{
            formatMoney(num){
                return Pricemoney(num);
            }
        },
        watch:{
            data(newData){
                this.dataArr = newData;
            }
        },
        components:{
            CTable
        }
    }
</script>
