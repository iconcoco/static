<template>
    <div class="fadeIn">
        <div class="AdminPlate">
            <div class="success success-fadeIn">
                <span class="success-icon"></span>
                <template v-if="source=='FleshWithdraw'">恭喜您已成功开通闪提宝！</template>
                <template v-else-if="source=='PayTaxDone'">您的VAT缴税申请发起成功！</template>
                <template v-else>提交成功</template>
            </div>

            <template v-if="source=='Authentication'">
                <p>您提交的实名认证信息将于2个工作日内审核完毕，待审核通过发放收款子账号，您可在<router-link class="cares-color" to="/Pesonal/realname?isactive=1">实名认证</router-link>页面查看审核状态</p>
                <p><span class="cares-color">{{text}}</span>秒后自动跳转至首页</p>
            </template>

            <template v-if="source=='AddCashAccount'">
                <p>提现账户将于2个工作日内审核完毕，您可在<a class="cares-color" href="javascript:;"  @click="jumpRouter('CashAccountContainer')">我的提现账户</a>页面查看提现账户审核状态</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('CashAccountContainer')">继续添加提现账户</a>
                    <a class="cares-button-primary pain" @click="jumpRouter('AdminIndex')">返回首页</a>
                </p>
            </template>

            <template v-if="source=='AddStore'">
                <p>收款账户将于2个工作日内审核完毕后发放，您可在<a class="cares-color" href="javascript:;"  @click="jumpRouter('StoreManage')">店铺管理</a>页面点击店铺名称进行查看</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('AddShop')">继续添加店铺</a>
                    <a class="cares-button-primary pain" @click="jumpRouter('StoreManage')">返回店铺管理</a>
                </p>
            </template>

            <template v-if="source=='FleshWithdraw'">
                <p>极速提现：<span class="no">闪提宝</span>和<span class="no">自动提现</span>搭配更配哦！</p>
                <p class="btn">
                    <router-link class="cares-button-primary" to="/AutoPay?tab=0">开通自动提现</router-link>
                    <a class="cares-button-primary pain" @click="jumpRouter('FastArrival')">返回闪提宝店铺页</a>
                </p>
            </template>

            <!-- VAT申请成功 -->
            <template v-if="source=='VATRegistDone'">
                <p>您的申请已提交，CaresPAY工作人员将在1-2个工作日内与您取得联系，请及时准备申请资料。</p>
                <p>您的注册申请将通过代理机构办理，需要支付一定的手续费</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('VATapply',{TO:'applyList'})">查看申请记录</a>
                    <!-- <router-link class="cares-button-primary" to="/vat/apply">查看申请记录</router-link> -->
                </p>
            </template>

            <!-- VAT确认支付服务费 -->
            <template v-if="source=='VATServicePrice'">
                <p>CaresPAY工作人员已将您的申请资料提交至税局，您可在我的<span @click="jumpRouter('VATapply',{TO:'applyList'})" class="cares-color">申请记录</span>页面查看VAT注册进度状态。</p>
                <p class="btn">
                    <a class="cares-button-primary" @click="jumpRouter('VATapply',{TO:'applyDetails'})">继续申请VAT税号</a>
                    <a class="cares-button-primary pain" @click="jumpRouter('VATapply',{TO:'applyList'})">返回我的申请记录</a>
                </p>
            </template>

            <!-- 报税 1 成功页 -->
            <template v-if="source=='VATreportApply'">
                <p>报税金额结果将于3～5工作日内计算完毕，您可在申报记录页面查看VAT报税进度</p>
                <p class="btn">
                    <router-link class="cares-button-primary" to="/vat/report">继续VAT报税</router-link>
                    <a class="cares-button-primary pain" @click="jumpRouter('VATreport',{TO:'ReportDetails',ID:temp})">查看申报详情</a>
                </p>
            </template>
            
            <!-- 报税 3,4  确认税金成功页-->
             <template v-if="source=='VATConfirmTaxMoney'">
                <p>申报结果将于3～5工作日（时间待定）内审核完毕，您可在申报记录页面查看VAT报税进度</p>
                <p class="btn">
                    <router-link class="cares-button-primary" to="/vat/report">继续VAT报税</router-link>
                    <a class="cares-button-primary pain" @click="jumpRouter('VATreport',{TO:'ReportDetails',ID:temp})">查看申报详情</a>
                </p>
            </template>

            <!-- 确认税金有异议 -->
             <template v-if="source=='VATMoneyDisagreedSubmit'">
                <p>提交异议的1～2个工作日内将会有CaresPAY的专业客户人员线下跟进，请留意！您可在申报记录页面查看VAT报税进度</p>
                <p class="btn">
                    <router-link class="cares-button-primary" to="/vat/report">继续VAT报税</router-link>
                    <a class="cares-button-primary pain" @click="jumpRouter('VATreport',{TO:'ReportDetails',ID:temp})">查看申报详情</a>
                </p>
            </template>

            <!-- 赋税 -->
            <template v-if="source=='PayTaxDone'">
                <p>您的付款在VAT税务 机构处大约需要10-14个工作日的处理时间，您可在缴税详情中查看付款状态，确认税款支付是否成功！</p>
                <p class="btn">
                    <router-link class="cares-button-primary" to="/vat/payTax">继续VAT缴税</router-link>
                    <a class="cares-button-primary pain" @click="jumpRouter('VATpay',{TO:'PayTaxInfo',ID:temp})">查看缴税详情</a>
                </p>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            source:'Authentication',
            text: 5,
            timeId:null,
            temp:null
        }
    },
    created(){

        let source = this.$route.params.source || "";

        if(!source) return this.jumpRouter('AdminIndex');

        this.source = source;
        switch(source.toUpperCase()){
            case 'AUTHENTICATION':
            {   
                let t = 5;
                this.timeId = setInterval(()=>{
                    t--;
                    this.text=t;
                    if(t<=0){
                        this.jumpRouter('AdminIndex');
                        clearInterval(this.timeId);
                    }
                },1000);
            }
            break;
            case 'VATMONEYDISAGREEDSUBMIT':
            case 'VATCONFIRMTAXMONEY' :
            case 'VATREPORTAPPLY':
            case 'PAYTAXDONE':
            {
                this.temp = this.$route.params.id
            }
            break;
        }
    },
    methods:{
        jumpRouter(name,params){
            this.$router.push({
                name,
                params
            }); 
        },
    },
    destroyed(){
        clearInterval(this.timeId);
    }
}
</script>



<style lang="scss" scoped>
.AdminPlate{
    padding-top: 20px;
    padding-bottom: 20px;
    // min-height: 300px;
    p{
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }

    .success{
        font-size: 20px;
        margin-bottom: 20px;
        color: #57c22d;
        // opacity: 0;
        span{
            margin-right: 10px;
            margin-top: -5px;
        }
    }

    .btn{
        margin-top: 20px;
        .cares-button-primary{
            margin-right: 20px;
        }
    }
}


</style>
