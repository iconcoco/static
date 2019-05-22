<template>
    <div class="fadeIn payTaxInfo">
        <h2 class="banner-module-title">
            VAT缴税详情
        </h2>
        <div class="authentyStatus">
            缴税状态：
            <span v-if="STEPDATA.status==1" class="cares-color">审核中（预计1～3个工作日内审核完毕）</span>
            <span v-if="STEPDATA.status==2" class="cares-color">审核失败</span>
            <span v-if="STEPDATA.status==6" class="cares-color">缴税异常</span>
            <span v-if="[3,4,7].includes(STEPDATA.status)" class="cares-color">付款税局中（预计10～14个工作日内处理完毕）</span>
            <template v-if="[5].includes(STEPDATA.status)">
                <span class="yes">缴税成功</span>
                （您可在英国税局官网查看缴税详情<a href="https://www.gov.uk" class="cares-color" target="__blank">https://www.gov.uk</a> ）
            </template>
            <div class="refuse-reason" v-if="[2,6].includes(STEPDATA.status)">
                <p>因为以下原因，您的VAT缴税{{fineValName(STEPDATA.status,STATUS,'status','name')}}：</p>
                <ul>
                    <li>
                        <i class="point no"></i> {{STEPDATA.failReason}}
                    </li>
                </ul>
            </div>
        </div>


        <form action="" class="Apply-vat-form">
            <div class="form-item">
                <span>税局机构</span>
                <div class="item">{{STEPDATA.taxBureauName}}</div>
            </div>

            <div class="form-item">
                <span>收款账号 Account Number</span>
                <div class="item">{{STEPDATA.taxBureauAccount}}</div>
            </div>

            <div class="form-item">
                <span>银行识别码 BIC</span>
                <div class="item">{{STEPDATA.taxBureauBic}}</div>
            </div>

            <div class="form-item">
                <span>路由号码 Sort Code</span>
                <div class="item">{{STEPDATA.taxBureauRouting}}</div>
            </div>

            <div class="form-item">
                <span>银行名称 Bank  Name</span>
                <div class="item">{{STEPDATA.taxBureauBankName}}</div>
            </div>
 
            <div class="form-item line">
                <span>账户名称 Account Name</span>
                <div class="item">{{STEPDATA.taxBureauAccountName}}</div>
            </div>


            <div class="form-item ">
                <span>VAT税号</span>
                <div class="item">{{STEPDATA.taxNo}}</div>
            </div>

            <!-- <div class="form-item">
                <span>EORI号码</span>
                <div class="item">{{STEPDATA.taxBureauName}}</div>
            </div> -->

            <div class="form-item">
                <span>税务单据</span>
                <div class="item">{{STEPDATA.taxBureauName}}</div>
            </div>

            <div class="form-item">
                <span>缴税回执单</span>
                <div class="item">
                    <!-- taxPayReceipt -->
                    <a href="javascript:;" class="toDue">下载缴税成功回执单</a>
                </div>
            </div>
            
            <div class="form-item line">
                <span>缴税金额</span>
                <div class="item">{{STEPDATA.amount/100}}</div>
            </div>

            <p class="payInfo">付款信息</p>
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>店铺名称</th>
                            <th>国家</th>
                            <th>币种</th>
                            <th>支付金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{STEPDATA.taxBureauName}}</td>
                            <td>{{STEPDATA.taxBureauName}}</td>
                            <td>{{STEPDATA.taxBureauName}}</td>
                            <td>{{STEPDATA.taxBureauName}}</td>
                        </tr>
                    </tbody>
                </table>
            </CTable>
        </form>

        <p class="btn" v-if="[2,6].includes(STEPDATA.status)">
            <span class="cares-button-primary">重新发起缴税</span>
        </p>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue'; 
import { 
    queryPaytaxList
} from './../../../../../js/api.js';

import { PAY_STATUS } from './../BEForm/var.js';

export default {
    data(){
        return {
            STEPDATA:{},
            STATUS:PAY_STATUS
        }
    },
    components:{
        CTable
    },
    props:['Data'],
    created(){
        this.loadingQuery(this.Data.id);
    },
    methods:{
        loadingQuery(id){
            queryPaytaxList({
                id,
                pageNum :1,  
                pageSize:10,  
            }).then(res=>{
                if(res.code==0){
                    this.STEPDATA = res.data.content[0];
                }else{
                    this.$Message.error(res.msg);
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
    }
    
}
</script>


<style lang="scss" scoped>
.authentyStatus{
    padding: 15px 0;
    border-bottom: 1px solid #f1f1f1;
    font-size: 14px;
}
.payInfo{
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
}

.btn{
    padding: 20px 0;
}

form{
    padding-top: 10px;
    .form-item{
        margin-bottom: 10px;
    }
    .line{
        padding-bottom: 10px;
    }
}


.payTaxInfo{
    padding-bottom: 20px;
}

   //审核失败
    .refuse-reason{
        margin-top: 10px;
        padding: 10px;
        font-size: 12px;
        background-color: #F2F8FC;
        >p{
            line-height: 30px;
        }
        .point{
            margin-top: -3px;
        }
    }
</style>
