<template>
    <div class="fadeIn">
        <CTable>
            <table>
                <thead>
                    <tr>
                        <th>时间</th>
                        <th class="per25">商品</th>
                        <th class="per25">金额</th>
                        <th class="per25">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in data" :key="index">
                        <td>{{formatTimer(item.createTime)}}</td>
                        <td>
                            <span v-if="item.type==1">注册+首年申报</span>
                            <span v-if="item.type==0">单次注册</span>
                        </td>
                        <td>
                            <p> 
                                <span>- {{item.amount/100}}</span> 
                            </p>
                            <p class="ING Subtxt">{{item.currency}}</p>
                        </td>
                        <td>
                            <span v-if="[0].includes(item.status)" class="ING">{{fineValName(item.status,PayStatus,'name','status')}}</span>
                            <span v-if="[2].includes(item.status)" class="yes">{{fineValName(item.status,PayStatus,'name','status')}}</span>
                            <span v-if="[5,1].includes(item.status)" class="ing">{{fineValName(item.status,PayStatus,'name','status')}}</span>
                            <span v-if="[3,4,6].includes(item.status)" class="no">{{fineValName(item.status,PayStatus,'name','status')}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CTable>
    </div>
</template>

<script>
import CTable from './../../../../components/CTable.vue';
import { formatTimer } from './../../../../js/common.js';
export default {
    props:['data'],
    data(){
        return{
             PayStatus:[
                {status:'',name:'全部'},
                {status:'1',name:'待支付'},
                {status:'2',name:'支付成功'},
                {status:'3',name:'支付失败'},
                {status:'4',name:'取消'},
                {status:'5',name:'退款'},
                {status:'6',name:'已退款'},
            ],
        }
    },
    components:{
        CTable
    },
    methods:{
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
