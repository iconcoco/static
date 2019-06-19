<template>
 <transition name="fade">
    <div>
        <div>
            <div class="table-container KYC-index">
                <h3>提现详情</h3>
                <ul>
                    <li><span>客户姓名：</span>{{userData.name}}</li>
                    <li><span>注册手机号：</span>{{userData.phoneNo}}</li>
                    <li><span>账户类型：</span>{{userData.type==1?"支付宝":"银行卡"}}</li>
                    <li><span>银行卡号：</span>{{userData.accountYh}}</li>
                    <li><span>累计已处理提现金额：</span>{{userData.amountYcl}}</li>
                    <li><span>待处理提现金额：</span>{{userData.amountDcl}}</li>
                    <li><span>申请提现时间：</span>{{userData.createTime}}</li>
                    <li><span>提现状态：</span>
                        <el-radio v-model="form.status" label="1">待处理</el-radio>
                        <el-radio v-model="form.status" label="2">已完成</el-radio>
                    </li>
                    <li style="padding-left:250px;">
                         <el-button v-if="userData.status==1" @click="bindFormSubmit" type="primary" plain>确认</el-button>
                        <el-button @click="bindCancel" type="danger">取消</el-button>
                    </li>
                </ul>
                
            </div>
        </div>
    </div>
 </transition>
</template>

<script>
import { spokmanWithdrawUpdate } from '../../../utils/axios/api.js';
    export default{
        data(){
            return{
                form:{
                    status:'1',
                    id:'',
                },
                userData:{}
            }
        },
        created(){
            let data = this.$route.params.data;
            if(!data) return this.$router.push({name:"SpokesmanWithdraw"});

            this.userData = data;
            this.form.status = data.status;
            this.form.id = data.id;
        },
        methods:{
            bindCancel(){
                this.$router.push({name:"SpokesmanWithdraw"});
            },
            bindFormSubmit(){
                if(this.userData.status == this.form.status) return this.$message.warning(`状态未修改！`);

               spokmanWithdrawUpdate(this.form).then(res=>{
                   if(res.code==0){
                        this.$message.success(`修改成功！`);
                        setTimeout(()=>{
                            this.$router.push({
                                name:"SpokesmanWithdraw",
                                params:{
                                    reflesh:true
                                }
                            });
                        },2000);
                   }else{
                       this.$message.error(res.msg);
                   }
               })
                
            },
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
            width: 50%;
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

