<template>
    <div class="fadeIn">
        <Step 
        :active="step"
        :Data="['填写税局信息','填写付款信息','确认付款']">
        </Step>
        <component :is="componentId" 
            @jumpTo="getChildrenParams"
            :Data='STEPDATA'
        ></component>
        <ul class="wx-tip">
            <li class="title">温馨提示</li>
            <li>1.您发起VAT缴税申请后，我们将在3个工作日内处理您的缴税申请，为您付款至您指定的VAT税务机构。根据不同国家的VAT税务机构处理付款的时间不同，您的付款在VAT税务 机构处大约需要10-14个工作日的处理时间。请根据您的付款期限尽早提交您的VAT缴税申请，以免被税务机构收取滞纳金或罚款；</li>
            <li>2.VAT缴税申请提交成功后，您可在付款单中查看状态，确认税款支付是否成功；</li>
            <li>3.为了您的资金安全，请确认并准确填写您的付款信息，以保证资金安全。</li>
        </ul>
    </div>
</template>

<script>
import Step from './../../../../../components/step.vue';

import StepOne from './_step_TaxInfo.vue';
import StepTwo from './_step_FillInfo.vue';
import StepThree from './_step_Pay.vue';
import { 
    queryPaytaxList
} from './../../../../../js/api.js';
export default {
    props:['Data'],
    data(){
        return{
            step:1, //当前第几个阶段
            componentId:'',
            STEPDATA:{},
        }
    },
    created(){
        // this.step = this.Data.status
        if(this.Data.isNew){
            //新申请的
            this.componentId = 'StepOne';
            this.STEPDATA = this.Data;
        }else{
            if(this.Data.from == 'list'){
                this.loadingQuery(this.Data.id);
            }
        }
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
                    this.step=3;
                    this.switchComponent();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        getChildrenParams(params){
            this.step = params.step;
            this.STEPDATA = params.params;

            this.switchComponent();
        },
        switchComponent(){
            switch(Number(this.step)){
                case 1:{ this.componentId = 'StepOne' }break;
                case 2:{ this.componentId = 'StepTwo' }break;
                case 3:{ this.componentId = 'StepThree' }break;
            }
        },
    },
    components:{
        Step,
        StepOne,
        StepTwo,
        StepThree,
    }
}
</script>


<style lang="scss" scoped>
.wx-tip{
    font-size: 12px;
    margin-top: 20px;
    padding-bottom: 20px;
    .title{
        font-size: 14px;
    }
    li{
        margin: 5px 0;
        line-height: 24px;
    }
}
</style>
