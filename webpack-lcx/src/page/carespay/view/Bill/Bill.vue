<template>
        <!--店铺详细列表-->
        <div class="stroe-listTitile row fadeIn">
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th class="per25">时间</th>
                            <th class="per25">店铺名称</th>
                            <th class="per25">店铺所在地区</th>
                            <th class="per25">金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!dataArr || value.length==0" class="empty">
                            <td colspan="5">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in dataArr" :key="index">
                            <td data-label="时间">{{item.completeTime}}</td>
                            <td data-label="店铺站点">
                                <p>{{item.storeName}}</p>
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
