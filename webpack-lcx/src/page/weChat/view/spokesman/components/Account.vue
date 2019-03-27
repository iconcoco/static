<template>
    <div class="account-container">
        <div>
            <h3>请完善收款账户信息</h3>
            <p class="account-type">
                <el-radio v-model="form.type" label="1">支付宝收款</el-radio>
                <el-radio v-model="form.type" label="2">银行卡收款</el-radio>
            </p>
        </div>

        <div class="alipay">
            <template v-if="form.type==1">
                <p><span>姓名</span> <el-input maxlength="8" v-model="form.name" placeholder="请输入姓名"></el-input> </p>
                <p><span>支付宝账号</span> <el-input v-model="form.accountNo" maxlength="50" placeholder="请输入支付宝账号"></el-input> </p>
            </template>

            <template v-else>
                <p><span>开户人姓名</span> <el-input maxlength="8" v-model="form.name" placeholder="请输入姓名"></el-input> </p>
                <p><span>银行卡号</span> <el-input v-model="form.accountNo" maxlength="21" type="tel" placeholder="请输入银行卡号"></el-input> </p>
                <p><span>开户行支行名称</span> <el-input v-model="form.accountName" maxlength="30" placeholder="请输入支行名称"></el-input> </p>
            </template>
            
        </div>

        <button v-if="form.type==1" :class="{disabled:(!form.name||!form.accountNo)}" @click="editAccountInfo">提交</button>
        <button v-if="form.type==2" :class="{disabled:(!form.name||!form.accountNo||!form.accountName)}" @click="editAccountInfo">提交</button>

        <Notice></Notice>
        <!-- 成功提示 -->
        <Success v-if="isSuccess"></Success>

    </div>
</template>

<script>
    import Notice from '../common/notice.vue';
    import Success from '../common/success.vue';
    import { spokesmanEditAccountInfo } from '../../../uitls/api.js';

    export default{
        data(){
            return{
                isSuccess:false,
                form:{
                    type:"1",
                    name:'',
                    accountNo:'',
                    accountName:''
                }
            }
        },
        methods:{
          editAccountInfo(){

              let m = null;

             this.form.type==1 ? ( m = ["name","accountNo"]) : (  m = ["name","accountNo","accountName"] );

             for(let i = 0; i<m.length; i++){
                 if(!this.form[m[i]]) return;
             }

            spokesmanEditAccountInfo(this.form).then(res=>{
                if(res.code==0){
                     this.isSuccess = true;
                     setTimeout(()=>{
                         this.$router.push({name:"spokesQuery"});
                     },2000)
                }else{
                    alert(res.msg);
                }
            });
          }
        },
        watch:{
            bankType(n){
                this.form.accountNo = ""
                this.form.type==1 && (  this.form.accountName = "");
            },
        },
        computed:{
            bankType(){
                return this.form.type;
            },
        },
        components:{
            Notice,
            Success
        }
    }
</script>