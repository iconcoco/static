<template>
    <div class="fadeIn payTaxContainer">
        <h2 class="banner-module-title">
             VAT缴税列表
            <a href="javascript:;" class="fr cares-color" @click="jumper('PayTaxApply',{isNew:true})">立即申请VAT缴税</a>
         </h2>
        <el-form :model="form" :inline="true" class="vatApplyList">
            <el-form-item label="选择时间：" class="dataPicker">
                <el-date-picker
                     type="datetimerange"
                     v-model="FormTime"
                     value-format="yyyy-MM-dd HH:mm:ss"
                     range-separator="至"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期"
                     >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="缴税状态：" class="dataPicker">
                <el-select v-model="form.queryStatus" placeholder="请选择缴税状态">
                    <el-option v-for="(item,index) in STATUS" :key="index"
                        v-if="item.customerStatus"
                        :label="item.name"
                        :value="item.customerStatus.join()"
                    ></el-option>
                </el-select>
            </el-form-item>

            <a class="cares-button-primary" @click="toSubmit" href="javascript:;">查询</a>
            <a class="cares-button-primary pain" @click="reset" href="javascript:;">重置</a>
         </el-form>
         <p class="title">缴税记录</p>
         <CTable>
             <table>
                 <thead>
                     <tr>
                         <th>缴税国家</th>
                         <th>VAT号码</th>
                         <!-- <th>EORI号码</th> -->
                         <th>申请时间</th>
                         <th>代缴税金额</th>
                         <th>状态</th>
                         <th>操作</th>
                     </tr>
                 </thead>
                 <tbody> 
                     <tr v-if="!table.length" class="empty">
                        <td colspan="6">暂无数据</td>
                     </tr>
                     <tr v-for="(item,index) in table" :key="index">
                         <td>{{fineValName(item.countryCode,AllNationCode,'nation','code')}}</td>
                         <td>{{item.taxNo}}</td>
                         <!-- <td>FDD23213113134</td> -->
                         <td>{{formatTimer(item.createTime)}}</td>
                         <td>{{item.amount/100}}</td>
                         <td>{{fineValName(item.status,STATUS,'name','status')}}</td>
                         <td>
                             <a href="javascript:;" class="yes" v-if="item.status==0"
                                 @click="jumper('PayTaxApply',{
                                     from:'list',
                                     isNew:false,
                                     id:item.id})"
                             >立即支付</a>
                             <a href="javascript:;" 
                             class="cares-color" 
                              @click="
                              jumper('PayTaxInfo',{
                                     id:item.id})"
                             v-else>查看详情</a>
                         </td>
                     </tr>
                 </tbody>
             </table>
         </CTable>

        <Pagination
                :page='form.pageNum  '
                :pageSize='form.pageSize '
                :count='form.count'
                :countSize='form.countSize'
                :chosefallback='bindChosePage'
        ></Pagination>

    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue';
import {AllNationCode} from './../../../utils/localbase.js';
import { 
    queryPaytaxList
} from './../../../../../js/api.js';
import { formatTimer } from './../../../../../js/common.js';
import { PAY_STATUS } from './../BEForm/var.js';

export default {
    data(){
        return{
            form:{
                queryStatus:'',
                applyStartTime:'',
                applyEndTime:'',

              pageNum :1,  
              pageSize:10,  
              count:1,  
              countSize:1,
              
              
            },
            FormTime:null,
            table:[],

            STATUS:PAY_STATUS,
            AllNationCode:AllNationCode
        }
    },
    components:{
        CTable
    },
    created(){
        this.loadingQuery();
    },
    methods:{
        loadingQuery(){
            this.form.applyStartTime = this.FormTime? this.FormTime[0]: '';
            this.form.applyEndTime = this.FormTime? this.FormTime[1]: '';

            queryPaytaxList(this.form).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.count = res.data.totalPages;
                    this.form.countSize = res.data.totalElements;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        toSubmit(){
            this.form.pageNum = 1;
            this.loadingQuery();
        },
        reset(){
            this.form.queryStatus="";
            this.FormTime = null;
        },
        bindChosePage(){},
        jumper(name,params){
            this.$emit('toPage',{
                name,
                params
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

<style lang="scss" scoped>
.payTaxContainer{
    padding-bottom: 20px;
}
form{
    padding-top: 20px;
    border-bottom: 1px solid #f1f1f1;
    .cares-button-primary{
        min-width: 80px;
        margin-right: 10px;
    }
}

table{
    margin-bottom: 20px;
}

.title{
    padding: 20px 0;
}
</style>
