<template>
    <div class="fadeIn">
        <div class="introduction">
            <img src="./../../../../images/ac/autopay.png" alt="自动提现">
            <a class="toDue" href="javascript:;" @click="bindShowModel">查看详细说明</a>
        </div>

        <p class="btn-contianer"><span @click="bindToOpenAutoPay" class="cares-button-primary">立即开通</span></p>


        <AdminModel v-model="showModel" class="__auto-container">
            <div class="auto-intoduc-container">
                <h3>自动提现使用说明</h3>
                <p>开通自动提现的店铺，在该店铺资金变为可提现状态（以收到 CaresPAY 提现短信通知为准）后，CaresPAY 系统将自动打款到您开通时选择的对应提现账户。</p>
                <p>工作时间内收到提现通知短信后，CaresPAY 将当天给您付款；在非工作时间内收到提现通知短信，CaresPAY 会在下一个工作日给您付款。工作时间：周一到周五9:00至18:30，节假日除外。</p>
                <ul>
                    <li>您在开通时需要接受一定的条款，包括但不限于：</li>
                    <li>1）接受换汇汇率为 CaresPAY 实际打款时的合作银行实时交割汇率，所有由于汇率波动而产生的实际交易损失由您本人承担。</li>
                    <li>2）CaresPAY 根据您的需要为您提供相应（电子版）打款凭证。CaresPAY 提供相应（电子版）打款凭证后，CaresPAY 已完成作为代理收款商对该笔资金管理的全部责任，CaresPAY 将不需承担对该笔资金的后续一切法律责任。</li>
                </ul>
                <p>具体以开通时的条款说明为准。</p>
                   <a href="javascript:;" @click="bindToCloseModel" class="cares-button-danger pain">关闭</a>
            </div>
        </AdminModel>
    </div>
</template>

<script>
import AdminModel from './../../../../components/adminModel.vue';

export default {
    data(){
        return{
            showModel:false
        }
    },
    methods:{
        bindToOpenAutoPay(){
            this.$emit("transToEvent",{ type:'info',status: 0 });
        },
        bindShowModel(){
            this.showModel = true;
        },
        bindToCloseModel(){
            this.showModel = false;
        }
    },
    components:{
        AdminModel
    }
}
</script>


<style lang="scss" scoped>
    @import './../../../../css/common/theme.scss';

    .introduction{
        position: relative;
        img
        {
            width: 100%;
        }
        .toDue{
            position: absolute;
            bottom: 60px;
            left: 50%;
            margin-left: -36px;
            font-size: 12px;
            color: #333;
            border-color: #333;
        }
    }

    .btn-contianer{
        text-align: center;
        padding-bottom: 20px;
        a{
            display: inline-block;

        }
    }

 

    .auto-intoduc-container{
        width: 500px;
        padding: 20px;
        color:#333;
        h3{
            text-align: center;
            font-size: 16px;
            margin-bottom: 15px;
        }
        p{
            font-size: 14px;
             text-indent: 2em;
            margin-bottom: 15px;
            line-height: 22px;
            text-align: justify;
            text-justify:inter-ideograph;
            color: #666;
        }
        ul{
            margin-bottom: 15px;
            li{
                line-height: 22px;
                text-indent: 2em;
                font-size: 14px;
                 text-align: justify;
                 text-justify:inter-ideograph;
                 color: #666;
            }
        }
        .pain{
            display: block;
            width: 80px;
            text-align: center;
            margin: 0 auto;
        }
    }
</style>

<style lang="scss">
.__auto-container{
       .modal-container{
            left: 50%;
            margin-left: -260px;
        }
}
</style>

