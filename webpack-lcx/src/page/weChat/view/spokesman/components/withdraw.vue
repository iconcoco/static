<template>
    <div class="withdraw-container">
        <!-- 填写信息 -->
        <div class="fill-info" v-show="!showResult">
            <div class="bonus-info">
                <p>现金奖励<b>{{bonusInfo.amount}}</b></p>
                <p>已领取金额<b>{{bonusInfo.amountYcl}}</b></p>
                <p>可领取金额<b>{{bonusInfo.amountKlq}}</b></p>
            </div>

            <div class="bonus-withdraw">
                <p>提现金额</p>
                <p class="bonus-input">
                    <span>￥</span>
                    <el-input :maxlength="maxlength" @input="bindIptChange" type="tel" v-model="form.amount" placeholder="请输入提现金额"></el-input>
                </p>
                <p>提现金额不能大于可领取金额</p>
                <button @click="bindToConfirm" :class="{disabled:form.amount<=0}">提交领取信息</button>
            </div>
        </div>

        <!-- 确认信息 -->
        <div class="con-info" v-show="showResult">
            <h3>请确保您提交的信息无误</h3>
            <div class="account-info">
                <template v-if="form.type==1">
                    <p>姓名<b>{{bankInfo.name}}</b> </p>
                    <p>支付宝账号<b>{{bankInfo.accountNo}}</b> </p>
                </template>

                <template v-else>
                    <p>开户人姓名<b>{{bankInfo.name}}</b> </p>
                    <p>银行卡号<b>{{bankInfo.accountNo}}</b> </p>
                    <p>开户行支行<b>{{bankInfo.accountName}}</b> </p>
                </template>

                <p>申请领取金额<b>{{form.amount}}</b></p>
            </div>
            <div class="handle clearfix">
                <button @click="bindGoBack" class="fl modify">修改</button>
                <button @click="bindApplyWithdraw" class="fr submit">提交</button>
            </div>
        </div>

        <Notice></Notice>
        <Success v-if="isSuccess"></Success>
    </div>
</template>

<script>
    import { spokesmanBankInfo , spokesmanApplyWithdraw} from '../../../uitls/api.js';
    import Notice from '../common/notice.vue';
    import Success from '../common/success.vue';
    export default{
        data(){
            return{
                showResult:false,
                isSuccess:false,
                maxlength:1,
                form:{
                    amount:"",
                    type:""
                },
                bonusInfo:{
                    amountKlq:""
                },
                bankInfo:{}
            }
        },
        created(){
            if(!Object.keys(this.$route.params).length) this.$router.push({name:"spokesQuery"});
            this.bonusInfo = this.$route.params;
           this.bonusInfo.amountKlq && (this.maxlength = this.bonusInfo.amountKlq.length);

             spokesmanBankInfo().then(res=>{
                 if(res.code==0){
                     if(!res.data){
                        this.$router.push({name:"spokesBindAccount"});
                     }else{
                        this.form.type = res.data.type;
                        this.bankInfo = res.data;
                     }
                 }else{
                     alert(res.msg);
                 }
            });
        },
        methods:{
            bindIptChange(){
                
                if(Number(this.form.amount)>Number(this.bonusInfo.amountKlq)){
                    this.form.amount = this.bonusInfo.amountKlq;
                }
            },
            //确认信息的
            bindToConfirm(){
                if(!this.form.amount) return;
                this.showResult = true;
            },
            //返回修改信息
            bindGoBack(){
                this.showResult = false;
            },
            bindApplyWithdraw(){
                spokesmanApplyWithdraw(this.form).then(res=>{
                    if(res.code==0){
                        this.isSuccess = true;
                        setTimeout(() => {
                            this.$router.push({name:"spokesRecord"})
                        }, 2000);
                    }else{
                        alert(res.msg);
                    }
                });
            }
        },
        components:{
            Notice,
            Success
        }
    }
</script>
