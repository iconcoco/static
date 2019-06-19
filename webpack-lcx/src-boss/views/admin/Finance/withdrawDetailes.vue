<template>
    <div class="fadeIn">
        <div>
            <div class="table-container KYC-index">
                <h3>提现详情</h3>
                <ul>
                    <li><span>提现账号：</span>{{countData.bankNumber}}</li>
                    <li><span>收款人姓名：</span>{{countData.accountName}}</li>
                    <li><span>银行名称：</span>{{countData.bankName}}</li>
                    <li><span>原币种：</span>{{countData.currency}}</li>
                    <li><span>提现目标币种：</span>{{countData.targetCurrency}}</li>
                    <li><span>提现金额：</span>{{countData.amount}}</li>
                    <li><span>提现状态：</span>
                        <el-radio v-model="form.status" label="0">待处理</el-radio>
                        <el-radio v-model="form.status" label="1">已处理</el-radio>
                        <!-- <el-radio v-model="form.status" label="2">处理成功</el-radio> -->
                        <el-radio v-model="form.status" label="3">处理失败</el-radio>
                    </li>
                    <li style="padding-left:250px;">
                         <el-button  v-if="!(countData.status==1)" @click="bindFormSubmit" type="primary" plain>确认</el-button>
                        <el-button @click="bindCancel"  type="danger">取消</el-button>
                    </li>
                </ul>
                
            </div>
        </div>
    </div>
</template>

<script>
    import {
        queryWithdraw,
        withdrawUpdateStatus} from './../../../utils/axios/api.js';

    export default{
        data(){
            return{
                countData:{
                    bankNumber:'',
                    accountName:'',
                    bankName:'',
                    currency:'',
                    targetCurrency:'',
                    amount:'',
                    status:'',
                },
                form:{
                  withdrawNo:'',
                  status:'',  
                }  
            }
        },
        created(){
            let data = this.$route.params.data;
            if(!data) return this.$router.push({name:"withdrawRecord"});
            this.form.withdrawNo = data.withdrawNo;
            this.form.status = data.status.toString();

            queryWithdraw({
                withdrawNo:data.withdrawNo
            }).then(res=>{
               if(res.code){
                   this.countData = res.data;
               }else{
                   this.$message.error(res.msg);
               }
            });
        },
        methods:{
            bindCancel(){
                this.$router.push({name:'withdrawRecord'});
            },
            bindFormSubmit(){
                if(this.countData.status == this.form.status) return this.$message.warning(`状态未修改！`);
                withdrawUpdateStatus(this.form).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功！`);
                        setTimeout(()=>{
                            this.$router.push({
                                name:"withdrawRecord",
                                params:{
                                    reflesh:true
                                }
                            });
                        },2000);
                   }else{
                       this.$message.error(res.msg);
                   }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    h3{
        font-weight: normal;
        font-size: 16px;
        margin-bottom: 10px;
    }
    ul{
        li{
            height: 50px;
            line-height: 50px;
            padding-left: 100px;
            color: #333;
            >span{
                display: inline-block;
                width: 150px;
                text-align: right;
                margin-right: 10px;
                color: #999;
            }
        }
    }
</style>

