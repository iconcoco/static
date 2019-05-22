<template>
    <div>
        <p class="title">VAT待申报信息</p>
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>申报国家</th>
                        <th>增值税/商品和服务税登记号</th>
                        <th>申报月份</th>
                        <th>申报截止日</th>
                        <th>销售数据</th>
                        <th>本期报税金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{fineValName(DATA.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{DATA.taxNo}}</td>
                        <td>{{DATA.months.join('/')}}月</td>
                        <td>{{formatTimer(DATA.deadlineTime)}}</td>
                        <td>
                            <a class="cares-color" 
                                v-if="DATA.summaryReport" 
                                target="_blank" 
                                :href="`${download}${DATA.summaryReport}`">
                                <span class="fa fa-cloud-download"></span> 下载Summary Report文件
                            </a>
                            <br/>
                            <a class="cares-color" 
                                v-if="DATA.transactionReport" 
                                target="_blank" 
                                :href="`${download}${DATA.transactionReport}`">
                                <span class="fa fa-cloud-download"></span> 下载transaction Report文件
                            </a>
                        </td>
                        <td>
                            <span class="cares-color">计算中</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>

         <p class="title">VAT税号信息</p>
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>公司名</th>
                        <th>申报国家</th>
                        <th>增值税/商品和服务税登记号</th>
                        <th>已报税次数</th>
                        <th>剩余报税次数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{DATA.companyName}}</td>
                        <td>{{fineValName(DATA.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{DATA.taxNo}}</td>
                        <td>{{DATA.useDeclaraCount}}</td>
                        <td>{{DATA.declaraCount-DATA.useDeclaraCount}}</td>
                    </tr>
                </tbody>
            </table>
        </CTable>

        <p class="title">报税记录</p>
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>申报国家</th>
                        <th>增值税号</th>
                        <th>申报月份</th>
                        <th>销售文件</th>
                        <th>税金确认函</th>
                        <th>支付信息</th>
                        <th>支付回执</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!table.length" class="empty">
                        <td colspan="7">暂无数据</td>
                     </tr>
                    <tr v-for="(item,index) in table" :key="index">
                        <td>{{fineValName(item.countryCode,AllNationCode,'nation','code')}}</td>
                        <td>{{item.taxNo}}</td>
                        <td>{{item.months.join('/')}}</td>
                        <!-- 销售文件 -->
                        <td>
                                <a class="cares-color" 
                                    v-if="item.summaryReport" 
                                    target="_blank" 
                                    :href="`${download}${item.summaryReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载Summary Report文件
                                </a>
                                <br/>
                                <a class="cares-color" 
                                    v-if="item.transactionReport" 
                                    target="_blank" 
                                    :href="`${download}${item.transactionReport}`">
                                    <span class="fa fa-cloud-download"></span> 下载transaction Report文件
                                </a>
                        </td>
                        <!-- 税金确认函 -->
                        <td>
                            <a class="cares-color" 
                               v-if="item.taxConfirm" 
                               target="_blank" 
                               :href="`${download}${item.taxConfirm}`">
                               <span class="fa fa-cloud-download"></span> 下载税金确认函
                            </a>
                        </td>
                        <!-- 支付信息 -->
                        <td>
                            <a class="cares-color" 
                                v-if="item.payInfo" 
                                target="_blank" 
                                :href="`${download}${item.payInfo}`">
                                <span class="fa fa-cloud-download"></span> 下载支付信息
                            </a>
                        </td>
                        <!-- 支付回执 -->
                        <td>
                            <a class="cares-color" 
                                v-if="item.payReceipt" 
                                target="_blank" 
                                :href="`${download}${item.payReceipt}`">
                                <span class="fa fa-cloud-download"></span> 下载支付回执
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>
    </div>
</template>

<script>
// downloadfile
import CTable from './../../../../../components/CTable.vue';
import { 
    findDeclarationModelList 
    ,downloadfile
} from './../../../../../js/api.js';
import { formatTimer } from './../../../../../js/common.js';
import {AllNationCode} from './../../../utils/localbase.js';

export default {
    data(){
        return {
            download:downloadfile,
            table:[],
            AllNationCode:AllNationCode
        }
    },
    components:{
        CTable
    },
    props:['DATA'],
    created(){
        this.loadingQuery();
    },
    methods:{
        loadingQuery(){
            findDeclarationModelList({
                customerNo:this.DATA.customerNo,
                countryCode:this.DATA.countryCode,
                pageNum:1,
                pageSize:10,
            }).then(res=>{
                if(res.code==0){
                    this.table = res.data.list 
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        formatTimer(code){
            return formatTimer(code);
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    }
}
</script>
