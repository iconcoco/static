<template>
    <div class="check-container">
        <h3>代言人收款账户信息</h3>
        <!-- 查看页面 -->
        <div v-if="!isEdit"  class="check-page">
            <template v-if="accountInfo.type==1">
                <p>账户类型<b>支付宝</b></p>
                <p>姓名<b>{{accountInfo.name}}</b></p>
                <p>支付宝账号<b>{{accountInfo.accountNo}}</b></p>
            </template>

            <template v-if="accountInfo.type==2">
                <p>账户类型<b>银行卡</b></p>
                <p>开户人姓名<b>{{accountInfo.name}}</b></p>
                <p>银行卡号<b>{{accountInfo.accountNo}}</b></p>
                <p>开户支行<b>{{accountInfo.accountName}}</b></p>
            </template>

            <button @click="bindEditInfo">修改</button>
        </div>

        <div v-if="isEdit" class="edit-page">
            <p>
                <b>账户类型</b>
                <el-select v-model="form.type" placeholder="请选择提现类型">
                    <el-option label="支付宝" :value="1"></el-option>
                    <el-option label="银行卡" :value="2"></el-option>
                </el-select>
            </p>

            <template v-if="form.type==1">
                <p><b>姓名</b><el-input v-model="form.name" maxlength="16" placeholder="请输入姓名"></el-input></p>
                <p><b>支付宝账号</b><el-input v-model="form.accountNo" placeholder="请输入支付宝账号"></el-input></p>
            </template>

            <template v-else>
                <p><b>开户人姓名</b><el-input v-model="form.name" maxlength="16" placeholder="请输入开户人姓名"></el-input></p>
                <p><b>银行卡号</b><el-input v-model="form.accountNo" type="tel" placeholder="请输入银行卡号"></el-input></p>
                <p><b>开户行支行</b><el-input v-model="form.accountName" placeholder="请输入开户行支行"></el-input></p>
            </template>

            <div class="handle clearfix">
                <button @click="bindCancelEdilt" class="fl cancel">取消</button>

                <button v-if="form.type==1" class="fr confirm" :class="{disabled:(!form.name||!form.accountNo)}" @click="bindConfirmSubmit">确认</button>
                <button v-if="form.type==2" class="fr confirm" :class="{disabled:(!form.name||!form.accountNo||!form.accountName)}" @click="bindConfirmSubmit">确认</button>
            </div>

        </div>

        <Notice></Notice>
        <!-- 成功提示 -->
        <Success v-if="isSuccess"></Success>
    </div>
</template>

<script>

    import Notice from '../common/notice.vue';
    import Success from '../common/success.vue';
    import { spokesmanBankInfo,spokesmanEditAccountInfo,spokesmanGetInfo } from '../../../uitls/api.js';
    export default{
        data(){
            return{
                isEdit:false,
                isSuccess:false,
                /** 提交修改账号信息 **/
                form:{
                    type:'',
                    name:'',
                    accountNo:'',
                    accountName:''
                },
                /**代言人收矿账户信息 */
                accountInfo:{
                  type:'',
                  name:'',
                  accountNo:'',
                  accountName:''
                }
            }
        },
        created(){
            spokesmanGetInfo().then(res=>{
                if(res.code==0){
                    res.data ? this.laodingQuery() : this.$router.push({name:"spokes"});
                }else{
                    alert(res.msg);
                }
            })
            
        },
        methods:{
            //加载请求
            laodingQuery(){
                spokesmanBankInfo().then(res=>{
                    if(res.code==0){
                        if(!res.data){
                            this.$router.push({name:"spokesBindAccount"});//添加账户的页面
                        }else{
                             Object.assign(this.accountInfo,res.data);
                             Object.assign(this.form,res.data);
                        }
                    }else{
                        alert(res.msg);
                    }
                });
            },
            //确认修改提交按钮
            bindConfirmSubmit(){
                let m = null;

                this.form.type==1 ? ( m = ["name","accountNo"]) : (  m = ["name","accountNo","accountName"] );
                //验证必填信息
                for(let i = 0; i<m.length; i++){
                    if(!this.form[m[i]]) return;
                }

                spokesmanEditAccountInfo(this.form).then(res=>{
                   if(res.code==0){
                        this.isSuccess = true;
                        setTimeout(()=>{
                            this.isSuccess = false;
                            this.isEdit = false;
                            this.laodingQuery();
                        },2000)
                   }else{
                       alert(res.msg);
                   }
                });
            },
            bindEditInfo(){
                this.isEdit = true;
                for (const key in this.form) {
                    // if (!(key=='type')) {
                        this.form[key] = this.accountInfo[key];
                    // }
                }
            },
            //取消修改
            bindCancelEdilt(){
                this.isEdit = false;
                // Object.assign(this.accountInfo,this.form);

            }
        },
        components:{
          Notice,
          Success
        }
    }
</script>
